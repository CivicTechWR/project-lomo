import type { LinkProps as AriaLinkProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { Link as AriaLink, composeRenderProps } from "react-aria-components";
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
			className={composeRenderProps(className, cls =>
				linkVariants({ color, size, weight, underline, highContrast, trim, truncate, wrap, class: cls }))}
		/>
	);
}
