import { expect, it } from "bun:test";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { stopProcess } from "../scripts/run-e2e.mjs";

it("ignores processes that failed to spawn", async () => {
	await expect(stopProcess({
		child: { pid: undefined },
		done: Promise.resolve(),
	})).resolves.toBeUndefined();
});

it.skipIf(process.platform === "win32")("stopProcess terminates descendants after the process leader exits", async () => {
	const tempRoot = await mkdtemp(join(tmpdir(), "lomo-e2e-process-"));
	const markerPath = join(tempRoot, "terminated");
	const readyPath = join(tempRoot, "ready");
	const grandchildScript = [
		`process.on("SIGTERM", () => { require("node:fs").writeFileSync(${JSON.stringify(markerPath)}, "terminated"); process.exit(0); });`,
		`require("node:fs").writeFileSync(${JSON.stringify(readyPath)}, "ready");`,
		"setInterval(() => {}, 1000);",
	].join("\n");
	const leaderScript = [
		`const child = require("node:child_process").spawn(process.execPath, ["-e", ${JSON.stringify(grandchildScript)}], { stdio: "ignore" });`,
		"child.unref();",
		`const readyPath = ${JSON.stringify(readyPath)};`,
		"const deadline = Date.now() + 5000;",
		"function waitForGrandchild() {",
		"	if (require('node:fs').existsSync(readyPath)) return;",
		"	if (Date.now() >= deadline) process.exit(1);",
		"	setTimeout(waitForGrandchild, 10);",
		"}",
		"waitForGrandchild();",
	].join("\n");
	const child = spawn(process.execPath, [
		"-e",
		leaderScript,
	], {
		detached: true,
		stdio: "ignore",
	});
	const handle = {
		child,
		done: new Promise((resolve, reject) => {
			child.once("error", reject);
			child.once("close", (code, signal) => resolve({ code, signal }));
		}),
	};

	try {
		await handle.done;
		expect(() => process.kill(-child.pid, 0)).not.toThrow();
		await stopProcess(handle);
		expect(await readFile(markerPath, "utf8")).toBe("terminated");
	}
	finally {
		try {
			process.kill(-child.pid, "SIGKILL");
		}
		catch (error) {
			if (error.code !== "ESRCH")
				console.error("Failed to clean up test process group:", error);
		}
		await rm(tempRoot, { recursive: true, force: true });
	}
});
