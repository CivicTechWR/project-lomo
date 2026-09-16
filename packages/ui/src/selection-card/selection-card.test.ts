import { describe, expect, it } from "bun:test";
import { selectionCardVariants } from "./selection-card.variants.ts";

describe("selectionCardVariants", () => {
	it("renders base selection card styles", () => {
		const classes = selectionCardVariants();
		expect(classes).toContain("flex");
		expect(classes).toContain("border");
		expect(classes).toContain("rounded-2");
	});

	it("applies selected state correctly", () => {
		const unselected = selectionCardVariants({ selected: false });
		expect(unselected).toContain("border-gray-6");
		expect(unselected).toContain("bg-gray-1");

		const selected = selectionCardVariants({ selected: true });
		expect(selected).toContain("border-gray-8");
		expect(selected).toContain("bg-gray-3");
	});

	it("applies disabled state correctly", () => {
		const disabled = selectionCardVariants({ disabled: true });
		expect(disabled).toContain("cursor-not-allowed");
		expect(disabled).toContain("opacity-60");
	});
});
