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
		// Solid
		{
			variant: "solid",
			color: "terracotta",
			highContrast: false,
			class: solidColors.terracotta,
		},
		{
			variant: "solid",
			color: "sage",
			highContrast: false,
			class: solidColors.sage,
		},
		{
			variant: "solid",
			color: "yellow",
			highContrast: false,
			class: solidColors.yellow,
		},
		{
			variant: "solid",
			color: "gray",
			highContrast: false,
			class: solidColors.gray,
		},
		{
			variant: "solid",
			color: "red",
			highContrast: false,
			class: solidColors.red,
		},
		{
			variant: "solid",
			color: "darkred",
			highContrast: false,
			class: solidColors.darkred,
		},
		// Solid (high contrast)
		{
			variant: "solid",
			color: "terracotta",
			highContrast: true,
			class: solidColorsHighContrast.terracotta,
		},
		{
			variant: "solid",
			color: "sage",
			highContrast: true,
			class: solidColorsHighContrast.sage,
		},
		{
			variant: "solid",
			color: "yellow",
			highContrast: true,
			class: solidColorsHighContrast.yellow,
		},
		{
			variant: "solid",
			color: "gray",
			highContrast: true,
			class: solidColorsHighContrast.gray,
		},
		{
			variant: "solid",
			color: "red",
			highContrast: true,
			class: solidColorsHighContrast.red,
		},
		{
			variant: "solid",
			color: "darkred",
			highContrast: true,
			class: solidColorsHighContrast.darkred,
		},
		// Soft
		{
			variant: "soft",
			color: "terracotta",
			highContrast: false,
			class: softColors.terracotta,
		},
		{
			variant: "soft",
			color: "sage",
			highContrast: false,
			class: softColors.sage,
		},
		{
			variant: "soft",
			color: "yellow",
			highContrast: false,
			class: softColors.yellow,
		},
		{
			variant: "soft",
			color: "gray",
			highContrast: false,
			class: softColors.gray,
		},
		{
			variant: "soft",
			color: "red",
			highContrast: false,
			class: softColors.red,
		},
		{
			variant: "soft",
			color: "darkred",
			highContrast: false,
			class: softColors.darkred,
		},
		// Soft (high contrast)
		{
			variant: "soft",
			color: "terracotta",
			highContrast: true,
			class: softColorsHighContrast.terracotta,
		},
		{
			variant: "soft",
			color: "sage",
			highContrast: true,
			class: softColorsHighContrast.sage,
		},
		{
			variant: "soft",
			color: "yellow",
			highContrast: true,
			class: softColorsHighContrast.yellow,
		},
		{
			variant: "soft",
			color: "gray",
			highContrast: true,
			class: softColorsHighContrast.gray,
		},
		{
			variant: "soft",
			color: "red",
			highContrast: true,
			class: softColorsHighContrast.red,
		},
		{
			variant: "soft",
			color: "darkred",
			highContrast: true,
			class: softColorsHighContrast.darkred,
		},
		// Surface
		{
			variant: "surface",
			color: "terracotta",
			highContrast: false,
			class: surfaceColors.terracotta,
		},
		{
			variant: "surface",
			color: "sage",
			highContrast: false,
			class: surfaceColors.sage,
		},
		{
			variant: "surface",
			color: "yellow",
			highContrast: false,
			class: surfaceColors.yellow,
		},
		{
			variant: "surface",
			color: "gray",
			highContrast: false,
			class: surfaceColors.gray,
		},
		{
			variant: "surface",
			color: "red",
			highContrast: false,
			class: surfaceColors.red,
		},
		{
			variant: "surface",
			color: "darkred",
			highContrast: false,
			class: surfaceColors.darkred,
		},
		// Surface (high contrast)
		{
			variant: "surface",
			color: "terracotta",
			highContrast: true,
			class: surfaceColorsHighContrast.terracotta,
		},
		{
			variant: "surface",
			color: "sage",
			highContrast: true,
			class: surfaceColorsHighContrast.sage,
		},
		{
			variant: "surface",
			color: "yellow",
			highContrast: true,
			class: surfaceColorsHighContrast.yellow,
		},
		{
			variant: "surface",
			color: "gray",
			highContrast: true,
			class: surfaceColorsHighContrast.gray,
		},
		{
			variant: "surface",
			color: "red",
			highContrast: true,
			class: surfaceColorsHighContrast.red,
		},
		{
			variant: "surface",
			color: "darkred",
			highContrast: true,
			class: surfaceColorsHighContrast.darkred,
		},
		// Outline
		{
			variant: "outline",
			color: "terracotta",
			highContrast: false,
			class: outlineColors.terracotta,
		},
		{
			variant: "outline",
			color: "sage",
			highContrast: false,
			class: outlineColors.sage,
		},
		{
			variant: "outline",
			color: "yellow",
			highContrast: false,
			class: outlineColors.yellow,
		},
		{
			variant: "outline",
			color: "gray",
			highContrast: false,
			class: outlineColors.gray,
		},
		{
			variant: "outline",
			color: "red",
			highContrast: false,
			class: outlineColors.red,
		},
		{
			variant: "outline",
			color: "darkred",
			highContrast: false,
			class: outlineColors.darkred,
		},
		// Outline (high contrast)
		{
			variant: "outline",
			color: "terracotta",
			highContrast: true,
			class: outlineColorsHighContrast.terracotta,
		},
		{
			variant: "outline",
			color: "sage",
			highContrast: true,
			class: outlineColorsHighContrast.sage,
		},
		{
			variant: "outline",
			color: "yellow",
			highContrast: true,
			class: outlineColorsHighContrast.yellow,
		},
		{
			variant: "outline",
			color: "gray",
			highContrast: true,
			class: outlineColorsHighContrast.gray,
		},
		{
			variant: "outline",
			color: "red",
			highContrast: true,
			class: outlineColorsHighContrast.red,
		},
		{
			variant: "outline",
			color: "darkred",
			highContrast: true,
			class: outlineColorsHighContrast.darkred,
		},
		// Border + BorderColor combinations
		{
			border: "small",
			borderColor: "terracotta",
			class: `${borderColors.terracotta}`,
		},
		{ border: "small", borderColor: "sage", class: `${borderColors.sage}` },
		{ border: "small", borderColor: "yellow", class: `${borderColors.yellow}` },
		{ border: "small", borderColor: "red", class: `${borderColors.red}` },
		{ border: "small", borderColor: "amber", class: `${borderColors.amber}` },
		{ border: "small", borderColor: "gray", class: `${borderColors.gray}` },
		{
			border: "small",
			borderColor: "darkred",
			class: `${borderColors.darkred}`,
		},
		{
			border: "medium",
			borderColor: "terracotta",
			class: `${borderColors.terracotta}`,
		},
		{ border: "medium", borderColor: "sage", class: `${borderColors.sage}` },
		{
			border: "medium",
			borderColor: "yellow",
			class: `${borderColors.yellow}`,
		},
		{ border: "medium", borderColor: "red", class: `${borderColors.red}` },
		{ border: "medium", borderColor: "amber", class: `${borderColors.amber}` },
		{ border: "medium", borderColor: "gray", class: `${borderColors.gray}` },
		{
			border: "medium",
			borderColor: "darkred",
			class: `${borderColors.darkred}`,
		},
		{
			border: "large",
			borderColor: "terracotta",
			class: `${borderColors.terracotta}`,
		},
		{ border: "large", borderColor: "sage", class: `${borderColors.sage}` },
		{ border: "large", borderColor: "yellow", class: `${borderColors.yellow}` },
		{ border: "large", borderColor: "red", class: `${borderColors.red}` },
		{ border: "large", borderColor: "amber", class: `${borderColors.amber}` },
		{ border: "large", borderColor: "gray", class: `${borderColors.gray}` },
		{
			border: "large",
			borderColor: "darkred",
			class: `${borderColors.darkred}`,
		},
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
