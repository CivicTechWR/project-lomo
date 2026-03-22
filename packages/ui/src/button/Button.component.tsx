import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import type { ButtonColor, ButtonSize, ButtonVariant } from "./button.variants.ts";
import { Button as AriaButton, composeRenderProps } from "react-aria-components";
import { buttonVariants } from "./button.variants.ts";

export interface ButtonProps extends AriaButtonProps {
	variant?: ButtonVariant;
	size?: ButtonSize;
	color?: ButtonColor;
}

export function Button({ variant, size, color, className, ...props }: ButtonProps) {
	return (
		<AriaButton
			{...props}
			className={composeRenderProps(className, cls =>
				buttonVariants({ variant, size, color, class: cls }))}
		/>
	);
}
