import { tv } from "tailwind-variants";
import { tw } from "../utils/tw.ts";
import { cardSizes } from "../variants/card-styles.ts";

export const modalVariants = tv({
	base: tw(
		"relative w-full max-w-lg",
		"overflow-hidden outline-none",
		"bg-gray-1 shadow-xl",
		"motion-safe:transition-[opacity,transform] motion-safe:duration-200",
		"data-entering:opacity-0 data-entering:scale-[0.97] data-entering:translate-y-1.25",
		"data-exiting:opacity-0 data-exiting:scale-[0.99] data-exiting:translate-y-1.25",
		"data-exiting:motion-safe:duration-100",
	),
	variants: {
		size: cardSizes,
	},
	defaultVariants: { size: 3 },
});

export const modalDialogVariants = tv({
	base: tw("max-h-[90vh] overflow-y-auto outline-none"),
	variants: {
		size: {
			1: "p-3",
			2: "p-4",
			3: "p-5",
			4: "p-6",
			5: "p-6",
		},
	},
	defaultVariants: { size: 3 },
});
