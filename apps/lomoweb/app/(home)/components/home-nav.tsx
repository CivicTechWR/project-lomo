import { Button } from "@repo/ui/button";
import { Link } from "@repo/ui/link";

export function HomeNav() {
	return (
		<header className="sticky top-0 z-50 w-full py-3 px-4 md:px-8 bg-transparent transition-all">
			<div className="max-w-[1200px] mx-auto">
				{/* Two pill-shaped containers: outer black, inner yellow */}
				<div className="w-full bg-black rounded-[36px] py-[1.5px] px-[8px] sm:px-[12px] flex items-center justify-center shadow-lg">
					{/* Inner Yellow Pill Container */}
					<div className="w-full bg-[#f2c010] rounded-[34px] px-6 py-1.5 flex items-center justify-between">
						{/* Logo / Brand Name */}
						<Link
							href="/"
							className="flex items-center gap-1 py-1 text-black hover:opacity-90 transition-opacity"
						>
							<span className="font-logo font-extrabold text-3xl tracking-tight text-black select-none">LoMo</span>
						</Link>

						{/* Navigation Capsule */}
						<nav aria-label="Main navigation">
							<div className="bg-[#f5efe4]/90 backdrop-blur-sm border-2 border-black/10 rounded-full p-0.5 pl-3 flex items-center gap-1.5 shadow-inner">
								<Link
									href="/signin"
									className="font-display font-black text-sm text-black hover:opacity-75 transition-opacity px-2 py-0.5 min-h-8 flex items-center justify-center"
								>
									Login
								</Link>
								<Button
									href="/signup"
									variant="solid"
									color="terracotta"
									size={2}
									className="min-h-8 flex items-center justify-center bg-[#7a343b] hover:bg-[#632a30] text-white border-2 border-black rounded-full px-4 py-0.5 font-display font-black text-sm shadow-[0px_2px_8px_rgba(0,0,0,0.10)] hover:shadow-[0px_4px_12px_rgba(0,0,0,0.15)] transition-shadow duration-150"
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
