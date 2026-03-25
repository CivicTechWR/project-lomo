import { tv } from "tailwind-variants";
import { tw } from "../utils/tw.ts";
import {
	fieldFocusRings,
	fieldGroupSizes,
	fieldSoftColors,
} from "../variants/index.ts";

export const groupVariants = tv({
	base: tw(
		"inline-flex items-center w-full",
		"outline-none cursor-text",
		"transition-colors duration-150",
		"data-disabled:opacity-50 data-disabled:cursor-not-allowed",
		"data-invalid:data-focus-within:ring-red-8",
	),
	variants: {
		variant: {
			surface: tw(
				"bg-gray-2 text-gray-12",
				"shadow-[inset_0_0_0_1px_var(--color-gray-6)]",
				"data-hovered:shadow-[inset_0_0_0_1px_var(--color-gray-7)]",
				"data-invalid:shadow-[inset_0_0_0_1px_var(--color-red-7)]",
				"data-invalid:data-hovered:shadow-[inset_0_0_0_1px_var(--color-red-8)]",
			),
			classic: tw(
				"bg-gray-2 text-gray-12",
				"shadow-sm",
				"data-invalid:shadow-[inset_0_0_0_1px_var(--color-red-7)]",
				"data-invalid:data-hovered:shadow-[inset_0_0_0_1px_var(--color-red-8)]",
			),
			soft: "",
		},
		size: fieldGroupSizes,
		color: {
			terracotta: fieldFocusRings.terracotta,
			sage: fieldFocusRings.sage,
			yellow: fieldFocusRings.yellow,
			gray: fieldFocusRings.gray,
			red: fieldFocusRings.red,
			amber: fieldFocusRings.amber,
		},
	},
	compoundVariants: [
		{ variant: "soft", color: "terracotta", class: fieldSoftColors.terracotta },
		{ variant: "soft", color: "sage", class: fieldSoftColors.sage },
		{ variant: "soft", color: "yellow", class: fieldSoftColors.yellow },
		{ variant: "soft", color: "gray", class: fieldSoftColors.gray },
		{ variant: "soft", color: "red", class: fieldSoftColors.red },
		{ variant: "soft", color: "amber", class: fieldSoftColors.amber },
		{ variant: "soft", class: tw(
			"data-invalid:bg-red-3",
			"data-invalid:data-hovered:bg-red-4",
		) },
	],
	defaultVariants: {
		variant: "surface",
		size: 2,
		color: "gray",
	},
});
