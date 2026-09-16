"use client";

import type { LinkProps as AriaLinkProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { Link as AriaLink } from "react-aria-components";
import { cn } from "../utils/cn.ts";
import { linkVariants } from "./link.variants.ts";

export type LinkProps = AriaLinkProps & VariantProps<typeof linkVariants>;

export function Link({
	color,
	size,
	weight,
	underline,
	highContrast,
	trim,
	truncate,
	wrap,
	className,
	...props
}: LinkProps) {
	return (
		<AriaLink
			{...props}
			className={values =>
				cn(
					linkVariants({ color, size, weight, underline, highContrast, trim, truncate, wrap }),
					typeof className === "function" ? className(values) : className,
				)}
		/>
	);
}
