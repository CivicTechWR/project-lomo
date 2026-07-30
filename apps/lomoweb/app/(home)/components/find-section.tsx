import { Badge } from "@repo/ui/badge";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import Image from "next/image";

export function FindSection() {
	return (
		<section aria-label="Find what you need" className="w-full bg-[#f5efe4]">
			<div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{/* Left column: Highly refined single premium image card & categories below it */}
					<div className="lg:col-span-5 flex flex-col gap-6 order-last lg:order-first">
						{/* Premium Single Image Card with Bold Border and Offset Shadow */}
						<div className="relative w-full aspect-[4/3] rounded-[32px] border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
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

						{/* Clean, premium row of categories as Badges */}
						<div className="flex flex-wrap gap-2.5 pt-2">
							<Badge
								variant="soft"
								color="yellow"
								size={1}
								className="border-2 border-black font-display font-black text-xs text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-full py-1.5 px-3 select-none"
							>
								Grocery Sharing
							</Badge>
							<Badge
								variant="soft"
								color="terracotta"
								size={1}
								className="border-2 border-black font-display font-black text-xs text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-full py-1.5 px-3 select-none"
							>
								Peer Check-Ins
							</Badge>
							<Badge
								variant="soft"
								color="red"
								size={1}
								className="border-2 border-black font-display font-black text-xs text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-full py-1.5 px-3 select-none"
							>
								Crisis Funds
							</Badge>
							<Badge
								variant="soft"
								color="sage"
								size={1}
								className="border-2 border-black font-display font-black text-xs text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-full py-1.5 px-3 select-none"
							>
								Warm Meals
							</Badge>
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
