"use client";

import type { ReactNode } from "react";
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { Button as AriaButton } from "react-aria-components";
import { cn } from "../utils/cn.ts";
import { selectionCardVariants } from "./selection-card.variants.ts";

export interface SelectionCardProps
	extends Omit<AriaButtonProps, "children">,
	VariantProps<typeof selectionCardVariants> {
	title: ReactNode;
	description?: ReactNode;
	leading?: ReactNode;
	selected?: boolean;
	disabled?: boolean;
}

export function SelectionCard({
	title,
	description,
	leading,
	selected = false,
	disabled = false,
	className,
	isDisabled,
	...props
}: SelectionCardProps) {
	const effectiveDisabled = disabled || isDisabled || false;

	return (
		<AriaButton
			{...props}
			isDisabled={effectiveDisabled}
			className={values =>
				cn(
					selectionCardVariants({
						selected,
						disabled: effectiveDisabled,
					}),
					typeof className === "function" ? className(values) : className,
				)}
		>
			<div className="flex items-start gap-3">
				{leading ?? (
					<span
						className="mt-0.5 size-10 shrink-0 rounded-full bg-gray-4"
						aria-hidden
					/>
				)}
				<div className="min-w-0 flex-1">
					<div className="text-[length:var(--text-2)] font-semibold text-gray-12">
						{title}
					</div>
					{description
						? (
								<div className="mt-1 text-[length:var(--text-1)] leading-[var(--text-1--line-height)] text-gray-11">
									{description}
								</div>
							)
						: null}
				</div>
			</div>
		</AriaButton>
	);
}
