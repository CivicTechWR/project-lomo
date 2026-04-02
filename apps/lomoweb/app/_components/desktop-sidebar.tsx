"use client";

import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Text } from "@repo/ui/text";

const NAV_ITEMS = [
	{ icon: "/images/icon-home.svg", label: "Home", href: "/" },
	{ icon: "/images/icon-plus.svg", label: "New Request", href: "/new-request" },
	{ icon: "/images/icon-settings.svg", label: "Settings", href: "/settings" },
] as const;

export function DesktopSidebar() {
	const pathname = usePathname();

	return (
		<aside className="hidden md:flex flex-col w-56 lg:w-64 shrink-0 gap-1 p-2">
			{NAV_ITEMS.map((item) => {
				const isActive = pathname === item.href;
				return (
					<NextLink
						key={item.label}
						href={item.href}
						className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-3)] transition-colors w-full ${
							isActive
								? "bg-terracotta-12"
								: "hover:bg-gray-4 active:bg-gray-5"
						}`}
					>
						<Image
							src={item.icon}
							alt=""
							width={22}
							height={22}
							className={isActive ? "brightness-0 invert" : ""}
						/>
						<Text
							size={3}
							weight={isActive ? "bold" : "medium"}
							className={isActive ? "text-gray-1" : undefined}
						>
							{item.label}
						</Text>
					</NextLink>
				);
			})}
		</aside>
	);
}
