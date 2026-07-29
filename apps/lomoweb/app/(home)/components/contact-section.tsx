import { Heading } from "@repo/ui/heading";
import { Link } from "@repo/ui/link";
import { Text } from "@repo/ui/text";

export function ContactSection() {
	return (
		<section aria-label="Contact us" className="w-full bg-gray-2">
			<div className="max-w-[1512px] mx-auto px-4 md:px-8 py-12">
				<div className="flex flex-col gap-4">
					<Heading level={2} className="font-display">
						Contact Us
					</Heading>

					<Text size={3}>Have questions? We&apos;d love to hear from you.</Text>

					<Link href="mailto:hello@lomo.community">hello@lomo.community</Link>
				</div>
			</div>
		</section>
	);
}
