import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";

export function HeroSection() {
	return (
		<section aria-label="Hero" className="w-full bg-[#f5efe4] relative overflow-hidden pb-12">
			<div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-16">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
					{/* Left column: text + CTAs (takes up 7 columns on desktop) */}
					<div className="flex flex-col gap-6 lg:col-span-7">
						<span className="text-[#7a343b] font-display font-black text-sm tracking-widest uppercase select-none">
							Mutual Aid Waterloo Region
						</span>

						<Heading level={1} size={9} className="font-display font-black leading-tight tracking-tight text-black">
							Sharing Care
							<br />
							& Resources In
							<br />
							<span className="text-[#f2c010] relative inline-block">
								Waterloo
								<span className="absolute left-0 bottom-1 w-full h-2 bg-black/10 rounded-full -z-10" />
							</span>
							{" "}
							Region
						</Heading>

						<Heading level={2} size={4} weight="bold" className="text-black/80 font-display italic">
							Sharing Care and Resources in Waterloo Region
						</Heading>

						<Text size={3} className="text-black/70 font-medium leading-relaxed max-w-xl">
							LoMo is a community-led space where neighbours connect to share food, microgrants, and everyday supports. We believe that everyone has something to offer, and everyone has times when they need backup. By keeping our platform direct, secure, and free from commercial tracking, we ensure you can give and receive support safely, on your own terms, and with dignity.
						</Text>

						<div className="flex flex-wrap gap-4 mt-2">
							<Button
								href="/signup"
								variant="solid"
								color="terracotta"
								size={3}
								className="bg-[#7a343b] hover:bg-[#632a30] text-white border-2 border-black rounded-full px-8 py-3.5 font-display font-black text-base shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-100"
							>
								Get Started
							</Button>
							<Button
								href="/signin"
								variant="outline"
								color="gray"
								size={3}
								className="bg-white hover:bg-[#fcfaf7] text-black border-2 border-black rounded-full px-8 py-3.5 font-display font-black text-base shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-100"
							>
								Sign In
							</Button>
						</div>
					</div>

					{/* Right column: Beautiful hand and feather vector illustration */}
					<div className="relative w-full lg:col-span-5 flex flex-col items-center justify-center min-h-[400px]">
						{/* Clean vector SVG representation of the editorial hand-shake and feather design */}
						<svg
							viewBox="0 0 400 450"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="w-full max-w-[380px] drop-shadow-md select-none pointer-events-none"
						>
							{/* Top Hand (Terracotta, reaching down) */}
							<path
								d="M180 80C190 75 220 50 250 40C280 30 350 10 380 5C385 10 390 25 385 45C380 65 350 85 320 100C305 107 270 120 260 122C250 124 235 125 210 130C190 134 175 140 160 148C150 153 145 155 140 152C135 149 140 135 150 125C160 115 170 105 180 100"
								fill="#7a343b"
								stroke="#000"
								strokeWidth="4.5"
								strokeLinejoin="round"
							/>
							{/* Fingers details of top hand */}
							<path
								d="M260 122C280 120 310 122 340 125C345 125 350 115 340 110C320 100 290 95 260 100"
								stroke="#000"
								strokeWidth="4"
								strokeLinejoin="round"
							/>
							<path
								d="M235 125C255 124 285 128 315 132C320 133 325 125 315 120C295 112 265 108 235 112"
								stroke="#000"
								strokeWidth="4"
								strokeLinejoin="round"
							/>
							<path
								d="M210 130C230 130 255 135 280 140C285 141 290 133 280 128C260 120 230 118 210 122"
								stroke="#000"
								strokeWidth="4"
								strokeLinejoin="round"
							/>

							{/* Bottom Hand (Yellow, reaching up) */}
							<path
								d="M220 370C210 375 180 400 150 410C120 420 50 440 20 445C15 440 10 425 15 405C20 385 50 365 80 350C95 343 130 330 140 328C150 326 165 325 190 320C210 316 225 310 240 302C250 297 255 295 260 298C265 301 260 315 250 325C240 335 230 345 220 350"
								fill="#f2c010"
								stroke="#000"
								strokeWidth="4.5"
								strokeLinejoin="round"
							/>
							{/* Fingers details of bottom hand */}
							<path
								d="M140 328C120 330 90 328 60 325C55 325 50 335 60 340C80 350 110 355 140 350"
								stroke="#000"
								strokeWidth="4"
								strokeLinejoin="round"
							/>
							<path
								d="M165 325C145 326 115 322 85 318C80 317 75 325 85 330C105 338 135 342 165 338"
								stroke="#000"
								strokeWidth="4"
								strokeLinejoin="round"
							/>
							<path
								d="M190 320C170 320 145 315 120 310C115 309 110 317 120 322C140 330 170 332 190 328"
								stroke="#000"
								strokeWidth="4"
								strokeLinejoin="round"
							/>

							{/* Center Floating Feather */}
							<g transform="translate(230, 210) rotate(-15)">
								{/* Main feather body */}
								<path
									d="M-80 15C-50 18 -10 15 30 -5C50 -15 70 -35 80 -55C75 -50 45 -45 25 -40C5 -35 -25 -25 -50 -15C-70 -7 -85 0 -95 10C-92 8 -85 12 -80 15Z"
									fill="#2e2e2e"
									stroke="#000"
									strokeWidth="4"
									strokeLinejoin="round"
								/>
								{/* Feather spine/shaft */}
								<path
									d="M-110 25C-70 15 -10 -5 85 -60"
									stroke="#000"
									strokeWidth="4.5"
									strokeLinecap="round"
								/>
								{/* Decorative details (dots/spots on the feather as shown in screenshot) */}
								<circle cx="20" cy="-20" r="5" fill="#7a343b" />
								<circle cx="-10" cy="-10" r="4.5" fill="#f2c010" />
								<circle cx="-40" cy="-2" r="4" fill="#7a343b" />
								<circle cx="45" cy="-32" r="3.5" fill="#fff" />
							</g>
						</svg>
					</div>
				</div>
			</div>
		</section>
	);
}
