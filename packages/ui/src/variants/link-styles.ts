import type { Colors } from "../theme/types.ts";
import { tw } from "../utils/tw.ts";

type ColorMap = Record<Colors, string>;

// ── Link underline colors: standard contrast ──
export const linkUnderlineColors: ColorMap = {
	terracotta: tw(
		"decoration-terracotta-a5-muted",
		"data-hovered:decoration-terracotta-a7-muted",
		"data-pressed:decoration-terracotta-a8-muted",
	),
	sage: tw(
		"decoration-sage-a5-muted",
		"data-hovered:decoration-sage-a7-muted",
		"data-pressed:decoration-sage-a8-muted",
	),
	yellow: tw(
		"decoration-yellow-a5-muted",
		"data-hovered:decoration-yellow-a7-muted",
		"data-pressed:decoration-yellow-a8-muted",
	),
	gray: tw(
		"decoration-gray-a5-muted",
		"data-hovered:decoration-gray-a7-muted",
		"data-pressed:decoration-gray-a8-muted",
	),
	red: tw(
		"decoration-red-a5-muted",
		"data-hovered:decoration-red-a7-muted",
		"data-pressed:decoration-red-a8-muted",
	),
	amber: tw(
		"decoration-amber-a5-muted",
		"data-hovered:decoration-amber-a7-muted",
		"data-pressed:decoration-amber-a8-muted",
	),
};

// ── Link underline colors: high contrast ──
export const linkUnderlineColorsHighContrast: ColorMap = {
	terracotta: tw(
		"decoration-terracotta-a6-muted",
		"data-hovered:decoration-terracotta-a7-muted",
		"data-pressed:decoration-terracotta-a8-muted",
	),
	sage: tw(
		"decoration-sage-a6-muted",
		"data-hovered:decoration-sage-a7-muted",
		"data-pressed:decoration-sage-a8-muted",
	),
	yellow: tw(
		"decoration-yellow-a6-muted",
		"data-hovered:decoration-yellow-a7-muted",
		"data-pressed:decoration-yellow-a8-muted",
	),
	gray: tw(
		"decoration-gray-a6-muted",
		"data-hovered:decoration-gray-a7-muted",
		"data-pressed:decoration-gray-a8-muted",
	),
	red: tw(
		"decoration-red-a6-muted",
		"data-hovered:decoration-red-a7-muted",
		"data-pressed:decoration-red-a8-muted",
	),
	amber: tw(
		"decoration-amber-a6-muted",
		"data-hovered:decoration-amber-a7-muted",
		"data-pressed:decoration-amber-a8-muted",
	),
};

// ── Link text colors: standard contrast (step 11 default, 12 hover, 11 press) ──
export const linkTextColors: ColorMap = {
	terracotta: tw("text-terracotta-11 data-hovered:text-terracotta-12 data-pressed:text-terracotta-11"),
	sage: tw("text-sage-11 data-hovered:text-sage-12 data-pressed:text-sage-11"),
	yellow: tw("text-yellow-11 data-hovered:text-yellow-12 data-pressed:text-yellow-11"),
	gray: tw("text-gray-11 data-hovered:text-gray-12 data-pressed:text-gray-11"),
	red: tw("text-red-11 data-hovered:text-red-12 data-pressed:text-red-11"),
	amber: tw("text-amber-11 data-hovered:text-amber-12 data-pressed:text-amber-11"),
};

// ── Link text colors: high contrast (step 12 throughout) ──
export const linkTextColorsHighContrast: ColorMap = {
	terracotta: tw("text-terracotta-12"),
	sage: tw("text-sage-12"),
	yellow: tw("text-yellow-12"),
	gray: tw("text-gray-12"),
	red: tw("text-red-12"),
	amber: tw("text-amber-12"),
};
