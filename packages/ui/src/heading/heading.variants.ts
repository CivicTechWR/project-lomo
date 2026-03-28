import { tv } from "tailwind-variants";
import { tw } from "../utils/tw.ts";
import {
	fontWeights,
	textColors,
	textColorsHighContrast,
	typographySizes,
} from "../variants/index.ts";

export const headingVariants = tv({
	variants: {
		size: typographySizes,
		weight: fontWeights,
		trim: {
			normal: "",
			start: tw("mt-[calc(var(--leading-trim-start)*-1)]"),
			end: tw("mb-[calc(var(--leading-trim-end)*-1)]"),
			both: tw("mt-[calc(var(--leading-trim-start)*-1)] mb-[calc(var(--leading-trim-end)*-1)]"),
		},
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
		// size intentionally omitted — derived from level in component
		weight: "bold",
		color: "gray",
		highContrast: true,
		trim: "normal",
	},
});

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
