import { tv } from "tailwind-variants";

export const segmentedProgressVariants = tv({
	slots: {
		root: "flex w-full",
		segment: "flex-1 rounded-full transition-colors",
	},
	variants: {
		size: {
			sm: {
				root: "max-w-[min(100%,320px)] gap-1",
				segment: "h-2 min-h-2",
			},
			md: {
				root: "gap-2",
				segment: "h-4 min-h-4 border-4 border-terracotta-9 shadow-brand-strong",
			},
		},
		color: {
			sage: {},
			terracotta: {},
			yellow: {},
		},
	},
	defaultVariants: {
		size: "sm",
		color: "sage",
	},
});

export function getSegmentColorClass(
	color: "sage" | "terracotta" | "yellow",
	size: "sm" | "md",
	isFilled: boolean,
): string {
	if (size === "md") {
		return isFilled ? "bg-yellow-10" : "bg-terracotta-9";
	}
	if (color === "sage") {
		return isFilled ? "bg-sage-9" : "bg-sage-4";
	}
	if (color === "terracotta") {
		return isFilled ? "bg-terracotta-9" : "bg-terracotta-4";
	}
	return isFilled ? "bg-yellow-10" : "bg-yellow-4";
}
