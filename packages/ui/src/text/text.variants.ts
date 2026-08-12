import { tv } from "tailwind-variants";
import {
	fontWeights,
	trimVariants,
	typographySizes,
} from "../variants/index.ts";

export const textVariants = tv({
	// Block-level so consecutive <Text> lines stack and long words wrap in flex layouts.
	base: "block min-w-0 max-w-full break-words",
	variants: {
		size: typographySizes,
		weight: fontWeights,
		trim: trimVariants,
		color: {
			terracotta: "text-terracotta-11",
			sage: "text-sage-11",
			yellow: "text-yellow-11",
			gray: "text-gray-11",
			red: "text-red-11",
			amber: "text-amber-11",
			darkred: "text-darkred-11",
			black: "text-black",
		},
		highContrast: {
			true: "",
			false: "",
		},
	},
	compoundVariants: [
		// High contrast (step 12)
		{ highContrast: true, color: "terracotta", class: "text-terracotta-12" },
		{ highContrast: true, color: "sage", class: "text-sage-12" },
		{ highContrast: true, color: "yellow", class: "text-yellow-12" },
		{ highContrast: true, color: "gray", class: "text-gray-12" },
		{ highContrast: true, color: "red", class: "text-red-12" },
		{ highContrast: true, color: "amber", class: "text-amber-12" },
		{ highContrast: true, color: "darkred", class: "text-darkred-12" },
		{ highContrast: true, color: "black", class: "text-black" },
	],
	defaultVariants: {
		size: 3,
		weight: "regular",
		color: "black",
		highContrast: false,
		trim: "normal",
	},
});

export type TextElementType = "span" | "p" | "div" | "label";
