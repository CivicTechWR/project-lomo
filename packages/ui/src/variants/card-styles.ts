import type { Colors } from "../theme/types.ts";
import { tw } from "../utils/tw.ts";

type ColorMap = Record<Colors, string>;

/* ── Card base ── */

export const cardBase = tw(
	"relative overflow-hidden box-border",
);

/* ── Card sizes (padding + border-radius) ── */

export const cardSizes = {
	1: tw("p-3 rounded-[var(--radius-3)]"),
	2: tw("p-4 rounded-[var(--radius-4)]"),
	3: tw("p-6 rounded-[var(--radius-4)]"),
	4: tw("p-8 rounded-[var(--radius-5)]"),
	5: tw("p-12 rounded-[var(--radius-5)]"),
};

/* ── Ghost colors — tinted background only, no chrome ── */

export const cardGhostColors: ColorMap = {
	terracotta: tw("bg-terracotta-3 data-hovered:bg-terracotta-3 data-pressed:bg-terracotta-4"),
	sage: tw("bg-sage-3 data-hovered:bg-sage-3 data-pressed:bg-sage-4"),
	yellow: tw("bg-yellow-3 data-hovered:bg-yellow-3 data-pressed:bg-yellow-4"),
	gray: tw("bg-gray-3 data-hovered:bg-gray-3 data-pressed:bg-gray-4"),
	red: tw("bg-red-3 data-hovered:bg-red-3 data-pressed:bg-red-4"),
	amber: tw("bg-amber-3 data-hovered:bg-amber-3 data-pressed:bg-amber-4"),
};

/* ── Surface colors — tinted background + color-matched inset ring ── */

export const cardSurfaceColors: ColorMap = {
	terracotta: tw(
		"bg-terracotta-3 shadow-[inset_0_0_0_1px_var(--color-terracotta-6)]",
		"data-hovered:shadow-[inset_0_0_0_1px_var(--color-terracotta-7)]",
		"data-pressed:shadow-[inset_0_0_0_1px_var(--color-terracotta-8)]",
	),
	sage: tw(
		"bg-sage-3 shadow-[inset_0_0_0_1px_var(--color-sage-6)]",
		"data-hovered:shadow-[inset_0_0_0_1px_var(--color-sage-7)]",
		"data-pressed:shadow-[inset_0_0_0_1px_var(--color-sage-8)]",
	),
	yellow: tw(
		"bg-yellow-3 shadow-[inset_0_0_0_1px_var(--color-yellow-6)]",
		"data-hovered:shadow-[inset_0_0_0_1px_var(--color-yellow-7)]",
		"data-pressed:shadow-[inset_0_0_0_1px_var(--color-yellow-8)]",
	),
	gray: tw(
		"bg-gray-3 shadow-[var(--shadow-card-surface)]",
		"data-hovered:shadow-[var(--shadow-card-surface-hover)]",
		"data-pressed:shadow-[var(--shadow-card-surface-active)]",
	),
	red: tw(
		"bg-red-3 shadow-[inset_0_0_0_1px_var(--color-red-6)]",
		"data-hovered:shadow-[inset_0_0_0_1px_var(--color-red-7)]",
		"data-pressed:shadow-[inset_0_0_0_1px_var(--color-red-8)]",
	),
	amber: tw(
		"bg-amber-3 shadow-[inset_0_0_0_1px_var(--color-amber-6)]",
		"data-hovered:shadow-[inset_0_0_0_1px_var(--color-amber-7)]",
		"data-pressed:shadow-[inset_0_0_0_1px_var(--color-amber-8)]",
	),
};

/* ── Classic colors — tinted background + layered elevation shadow ── */

export const cardClassicColors: ColorMap = {
	terracotta: tw(
		"bg-terracotta-3 shadow-[var(--shadow-card-classic)]",
		"data-hovered:shadow-[var(--shadow-card-classic-hover)]",
		"data-pressed:shadow-[var(--shadow-card-classic-active)]",
	),
	sage: tw(
		"bg-sage-3 shadow-[var(--shadow-card-classic)]",
		"data-hovered:shadow-[var(--shadow-card-classic-hover)]",
		"data-pressed:shadow-[var(--shadow-card-classic-active)]",
	),
	yellow: tw(
		"bg-yellow-3 shadow-[var(--shadow-card-classic)]",
		"data-hovered:shadow-[var(--shadow-card-classic-hover)]",
		"data-pressed:shadow-[var(--shadow-card-classic-active)]",
	),
	gray: tw(
		"bg-gray-3 shadow-[var(--shadow-card-classic)]",
		"data-hovered:shadow-[var(--shadow-card-classic-hover)]",
		"data-pressed:shadow-[var(--shadow-card-classic-active)]",
	),
	red: tw(
		"bg-red-3 shadow-[var(--shadow-card-classic)]",
		"data-hovered:shadow-[var(--shadow-card-classic-hover)]",
		"data-pressed:shadow-[var(--shadow-card-classic-active)]",
	),
	amber: tw(
		"bg-amber-3 shadow-[var(--shadow-card-classic)]",
		"data-hovered:shadow-[var(--shadow-card-classic-hover)]",
		"data-pressed:shadow-[var(--shadow-card-classic-active)]",
	),
};
