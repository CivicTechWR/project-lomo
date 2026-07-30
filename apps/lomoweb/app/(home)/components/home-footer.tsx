import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";

export function HomeFooter() {
	return (
		<footer className="w-full bg-terracotta-12 text-[#f5efe4]">
			<div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-16 flex flex-col items-center gap-10">
				{/* Top section: Brand Identity */}
				<div className="flex flex-col items-center gap-3 text-center">
					<Heading level={3} size={6} className="text-[#f2c010] font-logo font-black tracking-tight text-2xl">
						LoMo
					</Heading>
					<Heading level={3} size={4} weight="medium" className="text-[#f5efe4]/80 font-display italic max-w-lg">
						Community help, close to home.
					</Heading>
				</div>

				{/* Middle section: Ethical Safety Alert Card */}
				<div className="w-full max-w-3xl bg-[#7a343b]/20 rounded-[var(--radius-3)] border-2 border-black p-5 md:p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
					<div className="flex flex-col items-center gap-2">
						<span className="text-xl">⚠️ Safety First</span>
						<Text size={2} className="text-[#f5efe4]/90 leading-relaxed max-w-2xl font-medium">
							If you are experiencing an emergency, please reach out to local
							emergency services or a crisis professional immediately. LoMo is
							here to help with community needs once you are safe.
						</Text>
					</div>
				</div>

				{/* Bottom section: Metadata & Rights */}
				<div className="w-full pt-8 border-t border-[#f5efe4]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
					<Text size={1} className="text-[#f5efe4]/40 font-medium">
						&copy;
						{" "}
						{new Date().getFullYear()}
						{" "}
						LoMo Community Help Circle. All rights reserved.
					</Text>
					<Text size={1} className="text-[#f5efe4]/40 flex items-center gap-4 font-medium">
						<span>Calm, consent-based mutual aid</span>
						<span className="hidden sm:inline">•</span>
						<span>Waterloo, ON</span>
					</Text>
				</div>
			</div>
		</footer>
	);
}
