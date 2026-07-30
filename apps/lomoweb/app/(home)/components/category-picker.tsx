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
			? "left-0 -translate-x-1/4 sm:-translate-x-1/2 items-end"
			: "right-0 translate-x-1/4 sm:translate-x-1/2 items-start";

	return (
		<div className="relative w-full aspect-4/3">
			<CategoryImageCard
				src={activeImage.src}
				alt={activeImage.alt}
				sizes={sizes}
			/>
			<div
				className={`absolute top-1/2 -translate-y-1/2 ${badgePositionClass} flex flex-col gap-2.5 z-10`}
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
