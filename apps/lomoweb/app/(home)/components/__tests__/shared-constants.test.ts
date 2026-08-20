import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * **Validates: Requirements 13.4**
 *
 * Property 8: Homepage components reference shared constants for repeated patterns
 *
 * For any homepage component file that visually renders the section label pattern,
 * card surface pattern, or CTA button pattern, the file SHALL import from `./styles`
 * rather than inlining the full class string.
 */

const COMPONENTS_DIR = join(__dirname, "..");

/** The full section label class pattern that should be extracted */
const SECTION_LABEL_INLINE = "text-terracotta-11 font-display font-black text-sm tracking-widest uppercase";

/** The full CTA button class pattern that should be extracted */
const CTA_BUTTON_INLINE = "bg-terracotta-9 hover:bg-terracotta-10 text-white border-2 border-black rounded-full px-8 py-3.5 font-display font-black text-base";

/** The full card surface class pattern that should be extracted */
const CARD_SURFACE_INLINE = "border-2 border-black rounded-5 shadow-[0px_2px_8px_rgba(0,0,0,0.10)]";

/** Regex patterns for import assertions */
const SECTION_LABEL_IMPORT_RE = /import\s+(?:\S.*)?sectionLabel.*from\s+["']\.\/styles["']/;
const CTA_BUTTON_IMPORT_RE = /import\s+(?:\S.*)?ctaButton.*from\s+["']\.\/styles["']/;
const CARD_SURFACE_IMPORT_RE = /import\s+(?:\S.*)?cardSurface.*from\s+["']\.\/styles["']/;
const SECONDARY_BUTTON_IMPORT_RE = /import\s+(?:\S.*)?secondaryButton.*from\s+["']\.\/styles["']/;

function readComponent(filename: string): string {
	return readFileSync(join(COMPONENTS_DIR, filename), "utf-8");
}

describe("property 8: Homepage components reference shared constants for repeated patterns", () => {
	describe("sectionLabel usage", () => {
		const filesExpectedToImportSectionLabel = [
			"hero-section.tsx",
			"how-it-works-section.tsx",
		];

		// find-section.tsx and share-section.tsx delegate to CategorySection which imports sectionLabel
		const filesUsingIndirectSectionLabel = [
			"find-section.tsx",
			"share-section.tsx",
		];

		for (const file of filesExpectedToImportSectionLabel) {
			it(`**Validates: Requirements 13.4** — ${file} imports sectionLabel from ./styles`, () => {
				const content = readComponent(file);

				expect(content).toMatch(SECTION_LABEL_IMPORT_RE);
			});

			it(`**Validates: Requirements 13.4** — ${file} does not inline the full section label class string`, () => {
				const content = readComponent(file);

				expect(content).not.toContain(SECTION_LABEL_INLINE);
			});
		}

		for (const file of filesUsingIndirectSectionLabel) {
			it(`**Validates: Requirements 13.4** — ${file} does not inline the full section label class string`, () => {
				const content = readComponent(file);

				expect(content).not.toContain(SECTION_LABEL_INLINE);
			});
		}
	});

	describe("ctaButton usage", () => {
		const filesExpectedToImportCtaButton = [
			"hero-section.tsx",
			"join-section.tsx",
		];

		for (const file of filesExpectedToImportCtaButton) {
			it(`**Validates: Requirements 13.4** — ${file} imports ctaButton from ./styles`, () => {
				const content = readComponent(file);

				expect(content).toMatch(CTA_BUTTON_IMPORT_RE);
			});

			it(`**Validates: Requirements 13.4** — ${file} does not inline the full CTA button class string`, () => {
				const content = readComponent(file);

				expect(content).not.toContain(CTA_BUTTON_INLINE);
			});
		}
	});

	describe("cardSurface usage", () => {
		const filesExpectedToImportCardSurface = [
			"how-it-works-section.tsx",
		];

		for (const file of filesExpectedToImportCardSurface) {
			it(`**Validates: Requirements 13.4** — ${file} imports cardSurface from ./styles`, () => {
				const content = readComponent(file);

				expect(content).toMatch(CARD_SURFACE_IMPORT_RE);
			});

			it(`**Validates: Requirements 13.4** — ${file} does not inline the full card surface class string`, () => {
				const content = readComponent(file);

				expect(content).not.toContain(CARD_SURFACE_INLINE);
			});
		}
	});

	describe("secondaryButton usage", () => {
		it("**Validates: Requirements 13.4** — hero-section.tsx imports secondaryButton from ./styles", () => {
			const content = readComponent("hero-section.tsx");

			expect(content).toMatch(SECONDARY_BUTTON_IMPORT_RE);
		});
	});
});
