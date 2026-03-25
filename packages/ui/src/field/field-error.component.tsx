import type { FieldErrorProps as AriaFieldErrorProps } from "react-aria-components";
import { FieldError as AriaFieldError, composeRenderProps } from "react-aria-components";
import { cn } from "../utils/cn.ts";
import { fieldSmallSizes } from "../variants/index.ts";
import { useFieldContext } from "./field.context.ts";

export interface FieldErrorProps extends AriaFieldErrorProps {}

export function FieldError({ className, children, ...props }: FieldErrorProps) {
	const { size } = useFieldContext();
	if (children != null) {
		return (
			<AriaFieldError
				{...props}
				className={composeRenderProps(className, cls =>
					cn("text-red-11", fieldSmallSizes[size], cls))}
			>
				{children}
			</AriaFieldError>
		);
	}
	return (
		<AriaFieldError
			{...props}
			className={composeRenderProps(className, cls =>
				cn("text-red-11", fieldSmallSizes[size], cls))}
		>
			{({ validationErrors }) => {
				if (validationErrors.length <= 1) {
					return validationErrors[0] ?? null;
				}
				return (
					<ul className="flex flex-col gap-0.5">
						{validationErrors.map(error => (
							<li key={error}>{error}</li>
						))}
					</ul>
				);
			}}
		</AriaFieldError>
	);
}
