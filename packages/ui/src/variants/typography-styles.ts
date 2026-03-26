import type { Colors } from "../theme/types.ts";
import { tw } from "../utils/tw.ts";

type ColorMap = Record<Colors, string>;

// ── Font weight ──
export const fontWeights = {
	light: tw("font-light"),
	regular: tw("font-normal"),
	medium: tw("font-medium"),
	bold: tw("font-bold"),
} as const;

// ── Text colors: standard contrast (step 11) ──
export const textColors: ColorMap = {
	terracotta: tw("text-terracotta-11"),
	sage: tw("text-sage-11"),
	yellow: tw("text-yellow-11"),
	gray: tw("text-gray-11"),
	red: tw("text-red-11"),
	amber: tw("text-amber-11"),
};

// ── Text colors: high contrast (step 12) ──
export const textColorsHighContrast: ColorMap = {
	terracotta: tw("text-terracotta-12"),
	sage: tw("text-sage-12"),
	yellow: tw("text-yellow-12"),
	gray: tw("text-gray-12"),
	red: tw("text-red-12"),
	amber: tw("text-amber-12"),
};

// ── Trim (negative-margin leading trim) ──
export const trimVariants = {
	normal: "",
	start: tw("mt-[calc(var(--leading-trim-start)*-1)]"),
	end: tw("mb-[calc(var(--leading-trim-end)*-1)]"),
	both: tw("mt-[calc(var(--leading-trim-start)*-1)] mb-[calc(var(--leading-trim-end)*-1)]"),
} as const;
