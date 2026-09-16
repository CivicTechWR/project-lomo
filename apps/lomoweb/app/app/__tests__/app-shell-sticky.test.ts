import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Guards the pinned desktop sidebar.
 *
 * The sidebar used to stretch to the full height of the page, so on a long view
 * the Sign out and Settings entries sat at the bottom of the *document* rather
 * than the bottom of the screen. Two things keep it pinned, and both fail
 * silently if removed:
 *
 *  1. `lg:sticky` + a definite `lg:h-screen`. Without the definite height the
 *     flex row grows the sidebar to the content height again, and sticky has
 *     nothing to pin.
 *  2. No `overflow` on any ancestor. `position: sticky` is silently inert inside
 *     a scroll container, so the wrapper that owns the sidebar must not set one.
 *     (`<main>` may — it is a sibling, not an ancestor.)
 */

const APP_DIR = join(__dirname, "..", "..");

const SIDEBAR = join(APP_DIR, "app", "app-sidebar.tsx");
const APP_LAYOUT = join(APP_DIR, "app", "layout.tsx");
const ROOT_LAYOUT = join(APP_DIR, "layout.tsx");

const OVERFLOW_CLASS = /\boverflow-(?:hidden|auto|scroll|clip)\b/;

function read(path: string): string {
	return readFileSync(path, "utf-8");
}

describe("desktop sidebar stays pinned to the viewport", () => {
	it("is sticky with a definite viewport height", () => {
		const source = read(SIDEBAR);

		expect(source, "sidebar must be sticky").toContain("lg:sticky");
		expect(source, "sticky needs an anchor edge").toContain("lg:top-0");
		expect(
			source,
			"needs a definite height or the flex row stretches it to the content height",
		).toContain("lg:h-screen");
	});

	it("uses a floating navigation rail at the tablet breakpoint", () => {
		const source = read(SIDEBAR);

		expect(source).toContain("md:flex lg:hidden");
		expect(source).toContain("rounded-6");
		expect(source).toContain("shadow-[0_12px_28px");
	});

	it("uses the primary-action treatment for active navigation items", () => {
		const source = read(SIDEBAR);

		expect(source).toContain("border-transparent bg-terracotta-9 text-white");
		expect(source).toContain("isActive ? \"text-white\" : \"text-gray-11\"");
	});

	it("uses the floating bottom navigation only below the tablet breakpoint", () => {
		expect(read(SIDEBAR)).toContain("md:hidden");
	});

	it("supports a 320px minimum viewport width", () => {
		expect(read(ROOT_LAYOUT)).toContain("min-w-80");
	});

	it("lets a taller-than-viewport nav list scroll inside the sidebar", () => {
		const source = read(SIDEBAR);

		// A flex child won't shrink below its content without min-h-0, so the list
		// would overflow the pinned sidebar rather than scrolling within it.
		expect(source).toContain("min-h-0");
		expect(source).toContain("overflow-y-auto");
	});

	it("has no overflow on the wrapper that owns the sidebar", () => {
		// This wrapper is the sidebar's direct parent. An overflow here would make
		// it a scroll container and quietly disable the sticky positioning.
		expect(OVERFLOW_CLASS.test(read(APP_LAYOUT))).toBe(false);
	});

	it("has no overflow on the document body", () => {
		expect(OVERFLOW_CLASS.test(read(ROOT_LAYOUT))).toBe(false);
	});
});
