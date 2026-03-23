import { tw } from "../utils/tw.ts";

export const typographySizes = {
	1: tw(
		"text-[length:var(--text-1)]",
		"leading-[var(--text-1--line-height)]",
		"tracking-[var(--tracking-1)]",
	),
	2: tw(
		"text-[length:var(--text-2)]",
		"leading-[var(--text-2--line-height)]",
		"tracking-[var(--tracking-2)]",
	),
	3: tw(
		"text-[length:var(--text-3)]",
		"leading-[var(--text-3--line-height)]",
		"tracking-[var(--tracking-3)]",
	),
	4: tw(
		"text-[length:var(--text-4)]",
		"leading-[var(--text-4--line-height)]",
		"tracking-[var(--tracking-4)]",
	),
	5: tw(
		"text-[length:var(--text-5)]",
		"leading-[var(--text-5--line-height)]",
		"tracking-[var(--tracking-5)]",
	),
	6: tw(
		"text-[length:var(--text-6)]",
		"leading-[var(--text-6--line-height)]",
		"tracking-[var(--tracking-6)]",
	),
	7: tw(
		"text-[length:var(--text-7)]",
		"leading-[var(--text-7--line-height)]",
		"tracking-[var(--tracking-7)]",
	),
	8: tw(
		"text-[length:var(--text-8)]",
		"leading-[var(--text-8--line-height)]",
		"tracking-[var(--tracking-8)]",
	),
	9: tw(
		"text-[length:var(--text-9)]",
		"leading-[var(--text-9--line-height)]",
		"tracking-[var(--tracking-9)]",
	),
} as const;
