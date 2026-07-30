"use client";

import { Badge } from "@repo/ui/badge";

export interface CategoryItem {
	key: string;
	label: string;
	color: "terracotta" | "yellow" | "sage" | "red";
}

export interface CategoryBadgeSelectorProps {
	categories: CategoryItem[];
	activeKey: string;
	onChange: (key: string) => void;
}

export function CategoryBadgeSelector({
	categories,
	activeKey,
	onChange,
}: CategoryBadgeSelectorProps) {
	return (
		<>
			{categories.map(cat => (
				<button
					key={cat.key}
					type="button"
					aria-pressed={activeKey === cat.key}
					onClick={() => onChange(cat.key)}
					className="appearance-none bg-transparent border-none p-2.5 sm:p-0 min-h-11 min-w-11 sm:min-h-0 sm:min-w-0 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black rounded-full"
				>
					<Badge
						variant="solid"
						color={cat.color}
						size={1}
						className={`border-2 border-black font-display font-black text-xs rounded-full py-1.5 px-3 select-none ${
							activeKey === cat.key ? "ring-2 ring-offset-2 ring-black" : ""
						}`}
					>
						{cat.label}
					</Badge>
				</button>
			))}
		</>
	);
}
