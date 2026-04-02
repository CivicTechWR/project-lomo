"use client";

import Image from "next/image";
import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";

export function TitleBar() {
	return (
		<header className="sticky top-0 z-10 flex items-center justify-between bg-terracotta-12 px-5 py-3.5 sm:px-8 sm:py-4 rounded-[var(--radius-5)]">
			<Heading level={1} size={7} weight="bold" className="text-gray-1">
				LoMo
			</Heading>
			<Button
				icon
				aria-label="Notifications"
				variant="ghost"
				size={2}
				color="gray"
				className="text-gray-1 hover:bg-terracotta-a3"
			>
				<Image src="/images/icon-bell.svg" alt="" width={22} height={22} className="brightness-0 invert" />
			</Button>
		</header>
	);
}
