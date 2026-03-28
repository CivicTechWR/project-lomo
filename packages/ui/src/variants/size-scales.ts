import { tw } from "../utils/tw.ts";

export const interactiveSizes = {
	1: tw(
		"h-8 px-4",
		"text-[length:var(--text-1)]",
		"leading-[var(--text-1--line-height)]",
		"rounded-[max(var(--radius-1),var(--radius-full))] gap-1.5",
	),
	2: tw(
		"h-10 px-5",
		"text-[length:var(--text-2)]",
		"leading-[var(--text-2--line-height)]",
		"rounded-[max(var(--radius-2),var(--radius-full))] gap-2",
	),
	3: tw(
		"h-12 px-6",
		"text-[length:var(--text-3)]",
		"leading-[var(--text-3--line-height)]",
		"rounded-[max(var(--radius-3),var(--radius-full))] gap-2.5",
	),
	4: tw(
		"h-14 px-7",
		"text-[length:var(--text-4)]",
		"leading-[var(--text-4--line-height)]",
		"rounded-[max(var(--radius-4),var(--radius-full))] gap-3",
	),
} as const;
