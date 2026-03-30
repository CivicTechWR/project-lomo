import { tv } from "tailwind-variants";
import { tw } from "../utils/tw.ts";

export const checkboxIndicatorVariants = tv({
	base: tw(
		"inline-flex items-center justify-center shrink-0",
		"transition-colors duration-150",
	),
	variants: {
		variant: {
			surface: "",
			classic: "",
			soft: "",
		},
		size: {
			1: tw(
				"size-3.5",
				"[&>svg]:size-2.5",
				"rounded-[max(var(--radius-1),var(--radius-full))]",
			),
			2: tw(
				"size-4",
				"[&>svg]:size-3",
				"rounded-[max(var(--radius-1),var(--radius-full))]",
			),
			3: tw(
				"size-5",
				"[&>svg]:size-3.5",
				"rounded-[max(var(--radius-2),var(--radius-full))]",
			),
		},
		color: {
			terracotta: tw(
				"group-data-selected:bg-terracotta-9 group-data-selected:text-white group-data-selected:shadow-none",
				"group-data-indeterminate:bg-terracotta-9 group-data-indeterminate:text-white group-data-indeterminate:shadow-none",
			),
			sage: tw(
				"group-data-selected:bg-sage-9 group-data-selected:text-white group-data-selected:shadow-none",
				"group-data-indeterminate:bg-sage-9 group-data-indeterminate:text-white group-data-indeterminate:shadow-none",
			),
			yellow: tw(
				"group-data-selected:bg-yellow-9 group-data-selected:text-[var(--yellow-contrast)] group-data-selected:shadow-none",
				"group-data-indeterminate:bg-yellow-9 group-data-indeterminate:text-[var(--yellow-contrast)] group-data-indeterminate:shadow-none",
			),
			gray: tw(
				"group-data-selected:bg-gray-9 group-data-selected:text-white group-data-selected:shadow-none",
				"group-data-indeterminate:bg-gray-9 group-data-indeterminate:text-white group-data-indeterminate:shadow-none",
			),
			red: tw(
				"group-data-selected:bg-red-9 group-data-selected:text-white group-data-selected:shadow-none",
				"group-data-indeterminate:bg-red-9 group-data-indeterminate:text-white group-data-indeterminate:shadow-none",
			),
			amber: tw(
				"group-data-selected:bg-amber-9 group-data-selected:text-[var(--amber-contrast)] group-data-selected:shadow-none",
				"group-data-indeterminate:bg-amber-9 group-data-indeterminate:text-[var(--amber-contrast)] group-data-indeterminate:shadow-none",
			),
		},
	},
	compoundVariants: [
		/* ── Unchecked: surface variant ── */
		{ variant: "surface", color: "terracotta", class: tw("bg-terracotta-2 shadow-[inset_0_0_0_1px_var(--color-terracotta-6)]") },
		{ variant: "surface", color: "sage", class: tw("bg-sage-2 shadow-[inset_0_0_0_1px_var(--color-sage-6)]") },
		{ variant: "surface", color: "yellow", class: tw("bg-yellow-2 shadow-[inset_0_0_0_1px_var(--color-yellow-6)]") },
		{ variant: "surface", color: "gray", class: tw("bg-gray-2 shadow-[inset_0_0_0_1px_var(--color-gray-6)]") },
		{ variant: "surface", color: "red", class: tw("bg-red-2 shadow-[inset_0_0_0_1px_var(--color-red-6)]") },
		{ variant: "surface", color: "amber", class: tw("bg-amber-2 shadow-[inset_0_0_0_1px_var(--color-amber-6)]") },

		/* ── Unchecked: classic variant (color-neutral) ── */
		{ variant: "classic", class: tw("bg-gray-2 shadow-sm") },

		/* ── Unchecked: soft variant ── */
		{ variant: "soft", color: "terracotta", class: "bg-terracotta-3" },
		{ variant: "soft", color: "sage", class: "bg-sage-3" },
		{ variant: "soft", color: "yellow", class: "bg-yellow-3" },
		{ variant: "soft", color: "gray", class: "bg-gray-3" },
		{ variant: "soft", color: "red", class: "bg-red-3" },
		{ variant: "soft", color: "amber", class: "bg-amber-3" },
	],
	defaultVariants: {
		variant: "surface",
		size: 2,
		color: "terracotta",
	},
});
