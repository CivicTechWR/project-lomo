import type { HeadingProps as AriaHeadingProps } from "react-aria-components";
import type {
	HeadingColor,
	HeadingLevel,
	HeadingSize,
	HeadingTrim,
	HeadingWeight,
} from "./heading.variants.ts";
import { Heading as AriaHeading } from "react-aria-components";
import { headingVariants } from "./heading.variants.ts";

// Level → default visual size (inverted: h1=largest, h6=smallest)
const levelToSize: Record<HeadingLevel, HeadingSize> = {
	1: 9,
	2: 8,
	3: 7,
	4: 6,
	5: 5,
	6: 4,
};

export interface HeadingProps extends Omit<AriaHeadingProps, "level"> {
	level?: HeadingLevel;
	size?: HeadingSize;
	weight?: HeadingWeight;
	color?: HeadingColor;
	highContrast?: boolean;
	trim?: HeadingTrim;
}

export function Heading({
	level = 3,
	size,
	weight,
	color,
	highContrast,
	trim,
	className,
	...props
}: HeadingProps) {
	const resolvedSize = size ?? levelToSize[level];

	return (
		<AriaHeading
			{...props}
			level={level}
			className={headingVariants({
				size: resolvedSize,
				weight,
				color,
				highContrast,
				trim,
				class: className,
			})}
		/>
	);
}
