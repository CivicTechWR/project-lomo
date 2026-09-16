import { tv } from "tailwind-variants";
import { tw } from "../utils/tw.ts";
import {
	outlineColors,
	outlineColorsHighContrast,
	softColors,
	softColorsHighContrast,
	solidColors,
	solidColorsHighContrast,
	surfaceColors,
	surfaceColorsHighContrast,
} from "../variants/index.ts";

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

function createColorCompoundVariants() {
	const variants = [
		{
			variant: "solid",
			normalMap: solidColors,
			highContrastMap: solidColorsHighContrast,
		},
		{
			variant: "soft",
			normalMap: softColors,
			highContrastMap: softColorsHighContrast,
		},
		{
			variant: "surface",
			normalMap: surfaceColors,
			highContrastMap: surfaceColorsHighContrast,
		},
		{
			variant: "outline",
			normalMap: outlineColors,
			highContrastMap: outlineColorsHighContrast,
		},
	] as const;

	const colors = [
		"terracotta",
		"sage",
		"yellow",
		"gray",
		"red",
		"darkred",
	] as const;

	return variants.flatMap(({ variant, normalMap, highContrastMap }) =>
		colors.flatMap(color => [
			{
				variant,
				color,
				highContrast: false as const,
				class: normalMap[color],
			},
			{
				variant,
				color,
				highContrast: true as const,
				class: highContrastMap[color],
			},
		]),
	);
}

function createBorderCompoundVariants() {
	const borders = ["small", "medium", "large"] as const;
	const colors = [
		"terracotta",
		"sage",
		"yellow",
		"red",
		"amber",
		"gray",
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

export const badgeVariants = tv({
	base: tw(
		"inline-flex items-center justify-center",
		"font-medium whitespace-nowrap shrink-0 select-none",
	),
	variants: {
		variant: {
			solid: "",
			soft: "",
			surface: "",
			outline: "",
		},
		size: {
			1: tw(
				"px-3 py-1",
				"text-[length:var(--text-1)]",
				"leading-[var(--text-1--line-height)]",
				"rounded-[max(var(--radius-1),var(--radius-full))] gap-1",
			),
			2: tw(
				"px-4 py-1.5",
				"text-[length:var(--text-2)]",
				"leading-[var(--text-2--line-height)]",
				"rounded-[max(var(--radius-2),var(--radius-full))] gap-1.5",
			),
			3: tw(
				"px-6 py-2",
				"text-[length:var(--text-3)]",
				"leading-[var(--text-3--line-height)]",
				"rounded-[max(var(--radius-2),var(--radius-full))] gap-1.5",
			),
		},
		color: {
			terracotta: "",
			sage: "",
			yellow: "",
			gray: "",
			red: "",
			amber: "",
			darkred: "",
		},
		highContrast: {
			true: "",
			false: "",
		},
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
	},
	compoundVariants: [
		...createColorCompoundVariants(),
		...createBorderCompoundVariants(),
	],
	defaultVariants: {
		variant: "soft",
		size: 2,
		color: "gray",
		highContrast: false,
		border: "none",
		borderColor: undefined,
	},
});
