import { Card, Text } from "@repo/ui";

const VALUES = [
	"Free & not-for-profit 🤝",
	"No algorithms, no ads 🚫",
	"You own your data 🔒",
	"Community-first, always 🌱",
] as const;

export function TrustBlock() {
	return (
		<section aria-label="Our values" className="w-full bg-gray-1">
			<h2 className="sr-only">Our values</h2>
			<div className="max-w-[1512px] mx-auto px-4 md:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{VALUES.map(value => (
						<Card key={value} variant="ghost" color="sage" size={2}>
							<Text weight="bold" size={3}>{value}</Text>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
