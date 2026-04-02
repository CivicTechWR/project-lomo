"use client";

import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
	{ icon: "/images/icon-home.svg", label: "Home", href: "/" },
	{ icon: "/images/icon-plus.svg", label: "Add", href: "/new-request" },
	{ icon: "/images/icon-settings.svg", label: "Settings", href: "/settings" },
] as const;

export function TabBar() {
	const pathname = usePathname();

	return (
		<nav className="md:hidden flex items-center gap-0 h-[68px] bg-gray-2 border-4 border-terracotta-12 rounded-[var(--radius-5)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] m-2 p-0.5">
			{TABS.map((tab) => {
				const isActive = pathname === tab.href;
				return (
					<NextLink
						key={tab.label}
						href={tab.href}
						aria-label={tab.label}
						aria-current={isActive ? "page" : undefined}
						className={`flex-1 flex items-center justify-center h-full min-w-0 px-2.5 rounded-[var(--radius-4)] transition-colors ${
							isActive
								? "bg-terracotta-12"
								: "hover:bg-gray-4"
						}`}
					>
						<Image
							src={tab.icon}
							alt=""
							width={44}
							height={44}
							className={isActive ? "brightness-0 invert" : ""}
						/>
					</NextLink>
				);
			})}
		</nav>
	);
}
