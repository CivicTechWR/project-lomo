import { Heading } from "@repo/ui/heading";
import { Link } from "@repo/ui/link";
import { Text } from "@repo/ui/text";

export function ContactSection() {
	return (
		<section aria-label="Contact us" className="w-full bg-[#f5efe4] py-16 md:py-24">
			<div className="max-w-[1200px] mx-auto px-4 md:px-8">
				<div className="flex flex-col gap-4 max-w-2xl">
					<Heading level={2} size={7} className="font-display font-black text-black">
						Contact Us
					</Heading>

					<Text size={3} className="text-black/70 font-medium leading-relaxed">
						Have questions, ideas, or want to start a circle in your area? We would love to connect.
					</Text>

					<div className="inline-flex items-center gap-2 mt-2">
						<Link
							href="mailto:hello@lomo.community"
							className="font-display font-bold text-lg text-[#7a343b] hover:text-[#632a30] underline decoration-2 underline-offset-4 transition-colors"
						>
							hello@lomo.community
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
