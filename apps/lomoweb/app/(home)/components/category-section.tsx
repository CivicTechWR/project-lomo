import type { ReactNode } from "react";
import type { CategoryItem } from "./category-badge-selector";

import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";

import { CategoryPicker } from "./category-picker";
import { sectionLabel, sectionPadding } from "./styles";

export interface CategorySectionProps {
	/** Accessible label for the section landmark */
	ariaLabel: string;
	/** Column layout: "image-first" puts the picker on the left, "text-first" on the left */
	layout: "image-first" | "text-first";
	/** Eyebrow label above the heading */
	label: string;
	/** Main heading text */
	heading: string;
	/** Italic subtitle below the heading */
	subtitle: string;
	/** Body text paragraph */
	body: string;
	/** Badge/tag elements rendered below the body */
	badges: ReactNode;
	/** CategoryPicker data */
	categories: CategoryItem[];
	images: Record<string, { src: string; alt: string }>;
	defaultKey: string;
}

export function CategorySection({
	ariaLabel,
	layout,
	label,
	heading,
	subtitle,
	body,
	badges,
	categories,
	images,
	defaultKey,
}: CategorySectionProps) {
	const badgePosition = layout === "image-first" ? "right" : "left";

	const textColumn = (
		<div className="flex flex-col gap-6 lg:col-span-7">
			<span className={sectionLabel}>
				{label}
			</span>

			<Heading level={2} size={8} className="font-display font-black leading-tight tracking-tight text-black">
				{heading}
			</Heading>

			<Heading level={3} size={5} weight="bold" className="text-terracotta-11 font-display italic leading-relaxed">
				{subtitle}
			</Heading>

			<Text size={3} className="text-black/70 font-medium leading-relaxed max-w-xl">
				{body}
			</Text>

			{badges}
		</div>
	);

	const imageColumn = (
		<div className={`lg:col-span-5 flex flex-col gap-6${layout === "image-first" ? " order-last sm:order-first" : ""}`}>
			<CategoryPicker
				categories={categories}
				images={images}
				defaultKey={defaultKey}
				badgePosition={badgePosition}
				sizes="(max-width: 768px) 100vw, 450px"
			/>
		</div>
	);

	return (
		<section aria-label={ariaLabel} className="w-full">
			<div className={`max-w-300 mx-auto ${sectionPadding}`}>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{layout === "image-first"
						? (
								<>
									{imageColumn}
									{textColumn}
								</>
							)
						: (
								<>
									{textColumn}
									{imageColumn}
								</>
							)}
				</div>
			</div>
		</section>
	);
}
