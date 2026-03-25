import type { InputProps as AriaInputProps } from "react-aria-components";
import { Input as AriaInput, composeRenderProps } from "react-aria-components";
import { cn } from "../utils/cn.ts";

export interface InputProps extends AriaInputProps {}

export function Input({ className, ...props }: InputProps) {
	return (
		<AriaInput
			{...props}
			className={composeRenderProps(className, cls =>
				cn(
					"flex-1 min-w-0 bg-transparent outline-none",
					"placeholder:text-gray-10",
					"text-[inherit] leading-[inherit]",
					"disabled:cursor-not-allowed",
					cls,
				))}
		/>
	);
}
