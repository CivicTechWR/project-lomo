"use client";

import type { IconName } from "@repo/ui/icons";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Icon, LomoLogo } from "@repo/ui/icons";
import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { useHomeMode } from "@/lib/home-mode-context";
import { canOfferHelp } from "@/lib/user-status";

// --- Tab Configuration ---

interface NavTab {
	id: string;
	label: string;
	href: string;
	icon: IconName;
	/** If set, clicking this tab sets the home mode instead of just navigating */
	homeMode?: "home" | "request_help" | "offer_help";
}

const APP_TABS: NavTab[] = [
	{ id: "home", label: "Home", href: "/app", icon: "home", homeMode: "home" },
	{ id: "my-requests", label: "My Requests", href: "/app", icon: "myRequests", homeMode: "request_help" },
	{ id: "open-requests", label: "Open Requests", href: "/app", icon: "openRequests", homeMode: "offer_help" },
	{ id: "notifications", label: "Notifications", href: "/app/notifications", icon: "notifications" },
	{ id: "profile", label: "Profile", href: "/app/profile", icon: "profile" },
];

const ADMIN_TABS: NavTab[] = [
	{ id: "dashboard", label: "Dashboard", href: "/app/admin", icon: "dashboard" },
	{ id: "requests", label: "Requests", href: "/app/admin/requests", icon: "adminRequests" },
	{ id: "users", label: "Users", href: "/app/admin/users", icon: "users" },
	{ id: "settings", label: "Settings", href: "/app/admin/settings", icon: "settings" },
];

// --- Helpers ---

function getActiveAppTabId(pathname: string, homeMode: string): string {
	if (pathname === "/app") {
		if (homeMode === "request_help")
			return "my-requests";
		if (homeMode === "offer_help")
			return "open-requests";
		return "home";
	}
	if (pathname.startsWith("/app/requests") || pathname.startsWith("/app/request"))
		return "my-requests";
	if (pathname.startsWith("/app/offer"))
		return "open-requests";
	if (pathname.startsWith("/app/notifications"))
		return "notifications";
	if (pathname.startsWith("/app/profile"))
		return "profile";
	return "home";
}

function getActiveAdminTabId(pathname: string): string {
	if (pathname === "/app/admin")
		return "dashboard";
	if (pathname.startsWith("/app/admin/requests"))
		return "requests";
	if (pathname.startsWith("/app/admin/users"))
		return "users";
	if (pathname.startsWith("/app/admin/settings"))
		return "settings";
	return "dashboard";
}

// --- Main Component ---

/**
 * Unified app sidebar navigation.
 *
 * Renders as:
 * - Sidebar on lg+ viewport (left side, fixed width)
 * - Bottom tab bar on smaller viewports (fixed to bottom)
 *
 * Automatically switches between regular app tabs and admin tabs
 * based on the current route.
 */
export function AppSidebar() {
	const pathname = usePathname() ?? "/app";
	const router = useRouter();
	const { mode, setMode } = useHomeMode();
	const isAdmin = useQuery(api.helpRequests.isAdmin, {});
	const profileRow = useQuery(api.users.getMyProfileRow);
	const isOnAdminRoute = pathname.startsWith("/app/admin");

	/*
	 * While resting (or blocked) the Open Requests tab is removed rather than
	 * disabled: a break should not leave a permanent reminder of work in the nav.
	 * Kept until the profile has loaded so the tab doesn't flicker in and out for
	 * users who can help.
	 */
	const showOpenRequestsTab = profileRow === undefined || canOfferHelp(profileRow);

	const tabs = isOnAdminRoute
		? ADMIN_TABS
		: APP_TABS.filter(tab => tab.id !== "open-requests" || showOpenRequestsTab);
	const activeTabId = isOnAdminRoute
		? getActiveAdminTabId(pathname)
		: getActiveAppTabId(pathname, mode);

	const handleTabClick = useCallback(
		(tab: NavTab) => {
			// If the tab has a homeMode, set it and navigate to /app
			if (tab.homeMode) {
				setMode(tab.homeMode);
				if (pathname !== "/app") {
					router.push("/app");
				}
				else if (tab.id === activeTabId) {
					window.scrollTo({ top: 0, behavior: "smooth" });
				}
				return;
			}
			// For other tabs, scroll to top if already active
			if (tab.id === activeTabId) {
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		},
		[activeTabId, pathname, router, setMode],
	);

	async function handleSignOut() {
		await authClient.signOut();
		router.push("/signin");
	}

	return (
		<>
			{/* Desktop sidebar (lg+) */}
			{/*
			  Pinned to the viewport rather than stretching with the page.
			  `h-screen` gives it a definite height so the flex row can't grow it to the
			  full content height — which is what previously pushed Sign out and
			  Settings to the bottom of a long page instead of the bottom of the screen.
			  The document remains the scroll container, so the `window.scrollTo` in
			  `handleTabClick` still works.
			*/}
			<nav
				aria-label={isOnAdminRoute ? "Admin navigation" : "App navigation"}
				className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-gray-6 lg:bg-gray-1"
			>
				{/* Logo header */}
				<div className="flex h-14 shrink-0 items-center border-b border-gray-6 px-4">
					<Link
						href="/app"
						className="flex items-center gap-2 rounded-1 outline-none ring-gray-8 focus-visible:ring-2 focus-visible:ring-offset-2"
					>
						<LomoLogo className="size-7 shrink-0" aria-hidden />
						<span className="font-display text-lg font-semibold text-gray-12">
							{isOnAdminRoute ? "LoMo Admin" : "LoMo"}
						</span>
					</Link>
				</div>

				{/* Back to app link (admin only) */}
				{isOnAdminRoute && (
					<div className="shrink-0 px-3 pt-3">
						<Link
							href="/app"
							className="flex items-center gap-2 rounded-2 px-3 py-2 text-sm font-medium text-gray-11 transition-colors hover:bg-gray-3 hover:text-gray-12"
						>
							<Icon name="back" className="size-4" />
							<span>Back to app</span>
						</Link>
					</div>
				)}

				{/*
				  A list of links, not a tablist. Activating one is a route change, and
				  there are no tabpanels for a `tablist` to own — so `role="tab"` would
				  promise arrow-key traversal and panel swapping that never happen. The
				  enclosing <nav> supplies the landmark and label.
				*/}
				{/*
				  `min-h-0` is load-bearing: without it a flex child refuses to shrink
				  below its content, so a nav list taller than the viewport would overflow
				  the pinned sidebar instead of scrolling inside it.
				*/}
				<ul role="list" className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
					{tabs.map(tab => (
						<li key={tab.id}>
							<SidebarTab
								tab={tab}
								isActive={activeTabId === tab.id}
								onTabClick={handleTabClick}
							/>
						</li>
					))}

					{/* Admin link for non-admin routes */}
					{!isOnAdminRoute && isAdmin && (
						<li>
							<div role="presentation" className="my-2 border-t border-gray-6" />
							<Link
								href="/app/admin"
								className="flex min-h-11 items-center gap-3 rounded-2 px-3 py-2.5 text-sm font-medium text-gray-11 transition-colors hover:bg-gray-3 hover:text-gray-12"
							>
								<Icon name="admin" className="size-5 text-gray-11" />
								<span>Admin</span>
							</Link>
						</li>
					)}
				</ul>

				{/* Sign out, pinned to the bottom of the viewport-height sidebar */}
				<div className="shrink-0 border-t border-gray-6 p-3">
					<button
						type="button"
						onClick={() => void handleSignOut()}
						className="flex w-full items-center gap-3 rounded-2 px-3 py-2.5 text-sm font-medium text-gray-11 transition-colors hover:bg-gray-3 hover:text-gray-12"
					>
						<Icon name="signOut" className="size-5" />
						<span>Sign out</span>
					</button>
				</div>
			</nav>

			{/* Mobile/tablet bottom bar (below lg) */}
			<nav
				aria-label={isOnAdminRoute ? "Admin navigation" : "App navigation"}
				className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-6 bg-gray-1/95 backdrop-blur supports-[backdrop-filter]:bg-gray-1/85 lg:hidden"
			>
				<ul role="list" className="flex items-center justify-around px-2 py-1">
					{tabs.map(tab => (
						<li key={tab.id}>
							<BottomTab
								tab={tab}
								isActive={activeTabId === tab.id}
								onTabClick={handleTabClick}
							/>
						</li>
					))}
				</ul>
			</nav>
		</>
	);
}

// --- SidebarTab Component ---

function SidebarTab({
	tab,
	isActive,
	onTabClick,
}: {
	tab: NavTab;
	isActive: boolean;
	onTabClick: (tab: NavTab) => void;
}) {
	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			// For mode-based tabs, always prevent default link behavior
			if (tab.homeMode) {
				e.preventDefault();
				onTabClick(tab);
				return;
			}
			if (isActive) {
				e.preventDefault();
				onTabClick(tab);
			}
		},
		[isActive, onTabClick, tab],
	);

	return (
		<Link
			href={tab.href}
			aria-current={isActive ? "page" : undefined}
			onClick={handleClick}
			className={[
				"flex items-center gap-3 rounded-2 px-3 py-2.5",
				"min-h-11 min-w-11",
				"text-sm font-medium transition-colors",
				"outline-none focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2",
				isActive
					? "bg-gray-4 text-gray-12"
					: "text-gray-11 hover:bg-gray-3 hover:text-gray-12",
			].join(" ")}
		>
			{/* size-5 matches BottomTab so both nav variants read at the same weight. */}
			<Icon
				name={tab.icon}
				className={`size-5 ${isActive ? "text-gray-12" : "text-gray-11"}`}
			/>
			<span>{tab.label}</span>
		</Link>
	);
}

// --- BottomTab Component ---

function BottomTab({
	tab,
	isActive,
	onTabClick,
}: {
	tab: NavTab;
	isActive: boolean;
	onTabClick: (tab: NavTab) => void;
}) {
	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			// For mode-based tabs, always prevent default link behavior
			if (tab.homeMode) {
				e.preventDefault();
				onTabClick(tab);
				return;
			}
			if (isActive) {
				e.preventDefault();
				onTabClick(tab);
			}
		},
		[isActive, onTabClick, tab],
	);

	return (
		<Link
			href={tab.href}
			aria-current={isActive ? "page" : undefined}
			onClick={handleClick}
			className={[
				"flex flex-col items-center justify-center gap-0.5",
				"min-h-11 min-w-11 px-2 py-1",
				"text-xs font-medium transition-colors",
				"outline-none focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2",
				isActive ? "text-gray-12" : "text-gray-11",
			].join(" ")}
		>
			<Icon
				name={tab.icon}
				className={`size-5 ${isActive ? "text-gray-12" : "text-gray-11"}`}
			/>
			<span>{tab.label}</span>
		</Link>
	);
}
