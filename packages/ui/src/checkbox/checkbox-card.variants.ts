import { tv } from "tailwind-variants";
import { tw } from "../utils/tw.ts";
import {
	cardBase,
	cardClassicColors,
	cardGhostColors,
	cardSurfaceColors,
	focusRings,
} from "../variants/index.ts";

export const checkboxCardVariants = tv({
	base: tw(
		cardBase,
		"group",
		"cursor-default select-none",
		"transition-colors duration-150",
		"data-disabled:opacity-50 data-disabled:cursor-not-allowed",
	),
	variants: {
		variant: {
			ghost: "",
			surface: "",
			classic: "",
		},
		size: {
			1: tw("p-3 rounded-[var(--radius-3)]"),
			2: tw("p-4 rounded-[var(--radius-4)]"),
			3: tw("p-6 rounded-[var(--radius-4)]"),
		},
		color: {
			terracotta: tw(
				focusRings.terracotta,
				"data-selected:shadow-[inset_0_0_0_2px_var(--color-terracotta-9)]",
			),
			sage: tw(
				focusRings.sage,
				"data-selected:shadow-[inset_0_0_0_2px_var(--color-sage-9)]",
			),
			yellow: tw(
				focusRings.yellow,
				"data-selected:shadow-[inset_0_0_0_2px_var(--color-yellow-9)]",
			),
			gray: tw(
				focusRings.gray,
				"data-selected:shadow-[inset_0_0_0_2px_var(--color-gray-9)]",
			),
			red: tw(
				focusRings.red,
				"data-selected:shadow-[inset_0_0_0_2px_var(--color-red-9)]",
			),
			amber: tw(
				focusRings.amber,
				"data-selected:shadow-[inset_0_0_0_2px_var(--color-amber-9)]",
			),
		},
	},
	compoundVariants: [
		/* ── Ghost variant ── */
		{ variant: "ghost", color: "terracotta", class: cardGhostColors.terracotta },
		{ variant: "ghost", color: "sage", class: cardGhostColors.sage },
		{ variant: "ghost", color: "yellow", class: cardGhostColors.yellow },
		{ variant: "ghost", color: "gray", class: cardGhostColors.gray },
		{ variant: "ghost", color: "red", class: cardGhostColors.red },
		{ variant: "ghost", color: "amber", class: cardGhostColors.amber },

		/* ── Surface variant ── */
		{ variant: "surface", color: "terracotta", class: cardSurfaceColors.terracotta },
		{ variant: "surface", color: "sage", class: cardSurfaceColors.sage },
		{ variant: "surface", color: "yellow", class: cardSurfaceColors.yellow },
		{ variant: "surface", color: "gray", class: cardSurfaceColors.gray },
		{ variant: "surface", color: "red", class: cardSurfaceColors.red },
		{ variant: "surface", color: "amber", class: cardSurfaceColors.amber },

		/* ── Classic variant ── */
		{ variant: "classic", color: "terracotta", class: cardClassicColors.terracotta },
		{ variant: "classic", color: "sage", class: cardClassicColors.sage },
		{ variant: "classic", color: "yellow", class: cardClassicColors.yellow },
		{ variant: "classic", color: "gray", class: cardClassicColors.gray },
		{ variant: "classic", color: "red", class: cardClassicColors.red },
		{ variant: "classic", color: "amber", class: cardClassicColors.amber },
	],
	defaultVariants: {
		variant: "surface",
		size: 2,
		color: "terracotta",
	},
});
