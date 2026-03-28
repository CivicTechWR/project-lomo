import type { TextProps as AriaTextProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import type { TextElementType } from "./text.variants.ts";
import { Text as AriaText } from "react-aria-components";
import { textVariants } from "./text.variants.ts";

export type TextProps = Omit<AriaTextProps, "elementType"> & VariantProps<typeof textVariants> & {
	elementType?: TextElementType;
};

export function Text({
	size,
	weight,
	color,
	highContrast,
	trim,
	className,
	...props
}: TextProps) {
	return (
		<AriaText
			{...props}
			className={textVariants({
				size,
				weight,
				color,
				highContrast,
				trim,
				class: className,
			})}
		/>
	);
}
