import { tv } from "tailwind-variants";
import { tw } from "../utils/tw.ts";
import {
	focusRings,
	fontWeights,
	linkTextColors,
	linkTextColorsHighContrast,
	linkUnderlineColors,
	linkUnderlineColorsHighContrast,
	trimVariants,
	typographySizes,
} from "../variants/index.ts";

export const linkVariants = tv({
	base: tw(
		"cursor-pointer outline-none transition-colors",
		"decoration-solid [text-decoration-thickness:min(2px,max(1px,0.05em))] [text-underline-offset:calc(0.025em+2px)]",
		"data-disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:no-underline",
		"data-focus-visible:no-underline data-focus-visible:rounded-[calc(0.15em*var(--radius-factor))]",
	),
	variants: {
		size: typographySizes,
		weight: fontWeights,
		trim: trimVariants,
		underline: {
			auto: "",
			always: tw("underline"),
			hover: "",
			none: tw("no-underline"),
		},
		color: {
			terracotta: focusRings.terracotta,
			sage: focusRings.sage,
			yellow: focusRings.yellow,
			gray: focusRings.gray,
			red: focusRings.red,
			amber: focusRings.amber,
		},
		highContrast: {
			true: "",
			false: "",
		},
		truncate: {
			true: tw("truncate"),
			false: "",
		},
		wrap: {
			wrap: tw("text-wrap"),
			nowrap: tw("text-nowrap"),
			pretty: tw("text-pretty"),
			balance: tw("text-balance"),
		},
	},
	compoundVariants: [
		// ── Text + underline colors: standard contrast ──
		{ highContrast: false, color: "terracotta", class: `${linkTextColors.terracotta} ${linkUnderlineColors.terracotta}` },
		{ highContrast: false, color: "sage", class: `${linkTextColors.sage} ${linkUnderlineColors.sage}` },
		{ highContrast: false, color: "yellow", class: `${linkTextColors.yellow} ${linkUnderlineColors.yellow}` },
		{ highContrast: false, color: "gray", class: `${linkTextColors.gray} ${linkUnderlineColors.gray}` },
		{ highContrast: false, color: "red", class: `${linkTextColors.red} ${linkUnderlineColors.red}` },
		{ highContrast: false, color: "amber", class: `${linkTextColors.amber} ${linkUnderlineColors.amber}` },
		// ── Text + underline colors: high contrast ──
		{ highContrast: true, color: "terracotta", class: `${linkTextColorsHighContrast.terracotta} ${linkUnderlineColorsHighContrast.terracotta}` },
		{ highContrast: true, color: "sage", class: `${linkTextColorsHighContrast.sage} ${linkUnderlineColorsHighContrast.sage}` },
		{ highContrast: true, color: "yellow", class: `${linkTextColorsHighContrast.yellow} ${linkUnderlineColorsHighContrast.yellow}` },
		{ highContrast: true, color: "gray", class: `${linkTextColorsHighContrast.gray} ${linkUnderlineColorsHighContrast.gray}` },
		{ highContrast: true, color: "red", class: `${linkTextColorsHighContrast.red} ${linkUnderlineColorsHighContrast.red}` },
		{ highContrast: true, color: "amber", class: `${linkTextColorsHighContrast.amber} ${linkUnderlineColorsHighContrast.amber}` },
		// ── Underline "auto": hover-only for standard, always for highContrast ──
		{ underline: "auto" as const, highContrast: false, class: tw("no-underline data-hovered:underline") },
		{ underline: "auto" as const, highContrast: true, class: tw("underline") },
		// ── Underline "hover": hover-only regardless of contrast ──
		{ underline: "hover" as const, class: tw("no-underline data-hovered:underline") },
	],
	defaultVariants: {
		size: 3,
		weight: "regular",
		color: "terracotta",
		underline: "auto",
		highContrast: false,
		trim: "normal",
		truncate: false,
		wrap: "wrap",
	},
});
