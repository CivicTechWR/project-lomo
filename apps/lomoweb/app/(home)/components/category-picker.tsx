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
	const activeImage = images[activeKey] ?? images[defaultKey];

	// Peek slightly past the image edge into the column gap — not far enough to hit the text.
	const badgePositionClass
		= badgePosition === "left"
			? "lg:left-0 lg:-translate-x-1/4 lg:items-start"
			: "lg:right-0 lg:translate-x-1/4 lg:items-end";

	return (
		<div className="flex flex-col lg:relative lg:w-full lg:aspect-4/3">
			<div className="relative w-full aspect-4/3">
				<CategoryImageCard
					src={activeImage.src}
					alt={activeImage.alt}
					sizes={sizes}
				/>
			</div>
			<div
				className={`flex flex-wrap gap-2 mt-3 justify-center z-10 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:flex-col lg:gap-2.5 lg:mt-0 ${badgePositionClass}`}
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
