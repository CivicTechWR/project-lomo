import { describe, expect, it } from "bun:test";
import { buttonVariants } from "./button.variants.ts";

describe("buttonVariants", () => {
	it("renders base interactive button styles", () => {
		const classes = buttonVariants();
		expect(classes).toContain("inline-flex");
		expect(classes).toContain("items-center");
		expect(classes).toContain("font-medium");
	});

	it("applies border sizes correctly", () => {
		const smallBorder = buttonVariants({ border: "small" });
		const mediumBorder = buttonVariants({ border: "medium" });
		const largeBorder = buttonVariants({ border: "large" });

		expect(smallBorder).toContain("border");
		expect(mediumBorder).toContain("border-2");
		expect(largeBorder).toContain("border-4");
	});

	it("applies size variants correctly", () => {
		const size1 = buttonVariants({ size: 1 });
		const size2 = buttonVariants({ size: 2 });
		const size3 = buttonVariants({ size: 3 });

		expect(size1).toContain("text-[length:var(--text-1)]");
		expect(size2).toContain("text-[length:var(--text-2)]");
		expect(size3).toContain("text-[length:var(--text-3)]");
	});
});
