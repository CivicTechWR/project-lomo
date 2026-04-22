"use client";

import { Button } from "@repo/ui/button";
import { LomoLogo } from "@repo/ui/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NotificationsDropdown } from "./notifications-panel";
import { authClient } from "@/lib/auth-client";

export function AppTopBar() {
	const router = useRouter();

	async function handleSignOut() {
		await authClient.signOut();
		router.push("/signin");
	}

	return (
		<header
			className={
				"sticky top-0 z-30 flex shrink-0 items-center justify-between gap-2 "
				+ "border-b border-gray-6 bg-gray-1/95 px-2 py-2 backdrop-blur sm:gap-3 sm:px-3 "
				+ "supports-[backdrop-filter]:bg-gray-1/85 lg:rounded-t-[max(var(--radius-4),16px)]"
			}
		>
			<Link
				href="/app"
				className="flex min-w-0 items-center gap-2 rounded-md outline-none ring-gray-8 focus-visible:ring-2 focus-visible:ring-offset-2"
			>
				<LomoLogo className="size-8 shrink-0" aria-hidden />
				<span className="truncate text-[length:var(--text-2)] font-medium text-gray-12">
					LoMo
				</span>
			</Link>

			<div className="flex shrink-0 items-center gap-2">
				<NotificationsDropdown />
				<Button
					variant="ghost"
					color="gray"
					size={1}
					className="min-h-9"
					onPress={() => router.push("/app/profile")}
				>
					Profile
				</Button>
				<Button
					variant="outline"
					color="gray"
					size={1}
					className="min-h-9"
					onPress={() => void handleSignOut()}
				>
					Sign out
				</Button>
			</div>
		</header>
	);
}
