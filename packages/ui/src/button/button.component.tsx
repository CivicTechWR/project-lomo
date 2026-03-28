import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { Button as AriaButton, composeRenderProps } from "react-aria-components";
import { buttonVariants } from "./button.variants.ts";

type ButtonBaseProps = AriaButtonProps & Omit<VariantProps<typeof buttonVariants>, "icon">;

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
