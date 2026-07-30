import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import Image from "next/image";

export function JoinSection() {
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

					<div className="my-2">
						<Button
							href="/signup"
							variant="solid"
							color="yellow"
							size={3}
							className="bg-[#f2c010] hover:bg-[#d9ab0d] text-black border-2 border-black rounded-full px-10 py-4 font-display font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-100"
						>
							Launch LoMo
						</Button>
					</div>

					<Text size={2} className="text-black/60 font-display font-bold italic tracking-wide">
						Free to use. No social media login required. Your data belongs to you.
					</Text>

					{/* Beautiful large horizontal oval image showing community support hands */}
					<div className="relative w-full max-w-[650px] aspect-[2.2/1] mt-8 rounded-[100px] border-2 border-black overflow-hidden shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transform hover:scale-[1.01] transition-transform duration-300">
						<Image
							src="/lomo-bg.jpg"
							alt="Community hands holding each other"
							fill
							sizes="(max-width: 768px) 100vw, 650px"
							className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
						/>
						{/* Subtle warm overlay */}
						<div className="absolute inset-0 bg-terracotta-9/5 mix-blend-multiply pointer-events-none" />
					</div>
				</div>
			</div>
		</section>
	);
}
