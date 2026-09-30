import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { createConnection, createServer } from "node:net";
import { cp, mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const backendSource = join(repoRoot, "apps/convex-backend");
const tempPrefix = ".tmp-lomo-e2e-";
const convexApiUrl = "http://127.0.0.1:3210";
const convexSiteUrl = "http://127.0.0.1:3211";
const siteUrl = "http://localhost:3000";
const processes = new Set();
let receivedSignal;

function isolatedEnvironment(extra = {}) {
	const env = {
		...process.env,
		...extra,
		CI: "1",
	};
	delete env.CONVEX_DEPLOY_KEY;
	delete env.CONVEX_DEPLOYMENT;
	delete env.CONVEX_SELF_HOSTED_URL;
	return env;
}

async function assertPortAvailable(port) {
	await new Promise((resolveListen, rejectListen) => {
		const server = createServer();
		server.once("error", (error) => {
			if (error.code === "EADDRINUSE") {
				rejectListen(new Error(`Port ${port} is in use. Stop the local service using it and retry E2E.`));
				return;
			}
			rejectListen(error);
		});
		server.listen(port, "127.0.0.1", () => {
			server.close((error) => error ? rejectListen(error) : resolveListen());
		});
	});
}

function startProcess(command, args, options) {
	const child = spawn(command, args, {
		...options,
		detached: process.platform !== "win32",
	});
	const handle = {
		child,
		done: new Promise((resolveDone, rejectDone) => {
			child.once("error", rejectDone);
			child.once("close", (code, signal) => resolveDone({ code, signal }));
		}),
	};
	handle.done.catch(() => {});
	processes.add(handle);
	child.once("close", () => processes.delete(handle));
	child.once("error", () => processes.delete(handle));
	return handle;
}

function signalProcess(handle, signal) {
	const { child } = handle;
	if (child.exitCode !== null || child.signalCode !== null || !child.pid)
		return;
	try {
		if (process.platform === "win32")
			child.kill(signal);
		else
			process.kill(-child.pid, signal);
	}
	catch (error) {
		if (error.code !== "ESRCH")
			throw error;
	}
}

async function stopProcess(handle) {
	if (!handle || handle.child.exitCode !== null || handle.child.signalCode !== null)
		return;

	signalProcess(handle, "SIGTERM");
	let timeout;
	await Promise.race([
		handle.done.catch(() => {}),
		new Promise(resolveTimeout => {
			timeout = setTimeout(resolveTimeout, 3000);
		}),
	]);
	clearTimeout(timeout);
	if (handle.child.exitCode === null && handle.child.signalCode === null) {
		signalProcess(handle, "SIGKILL");
		await handle.done.catch(() => {});
	}
}

async function waitForPort(port, timeoutMs) {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		try {
			await new Promise((resolveConnection, rejectConnection) => {
				const socket = createConnection(port, "127.0.0.1");
				socket.once("connect", () => {
					socket.destroy();
					resolveConnection();
				});
				socket.once("error", rejectConnection);
			});
			return;
		}
		catch (error) {
			if (error.code !== "ECONNREFUSED")
				throw error;
		}
		await new Promise(resolveWait => setTimeout(resolveWait, 200));
	}
	throw new Error(`Timed out waiting for local Convex to listen on port ${port}.`);
}

async function runCommand(command, args, options) {
	const handle = startProcess(command, args, { ...options, stdio: ["ignore", "pipe", "pipe"] });
	handle.child.stdout.on("data", (chunk) => {
		process.stdout.write(chunk);
	});
	handle.child.stderr.on("data", (chunk) => {
		process.stderr.write(chunk);
	});
	const result = await handle.done;
	if (result.code !== 0)
		throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.code ?? result.signal}.`);
}

async function createTempBackend(tempRoot) {
	const backendDir = join(tempRoot, "backend");
	await mkdir(backendDir);
	await mkdir(join(backendDir, "convex"));
	await cp(join(backendSource, "package.json"), join(backendDir, "package.json"));
	await symlink(join(backendSource, "node_modules"), join(backendDir, "node_modules"), "dir");
	await writeFile(
		join(backendDir, ".e2e-deployment.env"),
		`SITE_URL=${siteUrl}\nBETTER_AUTH_SECRET=${randomBytes(32).toString("hex")}\nADMIN_EMAILS=e2e-admin@example.test\n`,
		{ mode: 0o600 },
	);
	return backendDir;
}

async function main() {
	let tempRoot;
	let convexProcess;
	let playwrightProcess;
	const onSignal = (signal) => {
		for (const handle of processes)
			signalProcess(handle, signal);
	};
	const onInterrupt = () => onSignal("SIGINT");
	const onTerminate = () => onSignal("SIGTERM");
	process.once("SIGINT", onInterrupt);
	process.once("SIGTERM", onTerminate);

	try {
		for (const port of [3000, 3210, 3211])
			await assertPortAvailable(port);

		tempRoot = await mkdtemp(join(repoRoot, tempPrefix));
		const backendDir = await createTempBackend(tempRoot);
		const convexEnv = isolatedEnvironment({
			SITE_URL: siteUrl,
		});

		console.log("Provisioning a disposable local Convex database...");
		await runCommand("bunx", ["convex", "dev", "--once", "--typecheck", "disable", "--codegen", "disable"], {
			cwd: backendDir,
			env: convexEnv,
		});
		await cp(join(backendSource, "convex"), join(backendDir, "convex"), { recursive: true });
		await runCommand("bunx", ["convex", "env", "set", "--from-file", ".e2e-deployment.env"], {
			cwd: backendDir,
			env: convexEnv,
		});
		await runCommand("bunx", ["convex", "dev", "--once", "--typecheck", "disable", "--codegen", "disable"], {
			cwd: backendDir,
			env: convexEnv,
		});

		convexProcess = startProcess("bunx", ["convex", "dev", "--typecheck", "disable", "--codegen", "disable"], {
			cwd: backendDir,
			env: convexEnv,
			stdio: ["ignore", "pipe", "pipe"],
		});
		convexProcess.child.stdout.on("data", chunk => process.stdout.write(chunk));
		convexProcess.child.stderr.on("data", chunk => process.stderr.write(chunk));
		await waitForPort(3210, 90000);
		await waitForPort(3211, 90000);

		const testEnv = isolatedEnvironment({
			LOMO_E2E_ISOLATED: "1",
			NEXT_PUBLIC_CONVEX_URL: convexApiUrl,
			NEXT_PUBLIC_CONVEX_SITE_URL: convexSiteUrl,
			NEXT_PUBLIC_SITE_URL: siteUrl,
		});
		playwrightProcess = startProcess("bun", ["x", "playwright", "test", ...process.argv.slice(2)], {
			cwd: repoRoot,
			env: testEnv,
			stdio: "inherit",
		});
		const result = await playwrightProcess.done;
		if (result.code !== 0)
			process.exitCode = result.code ?? 1;
	}
	catch (error) {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	}
	finally {
		await stopProcess(playwrightProcess);
		await stopProcess(convexProcess);
		if (tempRoot) {
			const safeTempRoot = resolve(tempRoot);
			if (dirname(safeTempRoot) !== repoRoot || !safeTempRoot.split("/").at(-1)?.startsWith(tempPrefix))
				throw new Error(`Refusing to remove unexpected temporary path: ${safeTempRoot}`);
			await rm(safeTempRoot, { recursive: true, force: true });
		}
		process.off("SIGINT", onInterrupt);
		process.off("SIGTERM", onTerminate);
		if (receivedSignal)
			process.exitCode = receivedSignal === "SIGINT" ? 130 : 143;
	}
}

await main();