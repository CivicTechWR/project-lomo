import { tw } from "../utils/tw.ts";

export const interactiveSizes = {
	1: tw(
		"h-6 px-4",
		"text-[length:var(--text-1)]",
		"leading-[var(--text-1--line-height)]",
		"rounded-[var(--radius-1)] gap-1",
	),
	2: tw(
		"h-8 px-5",
		"text-[length:var(--text-2)]",
		"leading-[var(--text-2--line-height)]",
		"rounded-[var(--radius-2)] gap-1.5",
	),
	3: tw(
		"h-10 px-4",
		"text-[length:var(--text-3)]",
		"leading-[var(--text-3--line-height)]",
		"rounded-[var(--radius-3)] gap-2",
	),
	4: tw(
		"h-12 px-5",
		"text-[length:var(--text-4)]",
		"leading-[var(--text-4--line-height)]",
		"rounded-[var(--radius-4)] gap-2.5",
	),
} as const;
