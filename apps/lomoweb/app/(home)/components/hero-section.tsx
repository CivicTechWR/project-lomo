import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { HeroIllustration } from "./hero-illustration";
import { ctaButton, headingH1, secondaryButton, sectionLabel } from "./styles";

export function HeroSection() {
	return (
		<section aria-label="Hero" className="w-full relative overflow-hidden pb-12">
			{/* Mobile: image behind text (absolute-positioned) */}
			<div className="absolute inset-0 sm:hidden">
				<HeroIllustration />
			</div>

			<div className="max-w-300 mx-auto px-4 md:px-8 py-12 md:py-16 relative">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 items-center">
					{/* Left column: text + CTAs (takes up 7 columns on desktop) */}
					<div className="flex flex-col gap-6 lg:col-span-7 bg-surface-warm/85 backdrop-blur-sm rounded-4 p-5 sm:bg-transparent sm:backdrop-blur-none sm:rounded-none sm:p-0">
						<span className={sectionLabel}>
							Mutual Aid Waterloo Region
						</span>

						<Heading level={1} size={9} className={`font-display font-black leading-tight tracking-tight text-black ${headingH1}`}>
							Sharing Care
							<br />
							& Resources In
							<br />
							<span className="text-yellow-10 relative inline-block isolate">
								Waterloo
								<span className="absolute left-0 -bottom-1 w-full h-3 bg-accent-underline rounded-full -z-10 -rotate-1" />
							</span>
							{" "}
							Region
						</Heading>

						<Text size={4} className="text-black/80 font-display italic font-bold">
							A calm, consent-based mutual aid platform
						</Text>

						<Text size={3} className="text-black/70 font-medium leading-relaxed max-w-xl">
							LoMo is a community-led space where neighbours connect to share food, microgrants, and everyday supports. We believe that everyone has something to offer, and everyone has times when they need backup. By keeping our platform direct, secure, and free from commercial tracking, we ensure you can give and receive support safely, on your own terms, and with dignity.
						</Text>

						<div className="flex flex-wrap gap-4 mt-2">
							<Button
								href="/signup"
								variant="solid"
								color="terracotta"
								size={3}
								className={ctaButton}
							>
								Get Started
							</Button>
							<Button
								href="/signin"
								variant="outline"
								color="gray"
								size={3}
								className={`${secondaryButton} min-h-11`}
							>
								Sign In
							</Button>
						</div>
					</div>

					{/* Right column: visible only on sm+ (side-by-side layout) */}
					<div className="relative w-full lg:col-span-5 hidden sm:flex flex-col items-center justify-center min-h-100">
						<HeroIllustration />
					</div>
				</div>
			</div>
		</section>
	);
}
