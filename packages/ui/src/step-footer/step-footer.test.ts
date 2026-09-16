import { describe, expect, it } from "bun:test";
import { stepFooterVariants } from "./step-footer.variants.ts";

describe("stepFooterVariants", () => {
	it("renders default variant styles", () => {
		const { root, backButton, nextButton } = stepFooterVariants({ variant: "default" });
		expect(root()).toContain("pt-6");
		expect(backButton()).toContain("min-w-0 flex-1");
		expect(nextButton()).toContain("min-w-0 flex-1");
	});

	it("renders onboarding variant styles", () => {
		const { root, backButton, nextButton } = stepFooterVariants({ variant: "onboarding" });
		expect(root()).toContain("pt-8");
		expect(backButton()).toContain("text-xl");
		expect(nextButton()).toContain("bg-yellow-10");
	});
});
