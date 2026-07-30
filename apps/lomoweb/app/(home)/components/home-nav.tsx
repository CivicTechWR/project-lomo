import { Button } from "@repo/ui/button";
import { Link } from "@repo/ui/link";

export function HomeNav() {
	return (
		<header className="sticky top-0 z-50 w-full bg-[#f5efe4]/80 backdrop-blur-md py-4 px-4 md:px-8 transition-all">
			<div className="max-w-[1200px] mx-auto">
				{/* Two pill-shaped containers: outer black, inner yellow */}
				<div className="w-full bg-black rounded-[36px] py-[1.5px] px-[8px] sm:px-[12px] flex items-center justify-center">
					{/* Inner Yellow Pill Container */}
					<div className="w-full bg-[#f2c010] rounded-[34px] px-6 py-3 flex items-center justify-between">
						{/* Logo / Brand Name */}
						<Link
							href="/"
							className="flex items-center gap-1 py-1 text-black hover:opacity-90 transition-opacity"
						>
							<span className="font-logo font-extrabold text-2xl tracking-tight text-black select-none">LoMo</span>
						</Link>

						{/* Navigation Capsule */}
						<nav aria-label="Main navigation">
							<div className="bg-[#f5efe4]/90 backdrop-blur-sm border-2 border-black/10 rounded-full p-1 pl-5 flex items-center gap-3 shadow-inner">
								<Link
									href="/signin"
									className="font-display font-black text-sm text-black hover:opacity-75 transition-opacity px-2 py-1.5 min-h-11 flex items-center justify-center"
								>
									Login
								</Link>
								<Button
									href="/signup"
									variant="solid"
									color="terracotta"
									size={2}
									className="min-h-11 flex items-center justify-center bg-[#7a343b] hover:bg-[#632a30] text-white border-2 border-black rounded-full px-6 py-2 font-display font-black text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all duration-100"
								>
									Sign Up
								</Button>
							</div>
						</nav>
					</div>
				</div>
			</div>
		</header>
	);
}
