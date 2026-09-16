"use client";

import type { HTMLAttributes } from "react";
import { cn } from "../utils/cn.ts";
import {
	getSegmentColorClass,
	segmentedProgressVariants,
} from "./segmented-progress.variants.ts";

export interface SegmentedProgressProps extends HTMLAttributes<HTMLDivElement> {
	stepCount: number;
	filledCount: number;
	label?: string;
	size?: "sm" | "md";
	color?: "sage" | "terracotta" | "yellow";
}

export function SegmentedProgress({
	stepCount,
	filledCount,
	label = "Progress",
	size = "sm",
	color = "sage",
	className,
	"aria-label": ariaLabel,
	...props
}: SegmentedProgressProps) {
	const n = Math.min(stepCount, Math.max(0, filledCount));
	const { root, segment } = segmentedProgressVariants({ size, color });

	return (
		<div
			role="progressbar"
			aria-label={ariaLabel || label}
			aria-valuemin={0}
			aria-valuemax={stepCount}
			aria-valuenow={n}
			aria-valuetext={`Step ${n} of ${stepCount}`}
			className={cn(root(), className)}
			{...props}
		>
			{Array.from({ length: stepCount }, (_, i) => {
				const isFilled = i < n;
				return (
					<div
						key={i}
						aria-hidden
						className={cn(
							segment(),
							getSegmentColorClass(color, size, isFilled),
						)}
					/>
				);
			})}
		</div>
	);
}
