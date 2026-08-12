import type { Colors } from "../theme/types.ts";
import { tw } from "../utils/tw.ts";

export const solidColors: Record<Colors, string> = {
	terracotta: tw(
		"bg-terracotta-9 text-white",
		"data-hovered:bg-terracotta-10 data-pressed:brightness-125",
	),
	sage: tw(
		"bg-sage-9 text-white",
		"data-hovered:bg-sage-10 data-pressed:brightness-105",
	),
	yellow: tw(
		"bg-yellow-9 text-[var(--yellow-contrast)]",
		"data-hovered:bg-yellow-10 data-pressed:brightness-105",
	),
	gray: tw(
		"bg-gray-9 text-white",
		"data-hovered:bg-gray-10 data-pressed:brightness-105",
	),
	red: tw(
		"bg-red-9 text-white",
		"data-hovered:bg-red-10 data-pressed:brightness-105",
	),
	amber: tw(
		"bg-amber-9 text-[var(--amber-contrast)]",
		"data-hovered:bg-amber-10 data-pressed:brightness-105",
	),
	darkred: tw(
		"bg-darkred-9 text-white",
		"data-hovered:bg-darkred-10 data-pressed:brightness-105",
	),
};

export const softColors: Record<Colors, string> = {
	terracotta: tw(
		"bg-terracotta-3 text-terracotta-11",
		"data-hovered:bg-terracotta-4 data-pressed:bg-terracotta-5",
	),
	sage: tw(
		"bg-sage-3 text-sage-11",
		"data-hovered:bg-sage-4 data-pressed:bg-sage-5",
	),
	yellow: tw(
		"bg-yellow-3 text-yellow-11",
		"data-hovered:bg-yellow-4 data-pressed:bg-yellow-5",
	),
	gray: tw(
		"bg-gray-3 text-gray-11",
		"data-hovered:bg-gray-4 data-pressed:bg-gray-5",
	),
	red: tw(
		"bg-red-3 text-red-11",
		"data-hovered:bg-red-4 data-pressed:bg-red-5",
	),
	amber: tw(
		"bg-amber-3 text-amber-11",
		"data-hovered:bg-amber-4 data-pressed:bg-amber-5",
	),
	darkred: tw(
		"bg-darkred-3 text-darkred-11",
		"data-hovered:bg-darkred-4 data-pressed:bg-darkred-5",
	),
};

export const outlineColors: Record<Colors, string> = {
	terracotta: tw(
		"border border-terracotta-7 text-terracotta-11",
		"data-hovered:bg-terracotta-2 data-pressed:bg-terracotta-3",
	),
	sage: tw(
		"border border-sage-7 text-sage-11",
		"data-hovered:bg-sage-2 data-pressed:bg-sage-3",
	),
	yellow: tw(
		"border border-yellow-7 text-yellow-11",
		"data-hovered:bg-yellow-2 data-pressed:bg-yellow-3",
	),
	gray: tw(
		"border border-gray-7 text-gray-11",
		"data-hovered:bg-gray-2 data-pressed:bg-gray-3",
	),
	red: tw(
		"border border-red-7 text-red-11",
		"data-hovered:bg-red-2 data-pressed:bg-red-3",
	),
	amber: tw(
		"border border-amber-7 text-amber-11",
		"data-hovered:bg-amber-2 data-pressed:bg-amber-3",
	),
	darkred: tw(
		"border border-darkred-7 text-darkred-11",
		"data-hovered:bg-darkred-2 data-pressed:bg-darkred-3",
	),
};

export const ghostColors: Record<Colors, string> = {
	terracotta: tw(
		"text-terracotta-11",
		"data-hovered:bg-terracotta-3 data-pressed:bg-terracotta-4",
	),
	sage: tw("text-sage-11", "data-hovered:bg-sage-3 data-pressed:bg-sage-4"),
	yellow: tw(
		"text-yellow-11",
		"data-hovered:bg-yellow-3 data-pressed:bg-yellow-4",
	),
	gray: tw("text-gray-11", "data-hovered:bg-gray-3 data-pressed:bg-gray-4"),
	red: tw("text-red-11", "data-hovered:bg-red-3 data-pressed:bg-red-4"),
	amber: tw("text-amber-11", "data-hovered:bg-amber-3 data-pressed:bg-amber-4"),
	darkred: tw(
		"text-darkred-11",
		"data-hovered:bg-darkred-3 data-pressed:bg-darkred-4",
	),
};

export const surfaceColors: Record<Colors, string> = {
	terracotta: tw(
		"bg-terracotta-2 text-terracotta-11",
		"shadow-[inset_0_0_0_1px_var(--color-terracotta-6)]",
	),
	sage: tw(
		"bg-sage-2 text-sage-11",
		"shadow-[inset_0_0_0_1px_var(--color-sage-6)]",
	),
	yellow: tw(
		"bg-yellow-2 text-yellow-11",
		"shadow-[inset_0_0_0_1px_var(--color-yellow-6)]",
	),
	gray: tw(
		"bg-gray-2 text-gray-11",
		"shadow-[inset_0_0_0_1px_var(--color-gray-6)]",
	),
	red: tw(
		"bg-red-2 text-red-11",
		"shadow-[inset_0_0_0_1px_var(--color-red-6)]",
	),
	amber: tw(
		"bg-amber-2 text-amber-11",
		"shadow-[inset_0_0_0_1px_var(--color-amber-6)]",
	),
	darkred: tw(
		"bg-darkred-2 text-darkred-11",
		"shadow-[inset_0_0_0_1px_var(--color-darkred-6)]",
	),
};

export const solidColorsHighContrast: Record<Colors, string> = {
	terracotta: tw("bg-terracotta-12 text-terracotta-1"),
	sage: tw("bg-sage-12 text-sage-1"),
	yellow: tw("bg-yellow-12 text-yellow-1"),
	gray: tw("bg-gray-12 text-gray-1"),
	red: tw("bg-red-12 text-red-1"),
	amber: tw("bg-amber-12 text-amber-1"),
	darkred: tw("bg-darkred-12 text-darkred-1"),
};

export const softColorsHighContrast: Record<Colors, string> = {
	terracotta: tw("bg-terracotta-3 text-terracotta-12"),
	sage: tw("bg-sage-3 text-sage-12"),
	yellow: tw("bg-yellow-3 text-yellow-12"),
	gray: tw("bg-gray-3 text-gray-12"),
	red: tw("bg-red-3 text-red-12"),
	amber: tw("bg-amber-3 text-amber-12"),
	darkred: tw("bg-darkred-3 text-darkred-12"),
};

export const surfaceColorsHighContrast: Record<Colors, string> = {
	terracotta: tw(
		"bg-terracotta-2 text-terracotta-12",
		"shadow-[inset_0_0_0_1px_var(--color-terracotta-6)]",
	),
	sage: tw(
		"bg-sage-2 text-sage-12",
		"shadow-[inset_0_0_0_1px_var(--color-sage-6)]",
	),
	yellow: tw(
		"bg-yellow-2 text-yellow-12",
		"shadow-[inset_0_0_0_1px_var(--color-yellow-6)]",
	),
	gray: tw(
		"bg-gray-2 text-gray-12",
		"shadow-[inset_0_0_0_1px_var(--color-gray-6)]",
	),
	red: tw(
		"bg-red-2 text-red-12",
		"shadow-[inset_0_0_0_1px_var(--color-red-6)]",
	),
	amber: tw(
		"bg-amber-2 text-amber-12",
		"shadow-[inset_0_0_0_1px_var(--color-amber-6)]",
	),
	darkred: tw(
		"bg-darkred-2 text-darkred-12",
		"shadow-[inset_0_0_0_1px_var(--color-darkred-6)]",
	),
};

export const outlineColorsHighContrast: Record<Colors, string> = {
	terracotta: tw("border border-terracotta-11 text-terracotta-12"),
	sage: tw("border border-sage-11 text-sage-12"),
	yellow: tw("border border-yellow-11 text-yellow-12"),
	gray: tw("border border-gray-11 text-gray-12"),
	red: tw("border border-red-11 text-red-12"),
	amber: tw("border border-amber-11 text-amber-12"),
	darkred: tw("border border-darkred-11 text-darkred-12"),
};

export const focusRings: Record<Colors, string> = {
	terracotta: tw(
		"data-focus-visible:ring-2 data-focus-visible:ring-offset-2",
		"data-focus-visible:ring-terracotta-8",
	),
	sage: tw(
		"data-focus-visible:ring-2 data-focus-visible:ring-offset-2",
		"data-focus-visible:ring-sage-8",
	),
	yellow: tw(
		"data-focus-visible:ring-2 data-focus-visible:ring-offset-2",
		"data-focus-visible:ring-yellow-8",
	),
	gray: tw(
		"data-focus-visible:ring-2 data-focus-visible:ring-offset-2",
		"data-focus-visible:ring-gray-8",
	),
	red: tw(
		"data-focus-visible:ring-2 data-focus-visible:ring-offset-2",
		"data-focus-visible:ring-red-8",
	),
	amber: tw(
		"data-focus-visible:ring-2 data-focus-visible:ring-offset-2",
		"data-focus-visible:ring-amber-8",
	),
	darkred: tw(
		"data-focus-visible:ring-2 data-focus-visible:ring-offset-2",
		"data-focus-visible:ring-darkred-8",
	),
};
