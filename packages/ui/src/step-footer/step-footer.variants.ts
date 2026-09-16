import { tv } from "tailwind-variants";

export const stepFooterVariants = tv({
	slots: {
		root: "mt-auto flex w-full",
		backButton: "min-w-0 flex-1",
		nextButton: "min-w-0 flex-1",
	},
	variants: {
		variant: {
			default: {
				root: "gap-3 pt-6",
			},
			onboarding: {
				root: "gap-3 pt-8",
				backButton:
					"h-13 text-xl text-black shadow-brand bg-surface-warm data-hovered:bg-terracotta-3 data-pressed:bg-terracotta-4",
				nextButton:
					"h-13 text-xl text-black shadow-brand bg-yellow-10 data-hovered:bg-yellow-9 data-pressed:bg-yellow-9",
			},
		},
	},
	defaultVariants: {
		variant: "default",
	},
});
