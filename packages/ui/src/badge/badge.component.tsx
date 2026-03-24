import type { ComponentPropsWithRef } from "react";
import type { BadgeColor, BadgeSize, BadgeVariant } from "./badge.variants.ts";
import { badgeVariants } from "./badge.variants.ts";

export interface BadgeProps extends ComponentPropsWithRef<"span"> {
	variant?: BadgeVariant;
	size?: BadgeSize;
	color?: BadgeColor;
	highContrast?: boolean;
}

export function Badge({ variant, size, color, highContrast, className, ...props }: BadgeProps) {
	return (
		<span
			{...props}
			className={badgeVariants({ variant, size, color, highContrast, class: className })}
		/>
	);
}
