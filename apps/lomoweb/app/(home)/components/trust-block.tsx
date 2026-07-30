import { Text } from "@repo/ui";

const VALUES = [
	"Free & not-for-profit 🤝",
	"No algorithms, no ads 🚫",
	"You own your data 🔒",
	"Community-first, always 🌱",
] as const;

export function TrustBlock() {
	return (
		<section aria-label="Our values" className="w-full">
			<h2 className="sr-only">Our values</h2>
			<div className="max-w-300 mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
				<ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 list-none p-0 m-0">
					{VALUES.map((value, i) => (
						<li key={value} className="flex items-center gap-2">
							<Text
								weight="bold"
								size={3}
								className="text-black font-display font-extrabold whitespace-nowrap"
							>
								{value}
							</Text>
							{i < VALUES.length - 1 && (
								<span aria-hidden="true" className="text-black/30 select-none">·</span>
							)}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
