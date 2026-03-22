import type { Colors, Size } from "../theme/types.ts";
import { tv } from "tailwind-variants";
import { focusRings, ghostColors, interactiveBase, interactiveSizes, outlineColors, softColors, solidColors } from "../variants/index.ts";

export const buttonVariants = tv({
	base: interactiveBase,
	variants: {
		variant: {
			solid: "",
			soft: "",
			outline: "",
			ghost: "",
		},
		size: interactiveSizes,
		color: {
			terracotta: focusRings.terracotta,
			sage: focusRings.sage,
			yellow: focusRings.yellow,
			gray: focusRings.gray,
			red: focusRings.red,
			amber: focusRings.amber,
		},
	},
	compoundVariants: [
		// Solid
		{ variant: "solid", color: "terracotta", class: solidColors.terracotta },
		{ variant: "solid", color: "sage", class: solidColors.sage },
		{ variant: "solid", color: "yellow", class: solidColors.yellow },
		{ variant: "solid", color: "gray", class: solidColors.gray },
		{ variant: "solid", color: "red", class: solidColors.red },
		{ variant: "solid", color: "amber", class: solidColors.amber },
		// Soft
		{ variant: "soft", color: "terracotta", class: softColors.terracotta },
		{ variant: "soft", color: "sage", class: softColors.sage },
		{ variant: "soft", color: "yellow", class: softColors.yellow },
		{ variant: "soft", color: "gray", class: softColors.gray },
		{ variant: "soft", color: "red", class: softColors.red },
		{ variant: "soft", color: "amber", class: softColors.amber },
		// Outline
		{ variant: "outline", color: "terracotta", class: outlineColors.terracotta },
		{ variant: "outline", color: "sage", class: outlineColors.sage },
		{ variant: "outline", color: "yellow", class: outlineColors.yellow },
		{ variant: "outline", color: "gray", class: outlineColors.gray },
		{ variant: "outline", color: "red", class: outlineColors.red },
		{ variant: "outline", color: "amber", class: outlineColors.amber },
		// Ghost
		{ variant: "ghost", color: "terracotta", class: ghostColors.terracotta },
		{ variant: "ghost", color: "sage", class: ghostColors.sage },
		{ variant: "ghost", color: "yellow", class: ghostColors.yellow },
		{ variant: "ghost", color: "gray", class: ghostColors.gray },
		{ variant: "ghost", color: "red", class: ghostColors.red },
		{ variant: "ghost", color: "amber", class: ghostColors.amber },
	],
	defaultVariants: {
		variant: "solid",
		size: 2,
		color: "terracotta",
	},
});

export type ButtonVariant = "solid" | "soft" | "outline" | "ghost";
export type ButtonColor = Colors;
export type ButtonSize = Size;
