import { Card } from "@repo/ui/card";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";

const STEPS = [
	{ number: 1, label: "Post a need", description: "Describe what you need and when. Your request is shared only with matched helpers." },
	{ number: 2, label: "A helper is chosen", description: "Someone in your community volunteers, or an admin assigns a trusted helper." },
	{ number: 3, label: "You accept the help", description: "You stay in control — confirm the helper before anything is shared." },
	{ number: 4, label: "Connect safely", description: "LoMo connects you and your helper directly, with consent at every step." },
] as const;

export function HowItWorksSection() {
	return (
		<section aria-label="How it works" className="w-full bg-sage-2">
			<div className="max-w-[1512px] mx-auto px-4 md:px-8 py-12">
				<Heading level={2} className="font-display">
					A simple, safe process
				</Heading>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
					{STEPS.map(step => (
						<Card key={step.number} variant="surface" color="gray" size={2}>
							<Heading level={3} color="terracotta">
								{String(step.number)}
							</Heading>
							<Heading level={4}>{step.label}</Heading>
							<Text size={2}>{step.description}</Text>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
