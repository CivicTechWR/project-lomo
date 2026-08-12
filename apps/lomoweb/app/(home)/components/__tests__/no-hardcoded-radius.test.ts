import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * **Validates: Requirements 2.4**
 *
 * Property 1: No hardcoded pixel border-radius in homepage components
 *
 * For any homepage component file in apps/lomoweb/app/(home)/components/,
 * the file content SHALL contain zero matches for the pattern `rounded-[\d+px]`
 * (hardcoded pixel-based border-radius values).
 */

const COMPONENTS_DIR = join(__dirname, "..");
const HARDCODED_RADIUS_PATTERN = /rounded-\[\d+px\]/g;

describe("property 1: No hardcoded pixel border-radius in homepage components", () => {
	it("**Validates: Requirements 2.4** — All .tsx files SHALL contain zero matches for rounded-[<digits>px] pattern", () => {
		const files = readdirSync(COMPONENTS_DIR).filter(f => f.endsWith(".tsx"));
		const violations: { file: string; matches: string[] }[] = [];

		for (const file of files) {
			const content = readFileSync(join(COMPONENTS_DIR, file), "utf-8");
			const matches = content.match(HARDCODED_RADIUS_PATTERN);

			if (matches) {
				violations.push({ file, matches });
			}
		}

		if (violations.length > 0) {
			const details = violations
				.map(v => `  ${v.file}: ${v.matches.join(", ")}`)
				.join("\n");
			expect.fail(
				`Found hardcoded pixel border-radius values in homepage components:\n${details}`,
			);
		}

		expect(violations).toHaveLength(0);
	});
});
