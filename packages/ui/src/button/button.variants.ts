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
		// Solid
		{ variant: "solid", color: "terracotta", class: solidColors.terracotta },
		{ variant: "solid", color: "sage", class: solidColors.sage },
		{ variant: "solid", color: "yellow", class: solidColors.yellow },
		{ variant: "solid", color: "gray", class: solidColors.gray },
		{ variant: "solid", color: "red", class: solidColors.red },
		{ variant: "solid", color: "amber", class: solidColors.amber },
		{ variant: "solid", color: "darkred", class: solidColors.darkred },
		// Soft
		{ variant: "soft", color: "terracotta", class: softColors.terracotta },
		{ variant: "soft", color: "sage", class: softColors.sage },
		{ variant: "soft", color: "yellow", class: softColors.yellow },
		{ variant: "soft", color: "gray", class: softColors.gray },
		{ variant: "soft", color: "red", class: softColors.red },
		{ variant: "soft", color: "amber", class: softColors.amber },
		{ variant: "soft", color: "darkred", class: softColors.darkred },
		// Outline
		{
			variant: "outline",
			color: "terracotta",
			class: outlineColors.terracotta,
		},
		{ variant: "outline", color: "sage", class: outlineColors.sage },
		{ variant: "outline", color: "yellow", class: outlineColors.yellow },
		{ variant: "outline", color: "gray", class: outlineColors.gray },
		{ variant: "outline", color: "red", class: outlineColors.red },
		{ variant: "outline", color: "amber", class: outlineColors.amber },
		{ variant: "outline", color: "darkred", class: outlineColors.darkred },
		// Ghost
		{ variant: "ghost", color: "terracotta", class: ghostColors.terracotta },
		{ variant: "ghost", color: "sage", class: ghostColors.sage },
		{ variant: "ghost", color: "yellow", class: ghostColors.yellow },
		{ variant: "ghost", color: "gray", class: ghostColors.gray },
		{ variant: "ghost", color: "red", class: ghostColors.red },
		{ variant: "ghost", color: "amber", class: ghostColors.amber },
		{ variant: "ghost", color: "darkred", class: ghostColors.darkred },
		// Border + BorderColor combinations
		{
			border: "small",
			borderColor: "terracotta",
			class: `${borderColors.terracotta}`,
		},
		{ border: "small", borderColor: "sage", class: `${borderColors.sage}` },
		{ border: "small", borderColor: "yellow", class: `${borderColors.yellow}` },
		{ border: "small", borderColor: "gray", class: `${borderColors.gray}` },
		{ border: "small", borderColor: "red", class: `${borderColors.red}` },
		{ border: "small", borderColor: "amber", class: `${borderColors.amber}` },
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
		{ border: "medium", borderColor: "gray", class: `${borderColors.gray}` },
		{ border: "medium", borderColor: "red", class: `${borderColors.red}` },
		{ border: "medium", borderColor: "amber", class: `${borderColors.amber}` },
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
		{ border: "large", borderColor: "gray", class: `${borderColors.gray}` },
		{ border: "large", borderColor: "red", class: `${borderColors.red}` },
		{ border: "large", borderColor: "amber", class: `${borderColors.amber}` },
		{
			border: "large",
			borderColor: "darkred",
			class: `${borderColors.darkred}`,
		},
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
