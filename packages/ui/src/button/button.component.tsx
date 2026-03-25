import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import type { ButtonColor, ButtonSize, ButtonVariant } from "./button.variants.ts";
import { Button as AriaButton, composeRenderProps } from "react-aria-components";
import { buttonVariants } from "./button.variants.ts";

interface ButtonBaseProps extends AriaButtonProps {
	variant?: ButtonVariant;
	size?: ButtonSize;
	color?: ButtonColor;
}

export type ButtonProps = ButtonBaseProps & (
	| { icon?: false }
	| { "icon": true; "aria-label": string }
);

export function Button({ variant, size, color, icon, className, ...props }: ButtonProps) {
	return (
		<AriaButton
			{...props}
			className={composeRenderProps(className, cls =>
				buttonVariants({ variant, size, color, icon, class: cls }))}
		/>
	);
}
