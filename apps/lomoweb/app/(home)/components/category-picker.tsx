"use client";

import type { CategoryItem } from "./category-badge-selector";

import { useState } from "react";
import {
	CategoryBadgeSelector,
} from "./category-badge-selector";
import { CategoryImageCard } from "./category-image-card";

export interface CategoryPickerProps {
	categories: CategoryItem[];
	images: Record<string, { src: string; alt: string }>;
	defaultKey: string;
	/** Badge position relative to image: "left" or "right" */
	badgePosition: "left" | "right";
	sizes: string;
}

export function CategoryPicker({
	categories,
	images,
	defaultKey,
	badgePosition,
	sizes,
}: CategoryPickerProps) {
	const [activeKey, setActiveKey] = useState(defaultKey);
	const activeImage = images[activeKey];

	const badgePositionClass
		= badgePosition === "left"
			? "sm:left-0 sm:-translate-x-1/4 md:-translate-x-1/2 sm:items-end"
			: "sm:right-0 sm:translate-x-1/4 md:translate-x-1/2 sm:items-start";

	return (
		<div className="flex flex-col sm:relative sm:w-full sm:aspect-4/3">
			<div className="relative w-full aspect-4/3">
				<CategoryImageCard
					src={activeImage.src}
					alt={activeImage.alt}
					sizes={sizes}
				/>
			</div>
			<div
				className={`flex flex-wrap gap-2 mt-3 justify-center z-10 sm:absolute sm:top-1/2 sm:-translate-y-1/2 sm:flex-col sm:gap-2.5 sm:mt-0 ${badgePositionClass}`}
			>
				<CategoryBadgeSelector
					categories={categories}
					activeKey={activeKey}
					onChange={setActiveKey}
				/>
			</div>
		</div>
	);
}
