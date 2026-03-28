import { tv } from "tailwind-variants";
import { cardBase, cardClassicColors, cardGhostColors, cardSizes, cardSurfaceColors } from "../variants/index.ts";

export const cardVariants = tv({
	base: cardBase,
	variants: {
		variant: {
			ghost: "",
			surface: "",
			classic: "",
		},
		size: cardSizes,
		color: {
			terracotta: "",
			sage: "",
			yellow: "",
			gray: "",
			red: "",
			amber: "",
		},
	},
	compoundVariants: [
		// Ghost
		{ variant: "ghost", color: "terracotta", class: cardGhostColors.terracotta },
		{ variant: "ghost", color: "sage", class: cardGhostColors.sage },
		{ variant: "ghost", color: "yellow", class: cardGhostColors.yellow },
		{ variant: "ghost", color: "gray", class: cardGhostColors.gray },
		{ variant: "ghost", color: "red", class: cardGhostColors.red },
		{ variant: "ghost", color: "amber", class: cardGhostColors.amber },
		// Surface
		{ variant: "surface", color: "terracotta", class: cardSurfaceColors.terracotta },
		{ variant: "surface", color: "sage", class: cardSurfaceColors.sage },
		{ variant: "surface", color: "yellow", class: cardSurfaceColors.yellow },
		{ variant: "surface", color: "gray", class: cardSurfaceColors.gray },
		{ variant: "surface", color: "red", class: cardSurfaceColors.red },
		{ variant: "surface", color: "amber", class: cardSurfaceColors.amber },
		// Classic
		{ variant: "classic", color: "terracotta", class: cardClassicColors.terracotta },
		{ variant: "classic", color: "sage", class: cardClassicColors.sage },
		{ variant: "classic", color: "yellow", class: cardClassicColors.yellow },
		{ variant: "classic", color: "gray", class: cardClassicColors.gray },
		{ variant: "classic", color: "red", class: cardClassicColors.red },
		{ variant: "classic", color: "amber", class: cardClassicColors.amber },
	],
	defaultVariants: {
		variant: "surface",
		size: 1,
		color: "gray",
	},
});
