import { Button } from "@repo/ui/button";
import { Link } from "@repo/ui/link";

export function HomeNav() {
	return (
		<header>
			<div className="max-w-300 mx-auto">
				{/* Two pill-shaped containers: outer black, inner yellow */}
				<div className="w-full bg-black rounded-full py-px px-2 sm:px-3 flex items-center justify-center shadow-lg">
					{/* Inner Yellow Pill Container */}
					<div className="w-full bg-yellow-9 rounded-full px-3 sm:px-6 py-0.5 flex items-center justify-between">
						{/* Logo / Brand Name */}
						<Link
							href="/"
							className="flex items-center gap-1 py-0.5 text-black hover:opacity-90 transition-opacity"
						>
							<span className="font-logo font-extrabold text-4xl tracking-tight text-black select-none">LoMo</span>
						</Link>

						{/* Navigation Capsule */}
						<nav aria-label="Main navigation">
							<div className="bg-gray-1/90 backdrop-blur-sm border-2 border-black/10 rounded-full p-0.5 pl-3 flex items-center gap-1.5 shadow-inner">
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
									className="min-h-8 flex items-center justify-center bg-terracotta-9 hover:bg-terracotta-10 text-white border-2 border-black rounded-full px-4 py-0.5 font-display font-black text-sm shadow-brand hover:shadow-brand-hover transition-shadow duration-150"
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
