import { tv } from "tailwind-variants";
import { tw } from "../utils/tw.ts";
import { CHECKBOX_DEFAULTS } from "./checkbox.context.ts";

export const checkboxVariants = tv({
	base: tw(
		"group inline-flex items-center",
		"cursor-default select-none",
		"data-disabled:opacity-50 data-disabled:cursor-not-allowed",
	),
	variants: {
		variant: {
			surface: "",
			classic: "",
		},
		size: {
			1: tw(
				"gap-1.5",
				"text-[length:var(--text-1)]",
				"leading-[var(--text-1--line-height)]",
			),
			2: tw(
				"gap-2",
				"text-[length:var(--text-2)]",
				"leading-[var(--text-2--line-height)]",
			),
			3: tw(
				"gap-2.5",
				"text-[length:var(--text-3)]",
				"leading-[var(--text-3--line-height)]",
			),
		},
		color: {
			terracotta: "",
			sage: "",
			yellow: "",
			gray: "",
			red: "",
			amber: "",
		},
	},
	defaultVariants: {
		variant: CHECKBOX_DEFAULTS.variant,
		size: CHECKBOX_DEFAULTS.size,
		color: CHECKBOX_DEFAULTS.color,
	},
});
