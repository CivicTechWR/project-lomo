import { Badge } from "@repo/ui/badge";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";

import { CategoryPicker } from "./category-picker";
import { sectionLabel } from "./styles";

const categories = [
	{ key: "supplies", label: "Dropping Off Supplies", color: "sage" as const },
	{ key: "microgrant", label: "Funding A Microgrant", color: "yellow" as const },
	{ key: "produce", label: "Sharing Extra Garden Produce", color: "terracotta" as const },
];

const images: Record<string, { src: string; alt: string }> = {
	supplies: { src: "/lomo-bg.jpg", alt: "Community member dropping off supplies" },
	microgrant: { src: "/lomo-bg.jpg", alt: "Funding a microgrant for a neighbour" },
	produce: { src: "/lomo-bg.jpg", alt: "Sharing garden produce with the community" },
};

export function ShareSection() {
	return (
		<section aria-label="Share what you can" className="w-full">
			<div className="max-w-300 mx-auto px-4 md:px-8 py-16 md:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{/* Left column: text + content */}
					<div className="flex flex-col gap-6 lg:col-span-7">
						<span className={sectionLabel}>
							🌱 Solidarity, Not Charity
						</span>

						<Heading level={2} size={8} className="font-display font-black leading-tight tracking-tight text-black">
							Share What You Can
						</Heading>

						<Heading level={3} size={5} weight="bold" className="text-terracotta-11 font-display italic leading-relaxed">
							Stronger together, on our own terms
						</Heading>

						<Text size={3} className="text-black/70 font-medium leading-relaxed max-w-xl">
							Mutual aid is about solidarity, not charity or transaction. There is never any obligation, pressure, or timeline to &apos;pay it forward&apos;. When you have the capacity, energy, or extra resources to share, you can easily respond to open requests from neighbours. Every act of care helps build a safe, reliable safety net for all of us.
						</Text>

						<div className="flex flex-wrap gap-2 pt-2">
							<Badge variant="soft" color="terracotta" size={2} className="px-3.5 py-1.5 rounded-full border-2 border-black font-display font-bold text-xs bg-white text-black select-none">
								🌟 Voluntary & Direct
							</Badge>
							<Badge variant="soft" color="terracotta" size={2} className="px-3.5 py-1.5 rounded-full border-2 border-black font-display font-bold text-xs bg-white text-black select-none">
								🤝 Respectful Privacy
							</Badge>
						</div>
					</div>

					{/* Right column: Image card with badge overlap */}
					<div className="lg:col-span-5 flex flex-col gap-6">
						<CategoryPicker
							categories={categories}
							images={images}
							defaultKey="supplies"
							badgePosition="left"
							sizes="(max-width: 768px) 100vw, 450px"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
