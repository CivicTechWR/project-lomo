import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import Image from "next/image";

export function HeroSection() {
	return (
		<section aria-label="Hero" className="w-full bg-terracotta-2">
			<div className="max-w-[1512px] mx-auto px-4 md:px-8 py-12 md:py-20">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
					{/* Left column: text + CTAs */}
					<div className="flex flex-col gap-6">
						<Heading level={1} className="font-display">
							Mutual aid for
							{" "}
							<span className="text-terracotta-11">Waterloo</span>
							{" "}
							and beyond
						</Heading>

						<Heading level={2} size={6} weight="medium">
							Your community, your circle. Give and receive help with neighbours you trust.
						</Heading>

						<Text size={3}>
							LoMo is a free, not-for-profit platform for local mutual aid. No algorithms, no ads, no data sold — ever. You control what you share and who can see it.
						</Text>

						<div className="flex flex-wrap gap-3">
							<Button href="/signup" variant="solid" color="terracotta" size={3}>
								Get Started
							</Button>
							<Button href="/signin" variant="outline" color="gray" size={3}>
								Sign In
							</Button>
						</div>
					</div>

					{/* Right column: hero image */}
					<div className="relative aspect-[4/3] w-full">
						<Image
							src="/lomo-bg.jpg"
							alt="Community members sharing resources"
							fill
							className="object-cover object-center"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
