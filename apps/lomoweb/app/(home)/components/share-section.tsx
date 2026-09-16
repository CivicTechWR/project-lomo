import { Badge } from "@repo/ui/badge";

import { SHARE_PHOTOS } from "@/lib/imagery";
import { CategorySection } from "./category-section";
import { infoBadge } from "./styles";

const categories = [
	{ key: "supplies", label: "Dropping Off Supplies", color: "sage" as const },
	{ key: "microgrant", label: "Funding A Microgrant", color: "yellow" as const },
	{ key: "produce", label: "Sharing Extra Garden Produce", color: "terracotta" as const },
];

export function ShareSection() {
	return (
		<CategorySection
			ariaLabel="Share what you can"
			layout="text-first"
			label="Solidarity, Not Charity"
			heading="Share What You Can"
			subtitle="Offer support in your own way, on your own time"
			body="When you have capacity or extra resources, respond to open requests from neighbours. No obligation, no timeline — just community care when it works for you."
			badges={(
				<div className="flex flex-wrap gap-2 pt-2">
					<Badge variant="soft" color="terracotta" size={2} className={infoBadge}>
						🌟 Voluntary & Direct
					</Badge>
					<Badge variant="soft" color="terracotta" size={2} className={infoBadge}>
						🤝 Respectful Privacy
					</Badge>
				</div>
			)}
			categories={categories}
			images={SHARE_PHOTOS}
			defaultKey="supplies"
		/>
	);
}
