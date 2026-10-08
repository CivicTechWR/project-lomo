import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@/": `${path.resolve(__dirname, "./")}/`,
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		// Turbo runs tests alongside builds in CI, so allow for CPU contention.
		testTimeout: 15_000,
		setupFiles: ["./vitest.setup.ts"],
	},
});
