import { tv } from "tailwind-variants";
import {
	fontWeights,
	textColors,
	textColorsHighContrast,
	trimVariants,
	typographySizes,
} from "../variants/index.ts";

export const textVariants = tv({
	variants: {
		size: typographySizes,
		weight: fontWeights,
		trim: trimVariants,
		color: {
			terracotta: "",
			sage: "",
			yellow: "",
			gray: "",
			red: "",
			amber: "",
		},
		highContrast: {
			true: "",
			false: "",
		},
	},
	compoundVariants: [
		// Standard contrast (step 11)
		{ highContrast: false, color: "terracotta", class: textColors.terracotta },
		{ highContrast: false, color: "sage", class: textColors.sage },
		{ highContrast: false, color: "yellow", class: textColors.yellow },
		{ highContrast: false, color: "gray", class: textColors.gray },
		{ highContrast: false, color: "red", class: textColors.red },
		{ highContrast: false, color: "amber", class: textColors.amber },
		// High contrast (step 12)
		{ highContrast: true, color: "terracotta", class: textColorsHighContrast.terracotta },
		{ highContrast: true, color: "sage", class: textColorsHighContrast.sage },
		{ highContrast: true, color: "yellow", class: textColorsHighContrast.yellow },
		{ highContrast: true, color: "gray", class: textColorsHighContrast.gray },
		{ highContrast: true, color: "red", class: textColorsHighContrast.red },
		{ highContrast: true, color: "amber", class: textColorsHighContrast.amber },
	],
	defaultVariants: {
		size: 3,
		weight: "regular",
		color: "gray",
		highContrast: false,
		trim: "normal",
	},
});

export type TextElementType = "span" | "p" | "div" | "label";
