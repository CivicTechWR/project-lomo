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
			<div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 md:py-12">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{VALUES.map(value => (
						<Card
							key={value}
							variant="surface"
							color="gray"
							size={2}
							className="relative flex items-center justify-center text-center p-6 bg-white border-2 border-black rounded-[24px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-default"
						>
							<Text
								weight="bold"
								size={3}
								className="text-black tracking-wide font-display font-extrabold flex items-center gap-2"
							>
								{value}
							</Text>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
