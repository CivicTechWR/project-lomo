import type { CategoryItem } from "./category-badge-selector";

import { Badge } from "@repo/ui/badge";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";

import { CategoryPicker } from "./category-picker";
import { sectionLabel } from "./styles";

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
		<section aria-label="Find what you need" className="w-full">
			<div className="max-w-300 mx-auto px-4 md:px-8 py-16 md:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{/* Left column: Image card with badge overlap */}
					<div className="lg:col-span-5 flex flex-col gap-6 order-last lg:order-first">
						<CategoryPicker
							categories={categories}
							images={images}
							defaultKey="grocery"
							badgePosition="right"
							sizes="(max-width: 768px) 100vw, 450px"
						/>
					</div>

					{/* Right column: text + content */}
					<div className="flex flex-col gap-6 lg:col-span-7">
						<span className={sectionLabel}>
							🤝 Mutual Aid In Action
						</span>

						<Heading level={2} size={8} className="font-display font-black leading-tight tracking-tight text-black">
							Find What You Need
						</Heading>

						<Heading level={3} size={5} weight="bold" className="text-terracotta-11 font-display italic leading-relaxed">
							You deserve to have your needs met
						</Heading>

						<Text size={3} className="text-black/70 font-medium leading-relaxed max-w-xl">
							Getting support is a normal, healthy part of being in community. Whether you are looking for fresh food, emergency funds, or companion supports, the circle is here to respect your privacy and choices. You are completely in control of what you request and how much you choose to share.
						</Text>

						<div className="flex flex-wrap gap-2 pt-2">
							<Badge variant="soft" color="sage" size={2} className="px-3.5 py-1.5 rounded-full border-2 border-black font-display font-bold text-xs bg-white text-black select-none">
								🛡️ Private & Secure
							</Badge>
							<Badge variant="soft" color="sage" size={2} className="px-3.5 py-1.5 rounded-full border-2 border-black font-display font-bold text-xs bg-white text-black select-none">
								🤝 Respectful Connections
							</Badge>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
