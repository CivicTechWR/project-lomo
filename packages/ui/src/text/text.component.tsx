import type { TextProps as AriaTextProps } from "react-aria-components";
import type {
	TextColor,
	TextElementType,
	TextSize,
	TextTrim,
	TextWeight,
} from "./text.variants.ts";
import { Text as AriaText } from "react-aria-components";
import { textVariants } from "./text.variants.ts";

export interface TextProps extends Omit<AriaTextProps, "elementType"> {
	elementType?: TextElementType;
	size?: TextSize;
	weight?: TextWeight;
	color?: TextColor;
	highContrast?: boolean;
	trim?: TextTrim;
}

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
