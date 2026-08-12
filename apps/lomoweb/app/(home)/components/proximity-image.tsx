"use client";

import type { ComponentProps } from "react";

import Image from "next/image";

import { useProximityReveal } from "./use-proximity-reveal";

export interface ProximityImageProps
	extends Omit<ComponentProps<typeof Image>, "style"> {
	/** Max scale factor at full reveal. Default: 1.05 */
	maxScale?: number;
	/** Proximity radius in pixels (desktop). Default: 300 */
	radius?: number;
}

/**
 * A Next.js Image that starts grayscale + slightly scaled down,
 * and gradually reveals to full colour + enlarged based on cursor proximity
 * (desktop) or scroll into view (mobile).
 *
 * Wrap this in a container with `overflow-hidden` to prevent layout shift
 * from the scale transform.
 */
export function ProximityImage({
	maxScale = 1.05,
	radius = 300,
	className = "",
	...imageProps
}: ProximityImageProps) {
	const { ref, progress } = useProximityReveal(radius);

	// grayscale: 100% at progress=0, 0% at progress=1
	const grayscale = 1 - progress;
	// scale: 1 at progress=0, maxScale at progress=1
	const scale = 1 + progress * (maxScale - 1);

	return (
		<div ref={ref} className="relative w-full h-full">
			<Image
				{...imageProps}
				className={`object-cover object-center transition-[filter,transform] duration-300 ease-out ${className}`}
				style={{
					filter: `grayscale(${grayscale})`,
					transform: `scale(${scale})`,
				}}
			/>
		</div>
	);
}
