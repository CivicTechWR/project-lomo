import type { LinkProps as AriaLinkProps } from "react-aria-components";
import type { LinkColor, LinkSize, LinkTrim, LinkUnderline, LinkWeight } from "./link.variants.ts";
import { Link as AriaLink, composeRenderProps } from "react-aria-components";
import { linkVariants } from "./link.variants.ts";

export interface LinkProps extends AriaLinkProps {
	color?: LinkColor;
	size?: LinkSize;
	weight?: LinkWeight;
	underline?: LinkUnderline;
	highContrast?: boolean;
	trim?: LinkTrim;
	truncate?: boolean;
	wrap?: "wrap" | "nowrap" | "pretty" | "balance";
}

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
			className={composeRenderProps(className, cls =>
				linkVariants({ color, size, weight, underline, highContrast, trim, truncate, wrap, class: cls }))}
		/>
	);
}
