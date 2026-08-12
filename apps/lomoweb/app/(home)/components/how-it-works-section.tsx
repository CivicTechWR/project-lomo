import { Card } from "@repo/ui/card";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";

import { cardSurface, sectionLabel, sectionPadding } from "./styles";

const STEPS = [
	{ number: 1, label: "Ask for what you need", description: "Describe what you need and when. Only matched helpers see your request." },
	{ number: 2, label: "Someone steps forward", description: "A neighbour volunteers, or a coordinator suggests someone trusted." },
	{ number: 3, label: "You choose your helper", description: "You confirm before anything is shared. Nothing happens without your say." },
	{ number: 4, label: "Connect when you're ready", description: "You and your helper connect directly, with consent at every step." },
] as const;

export function HowItWorksSection() {
	return (
		<section aria-label="How it works" className="w-full">
			<div className={`max-w-300 mx-auto ${sectionPadding}`}>
				<div className="flex flex-col gap-3 max-w-3xl mb-12">
					<span className={sectionLabel}>
						How It Works
					</span>
					<Heading level={2} size={8} className="font-display font-black leading-tight text-black">
						A simple, safe process
					</Heading>
					<Text size={3} className="text-black/70 font-medium leading-relaxed">
						Here is how mutual aid works, step by step.
					</Text>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
					{STEPS.map(step => (
						<Card
							key={step.number}
							variant="surface"
							color="gray"
							size={2}
							className={`relative flex flex-col p-6 bg-white ${cardSurface} cursor-default`}
						>
							{/* Number container styled as a yellow pill */}
							<div className="flex items-center justify-between mb-5">
								<div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-9 border-2 border-black shadow-sm select-none">
									<span aria-hidden="true" className="m-0 leading-none font-display font-black text-black text-xl">
										{String(step.number)}
									</span>
								</div>
							</div>

							<Heading level={3} size={4} className="text-black font-display font-extrabold mb-2">
								{step.label}
							</Heading>

							<Text size={2} className="text-black/70 font-medium leading-relaxed">
								{step.description}
							</Text>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
