import type { CategoryItem } from "./category-badge-selector";

import { Badge } from "@repo/ui/badge";

import { CategorySection } from "./category-section";
import { infoBadge } from "./styles";

const categories: CategoryItem[] = [
	{ key: "grocery", label: "Grocery Sharing", color: "yellow" },
	{ key: "checkins", label: "Peer Check-Ins", color: "terracotta" },
	{ key: "crisis", label: "Crisis Funds", color: "red" },
	{ key: "meals", label: "Warm Meals", color: "sage" },
];

const images: Record<string, { src: string; alt: string }> = {
	grocery: { src: "/lomo-bg.jpg", alt: "Grocery sharing in the community" },
	checkins: { src: "/lomo-bg.jpg", alt: "Neighbors checking in on each other" },
	crisis: { src: "/lomo-bg.jpg", alt: "Community crisis support fund" },
	meals: { src: "/lomo-bg.jpg", alt: "Warm meals shared between neighbors" },
};

export function FindSection() {
	return (
		<CategorySection
			ariaLabel="Find what you need"
			layout="image-first"
			label="🤝 Mutual Aid In Action"
			heading="Find What You Need"
			subtitle="You deserve to have your needs met"
			body="Getting support is a normal, healthy part of being in community. Whether you are looking for fresh food, emergency funds, or companion supports, the circle is here to respect your privacy and choices. You are completely in control of what you request and how much you choose to share."
			badges={(
				<div className="flex flex-wrap gap-2 pt-2">
					<Badge variant="soft" color="sage" size={2} className={infoBadge}>
						🛡️ Private & Secure
					</Badge>
					<Badge variant="soft" color="sage" size={2} className={infoBadge}>
						🤝 Respectful Connections
					</Badge>
				</div>
			)}
			categories={categories}
			images={images}
			defaultKey="grocery"
		/>
	);
}
