import { describe, expect, it } from "bun:test";
import { badgeVariants } from "./badge.variants.ts";

describe("badgeVariants", () => {
	it("renders default variant classes", () => {
		const classes = badgeVariants();
		expect(classes).toContain("inline-flex");
		expect(classes).toContain("font-medium");
	});

	it("applies variant and color classes correctly", () => {
		const classes = badgeVariants({ variant: "solid", color: "terracotta" });
		expect(classes).toContain("inline-flex");
	});

	it("applies border sizes correctly", () => {
		const smallBorder = badgeVariants({ border: "small" });
		const mediumBorder = badgeVariants({ border: "medium" });
		const largeBorder = badgeVariants({ border: "large" });

		expect(smallBorder).toContain("border");
		expect(mediumBorder).toContain("border-2");
		expect(largeBorder).toContain("border-4");
	});

	it("applies border color styles correctly", () => {
		const classes = badgeVariants({ border: "small", borderColor: "sage" });
		expect(classes).toContain("border-[var(--sage-9)]");
	});
});
