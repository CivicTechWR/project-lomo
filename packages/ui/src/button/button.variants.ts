import { tv } from "tailwind-variants";
import {
	focusRings,
	ghostColors,
	interactiveBase,
	interactiveSizes,
	outlineColors,
	softColors,
	solidColors,
} from "../variants/index.ts";

export const textColorVariants = {
	terracotta: "text-terracotta-11",
	sage: "text-sage-11",
	yellow: "text-yellow-11",
	gray: "text-gray-11",
	red: "text-red-11",
	amber: "text-amber-11",
	darkred: "text-darkred-11",
	black: "text-black",
};

// Border color styles (step 9: solid color)
const borderColors: Record<string, string> = {
	terracotta: "border-[var(--terracotta-9)]",
	sage: "border-[var(--sage-9)]",
	yellow: "border-[var(--yellow-9)]",
	red: "border-[var(--red-9)]",
	amber: "border-[var(--amber-9)]",
	gray: "border-[var(--gray-9)]",
	darkred: "border-[var(--darkred-9)]",
};

function createVariantColorCompoundVariants() {
	const variants = [
		{ variant: "solid", map: solidColors },
		{ variant: "soft", map: softColors },
		{ variant: "outline", map: outlineColors },
		{ variant: "ghost", map: ghostColors },
	] as const;

	const colors = [
		"terracotta",
		"sage",
		"yellow",
		"gray",
		"red",
		"amber",
		"darkred",
	] as const;

	return variants.flatMap(({ variant, map }) =>
		colors.map(color => ({
			variant,
			color,
			class: map[color],
		})),
	);
}

function createBorderCompoundVariants() {
	const borders = ["small", "medium", "large"] as const;
	const colors = [
		"terracotta",
		"sage",
		"yellow",
		"gray",
		"red",
		"amber",
		"darkred",
	] as const;

	return borders.flatMap(border =>
		colors.map(borderColor => ({
			border,
			borderColor,
			class: borderColors[borderColor],
		})),
	);
}

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
			darkred: focusRings.darkred,
		},
		icon: { true: "" },
		border: {
			none: "border-none",
			small: "border",
			medium: "border-2",
			large: "border-4",
		},
		borderColor: {
			terracotta: borderColors.terracotta,
			sage: borderColors.sage,
			yellow: borderColors.yellow,
			gray: borderColors.gray,
			red: borderColors.red,
			amber: borderColors.amber,
			darkred: borderColors.darkred,
		},
		textColor: textColorVariants,
	},
	compoundVariants: [
		// Min-width (2× height) — keeps short-label buttons from looking circular
		{ size: 1, class: "min-w-16" },
		{ size: 2, class: "min-w-20" },
		{ size: 3, class: "min-w-24" },
		{ size: 4, class: "min-w-28" },
		// Icon — square dimensions, no horizontal padding
		{ icon: true, size: 1, class: "w-8 min-w-0 px-0" },
		{ icon: true, size: 2, class: "w-10 min-w-0 px-0" },
		{ icon: true, size: 3, class: "w-12 min-w-0 px-0" },
		{ icon: true, size: 4, class: "w-14 min-w-0 px-0" },
		...createVariantColorCompoundVariants(),
		...createBorderCompoundVariants(),
	],
	defaultVariants: {
		variant: "solid",
		size: 2,
		color: "terracotta",
		icon: false,
		border: "none",
		borderColor: undefined,
		textColor: undefined,
	},
});
