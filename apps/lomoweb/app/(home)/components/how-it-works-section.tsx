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
		<section aria-label="How it works" className="w-full bg-[#f5efe4]">
			<div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-20">
				<div className="flex flex-col gap-3 max-w-3xl mb-12">
					<span className="text-[#7a343b] font-display font-black text-sm tracking-widest uppercase select-none">
						Simple 4-Step Circle
					</span>
					<Heading level={2} size={8} className="font-display font-black leading-tight text-black">
						A simple, safe process
					</Heading>
					<Text size={3} className="text-black/70 font-medium leading-relaxed">
						We design for human relationships, not algorithmic transactions. Here is how mutual aid works in our trusted circle.
					</Text>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{STEPS.map(step => (
						<Card
							key={step.number}
							variant="surface"
							color="gray"
							size={2}
							className="relative flex flex-col p-6 bg-white border-2 border-black rounded-[24px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-default"
						>
							{/* Number container styled as a yellow pill */}
							<div className="flex items-center justify-between mb-5">
								<div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f2c010] border-2 border-black shadow-sm select-none">
									<Heading level={3} color="gray" size={5} className="m-0 leading-none font-display font-black text-black">
										{String(step.number)}
									</Heading>
								</div>
							</div>

							<Heading level={4} size={4} className="text-black font-display font-extrabold mb-2">
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
