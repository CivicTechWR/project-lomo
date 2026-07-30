"use client";

import { Badge } from "@repo/ui/badge";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import Image from "next/image";
import { useState } from "react";

type CategoryKey = "community" | "food" | "support";

const categoryImages: Record<CategoryKey, string> = {
	community: "/lomo-bg.jpg",
	food: "/lomo-bg.jpg",
	support: "/lomo-bg.jpg",
};

export function JoinSection() {
	const [activeCategory, setActiveCategory] = useState<CategoryKey>("community");

	return (
		<section aria-label="Join the Circle" className="w-full bg-[#f5efe4]">
			<div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
				<div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
					<Heading
						level={2}
						size={8}
						className="font-display font-black leading-tight tracking-tight text-black"
					>
						Join The Circle
					</Heading>

					<Text size={2} className="text-black/60 font-display font-bold italic tracking-wide">
						Free to use. No social media login required. Your data belongs to you.
					</Text>

					{/* Image card wrapper — relative + overflow-visible for badge overlap */}
					<div className="relative w-full max-w-[650px] aspect-[2.2/1] mt-8 mb-8">
						{/* Image container — uses rounded-full for oval/pill shape */}
						<div className="relative w-full h-full rounded-full border-2 border-black overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.10)] bg-white">
							<Image
								key={activeCategory}
								src={categoryImages[activeCategory]}
								alt="Category image"
								fill
								sizes="(max-width: 768px) 100vw, 650px"
								className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
							/>
							{/* Subtle warm overlay */}
							<div className="absolute inset-0 bg-terracotta-9/5 mix-blend-multiply pointer-events-none" />
						</div>

						{/* Badge container — absolute, overlapping bottom edge */}
						<div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 z-10 flex flex-wrap justify-center gap-2.5">
							<Badge
								as="button"
								onClick={() => setActiveCategory("community")}
								variant="soft"
								color="sage"
								size={1}
								className={`border-2 border-black font-display font-black text-xs text-black rounded-full py-1.5 px-3 select-none cursor-pointer transition-all ${
									activeCategory === "community" ? "ring-2 ring-offset-2 ring-black" : ""
								}`}
							>
								Community Gatherings
							</Badge>
							<Badge
								as="button"
								onClick={() => setActiveCategory("food")}
								variant="soft"
								color="yellow"
								size={1}
								className={`border-2 border-black font-display font-black text-xs text-black rounded-full py-1.5 px-3 select-none cursor-pointer transition-all ${
									activeCategory === "food" ? "ring-2 ring-offset-2 ring-black" : ""
								}`}
							>
								Food Sharing
							</Badge>
							<Badge
								as="button"
								onClick={() => setActiveCategory("support")}
								variant="soft"
								color="terracotta"
								size={1}
								className={`border-2 border-black font-display font-black text-xs text-black rounded-full py-1.5 px-3 select-none cursor-pointer transition-all ${
									activeCategory === "support" ? "ring-2 ring-offset-2 ring-black" : ""
								}`}
							>
								Neighbour Support
							</Badge>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
