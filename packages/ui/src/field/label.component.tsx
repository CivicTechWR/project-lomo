import type { LabelProps as AriaLabelProps } from "react-aria-components";
import { Label as AriaLabel } from "react-aria-components";
import { cn } from "../utils/cn.ts";
import { fieldLabelSizes } from "../variants/index.ts";
import { useFieldContext } from "./field.context.ts";

export interface LabelProps extends AriaLabelProps {}

export function Label({ className, ...props }: LabelProps) {
	const { size } = useFieldContext();
	return (
		<AriaLabel
			{...props}
			className={cn(
				"font-medium text-gray-12",
				fieldLabelSizes[size],
				className,
			)}
		/>
	);
}
