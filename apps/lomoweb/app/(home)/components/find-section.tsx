import { Badge } from "@repo/ui/badge";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import Image from "next/image";

export function FindSection() {
	return (
		<section aria-label="Find what you need" className="w-full bg-[#f5efe4]">
			<div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{/* Left column: Image card with badge overlap */}
					<div className="lg:col-span-5 flex flex-col gap-6 order-last lg:order-first">
						{/* Image card wrapper — relative + overflow-visible for badge overlap */}
						<div className="relative w-full aspect-[4/3] mb-8">
							{/* Image container with border, radius, overflow-hidden */}
							<div className="relative w-full h-full rounded-[24px] border-2 border-black overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.10)] bg-white">
								<Image
									src="/lomo-bg.jpg"
									alt="Fresh local vegetables for community grocery sharing"
									fill
									sizes="(max-width: 768px) 100vw, 450px"
									className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
								/>
								{/* Subtle warm overlay */}
								<div className="absolute inset-0 bg-yellow-9/5 mix-blend-multiply pointer-events-none" />
							</div>

							{/* Badge container — absolute, overlapping bottom edge */}
							<div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 z-10 flex flex-wrap justify-center gap-2.5">
								<Badge
									variant="soft"
									color="yellow"
									size={1}
									className="border-2 border-black font-display font-black text-xs text-black rounded-full py-1.5 px-3 select-none"
								>
									Grocery Sharing
								</Badge>
								<Badge
									variant="soft"
									color="terracotta"
									size={1}
									className="border-2 border-black font-display font-black text-xs text-black rounded-full py-1.5 px-3 select-none"
								>
									Peer Check-Ins
								</Badge>
								<Badge
									variant="soft"
									color="red"
									size={1}
									className="border-2 border-black font-display font-black text-xs text-black rounded-full py-1.5 px-3 select-none"
								>
									Crisis Funds
								</Badge>
								<Badge
									variant="soft"
									color="sage"
									size={1}
									className="border-2 border-black font-display font-black text-xs text-black rounded-full py-1.5 px-3 select-none"
								>
									Warm Meals
								</Badge>
							</div>
						</div>
					</div>

					{/* Right column: text + content */}
					<div className="flex flex-col gap-6 lg:col-span-7">
						<span className="text-[#7a343b] font-display font-black text-sm tracking-widest uppercase select-none">
							🤝 Mutual Aid In Action
						</span>

						<Heading level={2} size={8} className="font-display font-black leading-tight tracking-tight text-black">
							Find What You Need
						</Heading>

						<Heading level={3} size={5} weight="bold" className="text-[#7a343b] font-display italic leading-relaxed">
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
