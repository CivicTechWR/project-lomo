import { tv } from "tailwind-variants";
import { tw } from "../utils/tw.ts";

export const textAreaVariants = tv({
	base: tw(
		"flex-1 min-w-0 bg-transparent outline-none",
		"placeholder:text-gray-10",
		"text-[inherit] leading-[inherit]",
		"disabled:cursor-not-allowed",
	),
	variants: {
		resize: {
			none: "resize-none",
			vertical: "resize-y",
			horizontal: "resize-x",
			both: "resize",
		},
	},
	defaultVariants: {
		resize: "vertical",
	},
});
