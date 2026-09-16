import { tv } from "tailwind-variants";

export const selectionCardVariants = tv({
	base: [
		"flex w-full flex-col gap-2 p-4 text-left border transition-colors outline-none",
		"rounded-2",
		"focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2",
	],
	variants: {
		selected: {
			true: "border-gray-8 bg-gray-3 shadow-sm",
			false: "border-gray-6 bg-gray-1 hover:border-gray-7 hover:bg-gray-2",
		},
		disabled: {
			true: "cursor-not-allowed border-gray-5 bg-gray-2 opacity-60 hover:border-gray-5 hover:bg-gray-2",
			false: "cursor-pointer",
		},
	},
	defaultVariants: {
		selected: false,
		disabled: false,
	},
});
