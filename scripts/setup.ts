#!/usr/bin/env bun
/**
 * One-command local onboarding: `bun run setup`
 *
 *   1. Installs dependencies
 *   2. Creates apps/lomoweb/.env.local from the example (if missing)
 *   3. Starts Convex once so a deployment exists (anonymous local deployment
 *      on first run — no Convex account needed)
 *   4. Sets any missing Convex env vars (SITE_URL, BETTER_AUTH_SECRET, ADMIN_EMAILS)
 *   5. Pushes the backend and seeds demo data
 *   6. Syncs the Convex URLs into apps/lomoweb/.env.local
 *   7. Starts `bun run dev` (skip with --no-dev)
 *
 * Safe to rerun: existing env vars are never overwritten, and seeding only
 * resets the seeded demo rows.
 *
 * Flags:
 *   --admin-email <email>   Email to grant admin access (default: git user.email)
 *   --no-dev                Stop after setup instead of starting the dev stack
 *   --no-seed               Skip seeding demo data
 */
import type { Subprocess } from "bun";
import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { parseArgs } from "node:util";

const ROOT = join(import.meta.dir, "..");
const BACKEND_DIR = join(ROOT, "apps/convex-backend");
const WEB_DIR = join(ROOT, "apps/lomoweb");
const BACKEND_ENV = join(BACKEND_DIR, ".env.local");
const WEB_ENV = join(WEB_DIR, ".env.local");
const WEB_ENV_EXAMPLE = join(WEB_DIR, ".env.local.example");

const SITE_URL = "http://localhost:3000";
const DOTENV_LINE_RE = /^\s*([\w.]+)\s*=(.*)$/;
const QUOTED_RE = /^(["'])(.*)\1$/;
const BACKEND_READY_TIMEOUT_MS = 5 * 60_000;

const { values: flags } = parseArgs({
	args: process.argv.slice(2),
	options: {
		"admin-email": { type: "string" },
		"no-dev": { type: "boolean", default: false },
		"no-seed": { type: "boolean", default: false },
	},
});

function step(message: string) {
	console.log(`\n\x1B[1m▸ ${message}\x1B[0m`);
}

function info(message: string) {
	console.log(`  ${message}`);
}

function fail(message: string): never {
	console.error(`\n\x1B[31m✖ ${message}\x1B[0m`);
	process.exit(1);
}

async function run(cmd: string[], cwd = ROOT, env: Record<string, string> = {}) {
	const proc = Bun.spawn(cmd, {
		cwd,
		env: { ...process.env, ...env },
		stdio: ["inherit", "inherit", "inherit"],
	});
	const code = await proc.exited;
	if (code !== 0) {
		fail(`\`${cmd.join(" ")}\` exited with code ${code}`);
	}
}

async function capture(cmd: string[], cwd = ROOT, env: Record<string, string> = {}) {
	const proc = Bun.spawn(cmd, {
		cwd,
		env: { ...process.env, ...env },
		stdout: "pipe",
		stderr: "pipe",
	});
	const [stdout, stderr, code] = await Promise.all([
		new Response(proc.stdout).text(),
		new Response(proc.stderr).text(),
		proc.exited,
	]);
	return { stdout, stderr, code };
}

function parseDotenv(text: string): Map<string, string> {
	const vars = new Map<string, string>();
	for (const line of text.split("\n")) {
		const match = line.match(DOTENV_LINE_RE);
		if (match) {
			vars.set(match[1], match[2].trim().replace(QUOTED_RE, "$2"));
		}
	}
	return vars;
}

async function readDotenv(path: string): Promise<Map<string, string>> {
	return existsSync(path) ? parseDotenv(await Bun.file(path).text()) : new Map();
}

/** Updates (or appends) keys in a dotenv file, leaving every other line untouched. */
async function upsertDotenv(path: string, updates: Record<string, string>) {
	const lines = (await Bun.file(path).text()).split("\n");
	const pending = new Map(Object.entries(updates));
	const next = lines.map((line) => {
		const key = line.match(DOTENV_LINE_RE)?.[1];
		if (key && pending.has(key)) {
			const value = pending.get(key)!;
			pending.delete(key);
			return `${key}=${value}`;
		}
		return line;
	});
	for (const [key, value] of pending) {
		next.push(`${key}=${value}`);
	}
	await Bun.write(path, next.join("\n"));
}

async function gitEmail(): Promise<string | undefined> {
	const { stdout, code } = await capture(["git", "config", "user.email"]);
	const email = stdout.trim();
	return code === 0 && email ? email : undefined;
}

// ---------------------------------------------------------------------------

step("Installing dependencies");
await run(["bun", "install"]);

step("Preparing apps/lomoweb/.env.local");
if (existsSync(WEB_ENV)) {
	info("Already exists — leaving it in place.");
}
else {
	await Bun.write(WEB_ENV, Bun.file(WEB_ENV_EXAMPLE));
	info("Created from .env.local.example.");
}

// A brand-new checkout has no Convex deployment yet. Anonymous mode creates a
// local one without asking the user to log in or answer prompts. Existing
// setups (including logged-in cloud dev deployments) are left as they are.
const backendEnv = await readDotenv(BACKEND_ENV);
const convexEnv: Record<string, string> = backendEnv.get("CONVEX_DEPLOYMENT")
	? {}
	: { CONVEX_AGENT_MODE: "anonymous" };

const convex = (...args: string[]) => ["bun", "x", "convex", ...args];

step("Starting Convex to configure the deployment");
info("The first run downloads the local Convex backend, which can take a minute.");
const devProc: Subprocess = Bun.spawn(
	convex("dev", "--tail-logs", "disable", "--typecheck", "disable"),
	{
		cwd: BACKEND_DIR,
		env: { ...process.env, ...convexEnv },
		stdout: "pipe",
		stderr: "pipe",
	},
);
let devOutput = "";
for (const stream of [devProc.stdout, devProc.stderr] as ReadableStream<Uint8Array>[]) {
	void (async () => {
		const decoder = new TextDecoder();
		for await (const chunk of stream) {
			devOutput += decoder.decode(chunk);
		}
	})();
}
let devExited = false;
void devProc.exited.then(() => {
	devExited = true;
});

async function stopDev() {
	if (!devExited) {
		devProc.kill("SIGINT");
		await devProc.exited;
	}
}

function onInterrupt() {
	devProc.kill("SIGINT");
	process.exit(130);
}
process.on("SIGINT", onInterrupt);

// `convex env list` only succeeds once the deployment is reachable.
let existingVars: Map<string, string> | undefined;
const deadline = Date.now() + BACKEND_READY_TIMEOUT_MS;
while (Date.now() < deadline) {
	if (devExited) {
		break;
	}
	const result = await capture(convex("env", "list"), BACKEND_DIR);
	if (result.code === 0) {
		existingVars = parseDotenv(result.stdout);
		break;
	}
	await Bun.sleep(2000);
}
if (!existingVars) {
	await stopDev();
	console.error(devOutput);
	fail("Convex did not become ready. See the output above.");
}
info("Convex deployment is up.");

step("Setting Convex environment variables");
const wanted: Record<string, () => Promise<string | undefined>> = {
	SITE_URL: async () => SITE_URL,
	BETTER_AUTH_SECRET: async () => randomBytes(32).toString("base64"),
	ADMIN_EMAILS: async () => flags["admin-email"] ?? (await gitEmail()),
};
for (const [name, resolve] of Object.entries(wanted)) {
	if (existingVars.get(name)) {
		info(`${name} already set — keeping it.`);
		continue;
	}
	const value = await resolve();
	if (!value) {
		info(`${name} skipped (pass --admin-email you@example.com to grant admin access).`);
		continue;
	}
	// Piping the value through stdin keeps secrets out of the process list.
	const proc = Bun.spawn(convex("env", "set", name), {
		cwd: BACKEND_DIR,
		stdin: new Blob([value]),
		stdout: "pipe",
		stderr: "pipe",
	});
	if ((await proc.exited) !== 0) {
		const stderr = await new Response(proc.stderr).text();
		await stopDev();
		fail(`Could not set ${name}:\n${stderr}`);
	}
	info(name === "BETTER_AUTH_SECRET" ? `${name} set (generated).` : `${name}=${value}`);
}

await stopDev();
process.off("SIGINT", onInterrupt);

step(flags["no-seed"] ? "Pushing backend" : "Pushing backend and seeding demo data");
await run(
	flags["no-seed"]
		? convex("dev", "--once", "--typecheck", "disable")
		: convex("dev", "--once", "--typecheck", "disable", "--run", "seed:run"),
	BACKEND_DIR,
);

// Local Convex may pick different ports if the defaults are taken, so point
// the web app at whatever deployment Convex actually configured.
step("Syncing Convex URLs into apps/lomoweb/.env.local");
const configured = await readDotenv(BACKEND_ENV);
const urlUpdates: Record<string, string> = {};
for (const [from, to] of [
	["CONVEX_DEPLOYMENT", "CONVEX_DEPLOYMENT"],
	["CONVEX_URL", "NEXT_PUBLIC_CONVEX_URL"],
	["CONVEX_SITE_URL", "NEXT_PUBLIC_CONVEX_SITE_URL"],
] as const) {
	const value = configured.get(from);
	if (value) {
		urlUpdates[to] = value;
	}
}
await upsertDotenv(WEB_ENV, urlUpdates);
for (const [key, value] of Object.entries(urlUpdates)) {
	info(`${key}=${value}`);
}

console.log("\n\x1B[32m✔ Setup complete.\x1B[0m");

if (flags["no-dev"]) {
	info("Run `bun run dev` to start the app at http://localhost:3000.");
	process.exit(0);
}

step("Starting the dev stack (bun run dev)");
const dev = Bun.spawn(["bun", "run", "dev"], { cwd: ROOT, stdio: ["inherit", "inherit", "inherit"] });
process.exit(await dev.exited);
