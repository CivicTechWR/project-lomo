import type { Colors } from "../theme/types.ts";

type ColorMap = Record<Colors, string>;

export const solidColors: ColorMap = {
	terracotta: "bg-terracotta-9 text-white data-[hovered]:bg-terracotta-10 data-[pressed]:brightness-125",
	sage: "bg-sage-9 text-white data-[hovered]:bg-sage-10 data-[pressed]:brightness-105",
	yellow: "bg-yellow-9 text-[var(--yellow-contrast)] data-[hovered]:bg-yellow-10 data-[pressed]:brightness-105",
	gray: "bg-gray-9 text-white data-[hovered]:bg-gray-10 data-[pressed]:brightness-105",
	red: "bg-red-9 text-white data-[hovered]:bg-red-10 data-[pressed]:brightness-105",
	amber: "bg-amber-9 text-[var(--amber-contrast)] data-[hovered]:bg-amber-10 data-[pressed]:brightness-105",
};

export const softColors: ColorMap = {
	terracotta: "bg-terracotta-3 text-terracotta-11 data-[hovered]:bg-terracotta-4 data-[pressed]:bg-terracotta-5",
	sage: "bg-sage-3 text-sage-11 data-[hovered]:bg-sage-4 data-[pressed]:bg-sage-5",
	yellow: "bg-yellow-3 text-yellow-11 data-[hovered]:bg-yellow-4 data-[pressed]:bg-yellow-5",
	gray: "bg-gray-3 text-gray-11 data-[hovered]:bg-gray-4 data-[pressed]:bg-gray-5",
	red: "bg-red-3 text-red-11 data-[hovered]:bg-red-4 data-[pressed]:bg-red-5",
	amber: "bg-amber-3 text-amber-11 data-[hovered]:bg-amber-4 data-[pressed]:bg-amber-5",
};

export const outlineColors: ColorMap = {
	terracotta: "border border-terracotta-7 text-terracotta-11 data-[hovered]:bg-terracotta-2 data-[pressed]:bg-terracotta-3",
	sage: "border border-sage-7 text-sage-11 data-[hovered]:bg-sage-2 data-[pressed]:bg-sage-3",
	yellow: "border border-yellow-7 text-yellow-11 data-[hovered]:bg-yellow-2 data-[pressed]:bg-yellow-3",
	gray: "border border-gray-7 text-gray-11 data-[hovered]:bg-gray-2 data-[pressed]:bg-gray-3",
	red: "border border-red-7 text-red-11 data-[hovered]:bg-red-2 data-[pressed]:bg-red-3",
	amber: "border border-amber-7 text-amber-11 data-[hovered]:bg-amber-2 data-[pressed]:bg-amber-3",
};

export const ghostColors: ColorMap = {
	terracotta: "text-terracotta-11 data-[hovered]:bg-terracotta-3 data-[pressed]:bg-terracotta-4",
	sage: "text-sage-11 data-[hovered]:bg-sage-3 data-[pressed]:bg-sage-4",
	yellow: "text-yellow-11 data-[hovered]:bg-yellow-3 data-[pressed]:bg-yellow-4",
	gray: "text-gray-11 data-[hovered]:bg-gray-3 data-[pressed]:bg-gray-4",
	red: "text-red-11 data-[hovered]:bg-red-3 data-[pressed]:bg-red-4",
	amber: "text-amber-11 data-[hovered]:bg-amber-3 data-[pressed]:bg-amber-4",
};

export const focusRings: ColorMap = {
	terracotta: "data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-terracotta-8",
	sage: "data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-sage-8",
	yellow: "data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-yellow-8",
	gray: "data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-gray-8",
	red: "data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-red-8",
	amber: "data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-amber-8",
};
