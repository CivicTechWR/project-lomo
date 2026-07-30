import { Badge } from "@repo/ui/badge";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import Image from "next/image";

export function ShareSection() {
	return (
		<section aria-label="Share what you can" className="w-full bg-[#f5efe4]">
			<div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{/* Left column: text + content */}
					<div className="flex flex-col gap-6 lg:col-span-7">
						<span className="text-[#7a343b] font-display font-black text-sm tracking-widest uppercase select-none">
							🌱 Solidarity, Not Charity
						</span>

						<Heading level={2} size={8} className="font-display font-black leading-tight tracking-tight text-black">
							Share What You Can
						</Heading>

						<Heading level={3} size={5} weight="bold" className="text-[#7a343b] font-display italic leading-relaxed">
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

					{/* Right column: Highly refined single premium image card & categories below it */}
					<div className="lg:col-span-5 flex flex-col gap-6">
						{/* Premium Single Image Card with Bold Border and Offset Shadow */}
						<div className="relative w-full aspect-[4/3] rounded-[32px] border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
							<Image
								src="/lomo-bg.jpg"
								alt="Hands carrying boxes of supplies to share"
								fill
								sizes="(max-width: 768px) 100vw, 450px"
								className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
							/>
							{/* Subtle warm overlay */}
							<div className="absolute inset-0 bg-terracotta-9/5 mix-blend-multiply pointer-events-none" />
						</div>

						{/* Clean, premium row of categories as Badges */}
						<div className="flex flex-wrap gap-2.5 pt-2">
							<Badge
								variant="soft"
								color="sage"
								size={1}
								className="border-2 border-black font-display font-black text-xs text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-full py-1.5 px-3 select-none"
							>
								Dropping Off Supplies
							</Badge>
							<Badge
								variant="soft"
								color="yellow"
								size={1}
								className="border-2 border-black font-display font-black text-xs text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-full py-1.5 px-3 select-none"
							>
								Funding A Microgrant
							</Badge>
							<Badge
								variant="soft"
								color="terracotta"
								size={1}
								className="border-2 border-black font-display font-black text-xs text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-full py-1.5 px-3 select-none"
							>
								Sharing Extra Garden Produce
							</Badge>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
