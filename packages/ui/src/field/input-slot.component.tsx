import { cn } from "../utils/cn.ts";
import { fieldSlotSizes } from "../variants/index.ts";
import { useFieldContext } from "./field.context.ts";

export interface InputSlotProps extends React.ComponentPropsWithoutRef<"div"> {
	side?: "start" | "end";
}

export function InputSlot({
	side = "start",
	className,
	...props
}: InputSlotProps) {
	const { size } = useFieldContext();
	return (
		<div
			{...props}
			data-side={side}
			className={cn(
				"flex shrink-0 items-center text-gray-10",
				fieldSlotSizes[size],
				side === "end" && "order-last",
				className,
			)}
		/>
	);
}
