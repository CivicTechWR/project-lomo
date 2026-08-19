"use client";

import { Button } from "@repo/ui/button";
import { LomoLogo } from "@repo/ui/icons";
import { Modal, ModalOverlay } from "@repo/ui/modal";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useHomeMode } from "@/lib/home-mode-context";
import { NotificationsNavButton } from "./notifications-panel";

function MenuIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={20}
			height={20}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<line x1="4" y1="6" x2="20" y2="6" />
			<line x1="4" y1="12" x2="20" y2="12" />
			<line x1="4" y1="18" x2="20" y2="18" />
		</svg>
	);
}

function CloseIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={18}
			height={18}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</svg>
	);
}

export function AppTopBar() {
	const router = useRouter();
	const pathname = usePathname() ?? "";
	const { setMode } = useHomeMode();
	const [menuOpen, setMenuOpen] = useState(false);

	async function handleSignOut() {
		setMenuOpen(false);
		await authClient.signOut();
		router.push("/signin");
	}

	function handleLogoClick() {
		setMode("home");
		if (pathname !== "/app") {
			router.push("/app");
		}
	}

	function goToMyRequests() {
		setMenuOpen(false);
		setMode("request_help");
		if (pathname !== "/app") {
			router.push("/app");
		}
	}

	function goToOpenRequests() {
		setMenuOpen(false);
		setMode("offer_help");
		if (pathname !== "/app") {
			router.push("/app");
		}
	}

	function goToProfile() {
		setMenuOpen(false);
		router.push("/app/profile");
	}

	return (
		<header
			className={
				"sticky top-0 z-30 flex shrink-0 items-center justify-between gap-2 "
				+ "border-b border-gray-6 bg-gray-1/95 px-4 py-2.5 backdrop-blur sm:gap-3 sm:px-6 "
				+ "supports-[backdrop-filter]:bg-gray-1/85"
			}
		>
			<Link
				href="/app"
				onClick={handleLogoClick}
				className="flex min-w-0 items-center gap-2 rounded-md outline-none ring-gray-8 focus-visible:ring-2 focus-visible:ring-offset-2"
			>
				<LomoLogo className="size-8 shrink-0" aria-hidden />
				<span className="truncate text-[length:var(--text-2)] font-medium text-gray-12">
					LoMo
				</span>
			</Link>

			<div className="flex shrink-0 items-center gap-1 sm:gap-2">
				<NotificationsNavButton />
				<Button
					variant="ghost"
					color="gray"
					size={1}
					className="min-h-9 min-w-9 px-2"
					aria-label="Open menu"
					aria-haspopup="dialog"
					aria-expanded={menuOpen}
					onPress={() => setMenuOpen(true)}
				>
					<MenuIcon className="text-gray-11" />
				</Button>
			</div>

			<ModalOverlay
				isOpen={menuOpen}
				onOpenChange={setMenuOpen}
				isDismissable
				className="place-items-start justify-items-end p-2 pt-2 sm:p-3 sm:pt-3"
			>
				<Modal size={2} aria-label="App menu" className="mt-0 max-w-xs">
					<div className="flex flex-col gap-1">
						<div className="mb-1 flex justify-end">
							<Button
								variant="ghost"
								color="gray"
								size={1}
								className="min-h-9 min-w-9 px-2"
								aria-label="Close menu"
								onPress={() => setMenuOpen(false)}
							>
								<CloseIcon className="text-gray-11" />
							</Button>
						</div>
						<Button
							variant="ghost"
							color="gray"
							size={2}
							className="justify-start"
							onPress={goToMyRequests}
						>
							My requests
						</Button>
						<Button
							variant="ghost"
							color="gray"
							size={2}
							className="justify-start"
							onPress={goToOpenRequests}
						>
							Open requests
						</Button>
						<Button
							variant="ghost"
							color="gray"
							size={2}
							className="justify-start"
							onPress={goToProfile}
						>
							Profile
						</Button>
						<div className="my-1 border-t border-gray-6" />
						<Button
							variant="ghost"
							color="gray"
							size={2}
							className="justify-start"
							onPress={() => void handleSignOut()}
						>
							Sign out
						</Button>
					</div>
				</Modal>
			</ModalOverlay>
		</header>
	);
}
