import { describe, expect, it } from "bun:test";
import { getSegmentColorClass, segmentedProgressVariants } from "./segmented-progress.variants.ts";

describe("segmentedProgressVariants", () => {
	it("renders sm size root and segment styles", () => {
		const { root, segment } = segmentedProgressVariants({ size: "sm" });
		expect(root()).toContain("flex");
		expect(root()).toContain("max-w-[min(100%,320px)]");
		expect(segment()).toContain("h-2");
	});

	it("renders md size root and segment styles", () => {
		const { root, segment } = segmentedProgressVariants({ size: "md" });
		expect(root()).toContain("gap-2");
		expect(segment()).toContain("h-4");
		expect(segment()).toContain("border-4");
	});

	it("computes segment colors correctly for sm and md sizes", () => {
		expect(getSegmentColorClass("sage", "sm", true)).toBe("bg-sage-9");
		expect(getSegmentColorClass("sage", "sm", false)).toBe("bg-sage-4");
		expect(getSegmentColorClass("yellow", "md", true)).toBe("bg-yellow-10");
		expect(getSegmentColorClass("yellow", "md", false)).toBe("bg-terracotta-9");
	});
});
