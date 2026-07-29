import { Badge } from "@repo/ui/badge";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import Image from "next/image";

const REQUEST_TAGS = [
	"Grocery sharing",
	"Crisis funds",
	"Warm meals",
	"Peer check-ins",
	"Transport help",
	"Emotional support",
] as const satisfies readonly string[];

export function FindSection() {
	return (
		<section aria-label="Find what you need" className="w-full bg-gray-1">
			<div className="max-w-[1512px] mx-auto px-4 md:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
					{/* Left column: text + tags */}
					<div className="flex flex-col gap-6">
						<Heading level={2} className="font-display">
							Find What You Need
						</Heading>

						<Heading level={3} size={5} weight="medium">
							Asking for help is a sign of strength — and a normal part of community life.
						</Heading>

						<Text size={3}>
							Your requests are only shared with people who choose to help. You stay in control of what you share, who can see it, and when to accept help. LoMo never sells your data or exposes your information without your consent.
						</Text>

						<div className="flex flex-wrap gap-2">
							{REQUEST_TAGS.map(tag => (
								<Badge key={tag} variant="soft" color="sage" size={2}>
									{tag}
								</Badge>
							))}
						</div>
					</div>

					{/* Right column: image */}
					<div className="relative aspect-[4/3] w-full">
						<Image
							src="/lomo-bg.jpg"
							alt="Community members sharing resources"
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover object-center"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
