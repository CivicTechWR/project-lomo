import { Text } from "@repo/ui/text";

export function HomeFooter() {
	return (
		<footer className="w-full bg-terracotta-12 text-gray-1">
			<div className="max-w-300 mx-auto px-4 md:px-8 py-8 md:py-10 flex flex-col gap-6">
				{/* Row 1: Brand (left) + Safety Card (right) — stacks on mobile */}
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
					{/* Brand Identity */}
					<div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
						<span className="text-yellow-9 font-logo font-black tracking-tight text-2xl">
							LoMo
						</span>
						<p className="text-gray-1/80 font-display italic max-w-lg text-lg font-medium">
							Community help, close to home.
						</p>
					</div>

					{/* Safety Alert */}
					<div className="w-full md:w-auto md:max-w-md bg-terracotta-9/20 rounded-5 border-2 border-black p-4 md:p-5 text-center shadow-brand">
						<div className="flex flex-col items-center gap-2">
							<span className="text-xl">⚠️ Safety First</span>
							<Text size={2} className="text-gray-1/90 leading-relaxed font-medium">
								If you are experiencing an emergency, please reach out to local
								emergency services or a crisis professional immediately. LoMo is
								here to help with community needs once you are safe.
							</Text>
						</div>
					</div>
				</div>

				{/* Row 2: Copyright & metadata — full width */}
				<div className="w-full pt-4 border-t border-surface-warm/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
					<Text size={1} className="text-gray-1/40 font-medium">
						&copy;
						{" "}
						{new Date().getFullYear()}
						{" "}
						LoMo Community Help Circle. All rights reserved.
					</Text>
					<Text size={1} className="text-gray-1/40 flex items-center gap-4 font-medium">
						<span>Calm, consent-based mutual aid</span>
						<span className="hidden sm:inline">•</span>
						<span>Waterloo, ON</span>
					</Text>
				</div>
			</div>
		</footer>
	);
}
