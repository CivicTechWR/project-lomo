import { tv } from "tailwind-variants";
import { fieldGaps } from "../variants/index.ts";

export const textFieldVariants = tv({
	base: "flex w-full",
	variants: {
		orientation: {
			vertical: "flex-col",
			horizontal: "flex-row items-center",
		},
		size: fieldGaps,
	},
	defaultVariants: {
		orientation: "vertical",
		size: 2,
	},
});
