import { tv } from "tailwind-variants";
import { tw } from "../utils/tw.ts";
import { fontWeights, typographySizes } from "../variants/index.ts";

export const headingVariants = tv({
	variants: {
		size: typographySizes,
		weight: fontWeights,
		trim: {
			normal: "",
			start: tw("mt-[calc(var(--leading-trim-start)*-1)]"),
			end: tw("mb-[calc(var(--leading-trim-end)*-1)]"),
			both: tw(
				"mt-[calc(var(--leading-trim-start)*-1)] mb-[calc(var(--leading-trim-end)*-1)]",
			),
		},
		color: {
			terracotta: "text-terracotta-11",
			sage: "text-sage-11",
			yellow: "text-yellow-11",
			gray: "text-gray-11",
			red: "text-red-11",
			amber: "text-amber-11",
			darkred: "text-darkred-11",
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
