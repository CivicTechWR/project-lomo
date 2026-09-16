import type { CategoryItem } from "./category-badge-selector";

import { Badge } from "@repo/ui/badge";

import { FIND_PHOTOS } from "@/lib/imagery";
import { CategorySection } from "./category-section";
import { infoBadge } from "./styles";

const categories: CategoryItem[] = [
	{ key: "grocery", label: "Grocery Sharing", color: "yellow" },
	{ key: "checkins", label: "Peer Check-Ins", color: "terracotta" },
	{ key: "crisis", label: "Crisis Funds", color: "red" },
	{ key: "meals", label: "Warm Meals", color: "sage" },
];

export function FindSection() {
	return (
		<CategorySection
			ariaLabel="Find what you need"
			layout="image-first"
			label="Mutual Aid In Action"
			heading="Find What You Need"
			subtitle="Support is here when you need it"
			body="Ask for fresh food, emergency funds, or companion supports. You control what you request and how much you share."
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
			images={FIND_PHOTOS}
			defaultKey="grocery"
		/>
	);
}
