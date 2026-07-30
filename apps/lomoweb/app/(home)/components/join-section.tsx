import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import Image from "next/image";
import { ctaButton } from "./styles";

export function JoinSection() {
	return (
		<section aria-label="Join the Circle" className="w-full">
			<div className="max-w-300 mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
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

					{/* Static oval image — no badge overlay */}
					<div className="relative w-full max-w-[650px] aspect-[2.2/1] mt-8">
						<div className="relative w-full h-full rounded-full border-2 border-black overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.10)] bg-white">
							<Image
								src="/lomo-bg.jpg"
								alt="Diverse community members gathered together in a warm, supportive circle"
								fill
								sizes="(max-width: 768px) 100vw, 650px"
								className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
							/>
							<div className="absolute inset-0 bg-terracotta-9/5 mix-blend-multiply pointer-events-none" />
						</div>
					</div>

					<Button
						href="/signup"
						variant="solid"
						color="terracotta"
						size={3}
						className={ctaButton}
					>
						Join the Circle
					</Button>
				</div>
			</div>
		</section>
	);
}
