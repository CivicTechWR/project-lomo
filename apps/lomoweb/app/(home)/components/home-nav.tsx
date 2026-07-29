import { Button } from "@repo/ui/button";
import { LomoLogo } from "@repo/ui/icons";
import { Link } from "@repo/ui/link";

export function HomeNav() {
	return (
		<header className="w-full min-h-12 bg-terracotta-2">
			<div className="max-w-[1512px] mx-auto px-4 md:px-8 flex items-center justify-between h-full min-h-12">
				<Link href="/" className="flex items-center gap-2 px-3 py-2">
					<LomoLogo className="size-8" />
					<span className="font-bold text-lg text-terracotta-12">LoMo</span>
				</Link>

				<nav aria-label="Main navigation">
					<div className="flex items-center gap-2">
						<Link href="/signin" className="px-3 py-2 min-h-11 min-w-11 flex items-center justify-center">
							Login
						</Link>
						<Button href="/signup" variant="solid" color="terracotta" size={2} className="min-h-11">
							Sign Up
						</Button>
					</div>
				</nav>
			</div>
		</header>
	);
}
