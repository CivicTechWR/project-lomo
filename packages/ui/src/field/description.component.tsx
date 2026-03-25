import type { TextProps as AriaTextProps } from "react-aria-components";
import { Text as AriaText } from "react-aria-components";
import { cn } from "../utils/cn.ts";
import { fieldSmallSizes } from "../variants/index.ts";
import { useFieldContext } from "./field.context.ts";

export interface DescriptionProps extends Omit<AriaTextProps, "slot"> {}

export function Description({ className, ...props }: DescriptionProps) {
	const { size } = useFieldContext();
	return (
		<AriaText
			{...props}
			slot="description"
			className={cn(
				"text-gray-10",
				fieldSmallSizes[size],
				className,
			)}
		/>
	);
}
