import { Heading } from "@repo/ui/heading";
import { Link } from "@repo/ui/link";
import { Text } from "@repo/ui/text";

import { sectionPadding } from "./styles";

export function ContactSection() {
	return (
		<section aria-label="Contact us" className="w-full">
			<div className={`max-w-300 mx-auto ${sectionPadding}`}>
				<div className="flex flex-col gap-4 max-w-2xl">
					<Heading level={2} size={7} className="font-display font-black text-black">
						Contact Us
					</Heading>

					<Text size={3} className="text-black/70 font-medium leading-relaxed">
						Questions, ideas, or want to support us? Reach out any time.
					</Text>

					<div className="inline-flex items-center gap-2 mt-2">
						<Link
							href="mailto:slapstickdevelopment@gmail.com"
							className="font-display font-bold text-lg text-terracotta-11 hover:text-terracotta-10 underline decoration-2 underline-offset-4 transition-colors min-h-11 inline-flex items-center"
						>
							slapstickdevelopment@gmail.com
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
