import { Badge } from "@repo/ui/badge";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import Image from "next/image";

const OFFERING_TAGS = [
	"Dropping off supplies",
	"Funding a microgrant",
	"Sharing extra garden produce",
	"Lending tools",
	"Offering rides",
	"Cooking meals",
] as const satisfies readonly string[];

export function ShareSection() {
	return (
		<section aria-label="Share what you can" className="w-full bg-terracotta-1">
			<div className="max-w-[1512px] mx-auto px-4 md:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
					{/* Left column: image (image above text on mobile, image left on desktop) */}
					<div className="relative aspect-[4/3] w-full">
						<Image
							src="/lomo-bg.jpg"
							alt="Community members sharing resources"
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover object-center"
						/>
					</div>

					{/* Right column: text + tags */}
					<div className="flex flex-col gap-6">
						<Heading level={2} className="font-display">
							Share What You Can
						</Heading>

						<Heading level={3} size={5} weight="medium">
							Giving is not charity — it is solidarity. What you offer strengthens the whole community.
						</Heading>

						<Text size={3}>
							There is no obligation and no minimum contribution. Share whatever you can, whenever you can. Every act of giving — no matter how small — is a thread in the fabric of mutual aid.
						</Text>

						<div className="flex flex-wrap gap-2">
							{OFFERING_TAGS.map(tag => (
								<Badge key={tag} variant="soft" color="terracotta" size={2}>
									{tag}
								</Badge>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
