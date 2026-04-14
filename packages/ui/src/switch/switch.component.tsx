"use client";

import type { SwitchProps as AriaSwitchProps } from "react-aria-components";
import type { ReactNode } from "react";
import { Switch as AriaSwitch, composeRenderProps } from "react-aria-components";
import { cn } from "../utils/cn.ts";

export type SwitchProps = AriaSwitchProps & {
	children?: ReactNode;
};

/**
 * Binary toggle (React Aria Switch). Default layout: label on the left, track on the right.
 * Pass `aria-label` when there is no visible `children`.
 */
export function Switch({ className, children, ...props }: SwitchProps) {
	return (
		<AriaSwitch
			{...props}
			className={composeRenderProps(className, cls =>
				cn(
					"group flex w-full min-w-0 cursor-default items-center justify-between gap-4 rounded-[var(--radius-2)] py-1 outline-none",
					"focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-1",
					cls,
				))}
		>
			{children != null && children !== false ? (
				<span className="min-w-0 flex-1 text-[length:var(--text-3)] leading-snug text-gray-12">
					{children}
				</span>
			) : null}
			<div
				aria-hidden
				className="relative h-7 w-[2.875rem] shrink-0 rounded-[max(var(--radius-2),var(--radius-full))] bg-gray-5 transition-colors group-data-[selected]:bg-gray-9"
			>
				<div
					className="absolute top-[3px] left-[3px] size-[22px] rounded-[max(var(--radius-1),var(--radius-full))] bg-gray-1 shadow transition-transform duration-200 group-data-[selected]:translate-x-[1.25rem]"
				/>
			</div>
		</AriaSwitch>
	);
}
