"use client";

import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { ProximityImage } from "./proximity-image";
import { ctaButton, sectionPadding, warmOverlay } from "./styles";

export function JoinSection() {
	return (
		<section aria-label="Join the Circle" className="w-full">
			<div className={`max-w-300 mx-auto ${sectionPadding} text-center`}>
				<div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
					<Heading
						level={2}
						size={8}
						className="font-display font-black leading-tight tracking-tight text-black"
					>
						Join The Community
					</Heading>

					<Text size={2} className="text-black/60 font-display font-bold italic tracking-wide">
						Free to use. No social media login required. Your data belongs to you.
					</Text>

					{/* Static oval image — no badge overlay */}
					<div className="relative w-full max-w-[650px] aspect-[1.8/1] mt-8 mx-4 sm:mx-0 max-h-[60vh] sm:max-h-none">
						<div className="relative w-full h-full rounded-full border-2 border-black overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.10)] bg-white">
							<ProximityImage
								src="/lomo-food.jpg"
								alt="Diverse community members gathered together in a warm, supportive circle"
								fill
								sizes="(max-width: 768px) 100vw, 650px"
							/>
							<div className={warmOverlay} />
						</div>
					</div>

					<Button
						href="/signup"
						variant="solid"
						color="terracotta"
						size={3}
						className={ctaButton}
					>
						Join the Community
					</Button>
				</div>
			</div>
		</section>
	);
}
