"use client";

import type {
	LinkProps as AriaLinkProps,
	ButtonProps as AriaProps,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { Button as AriaButton, Link as AriaLink } from "react-aria-components";
import { cn } from "../utils/cn.ts";
import { buttonVariants } from "./button.variants.ts";

type ButtonBaseProps = AriaProps & AriaLinkProps & Omit<VariantProps<typeof buttonVariants>, "icon">;

export type ButtonProps = ButtonBaseProps
	& ({ icon?: false } | { "icon": true; "aria-label": string });

export function Button({
	variant,
	size,
	color,
	border = "small",
	borderColor,
	textColor,
	icon,
	className,
	...props
}: ButtonProps) {
	const renderStyles = buttonVariants({
		variant,
		size,
		color,
		border,
		borderColor,
		textColor,
		icon,
	});

	if (props.href) {
		return (
			<AriaLink
				{...props}
				className={values =>
					cn(
						renderStyles,
						typeof className === "function" ? className(values) : className,
					)}
			/>
		);
	}

	return (
		<AriaButton
			{...props}
			className={values =>
				cn(
					renderStyles,
					typeof className === "function" ? className(values) : className,
				)}
		/>
	);
}
