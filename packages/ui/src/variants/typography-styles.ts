import { tw } from "../utils/tw.ts";

// ── Font weight ──
export const fontWeights = {
	light: tw("font-light"),
	regular: tw("font-normal"),
	medium: tw("font-medium"),
	bold: tw("font-bold"),
} as const;

// ── Trim (negative-margin leading trim) ──
export const trimVariants = {
	normal: "",
	start: tw("mt-[calc(var(--leading-trim-start)*-1)]"),
	end: tw("mb-[calc(var(--leading-trim-end)*-1)]"),
	both: tw(
		"mt-[calc(var(--leading-trim-start)*-1)] mb-[calc(var(--leading-trim-end)*-1)]",
	),
} as const;
