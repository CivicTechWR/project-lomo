"use client";

import type {
	LinkProps as AriaLinkProps,
	ButtonProps as AriaProps,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import {
	Button as AriaButton,
	Link as AriaLink,
	composeRenderProps,
} from "react-aria-components";
import { buttonVariants } from "./button.variants.ts";

type ButtonBaseProps = AriaProps & AriaLinkProps & Omit<VariantProps<typeof buttonVariants>, "icon">;

export type ButtonProps = ButtonBaseProps
	& ({ icon?: false } | { "icon": true; "aria-label": string });

export function Button({
	variant,
	size,
	color,
	border,
	borderColor,
	textColor,
	icon,
	className,
	...props
}: ButtonProps) {
	const renderStyles = (cls: string) =>
		buttonVariants({
			variant,
			size,
			color,
			border,
			borderColor,
			textColor,
			icon,
			class: cls,
		});

	if (props.href) {
		return (
			<AriaLink
				{...props}
				className={composeRenderProps(className as any, renderStyles)}
			/>
		);
	}

	return (
		<AriaButton
			{...props}
			className={composeRenderProps(className as any, renderStyles)}
		/>
	);
}
