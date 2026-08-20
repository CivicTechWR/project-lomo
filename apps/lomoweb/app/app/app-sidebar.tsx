"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import { LomoLogo } from "@repo/ui/icons";
import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { useHomeMode } from "@/lib/home-mode-context";

// --- Icon Components ---

function HomeIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			<polyline points="9 22 9 12 15 12 15 22" />
		</svg>
	);
}

function MyRequestsIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
			<line x1="16" y1="13" x2="8" y2="13" />
			<line x1="16" y1="17" x2="8" y2="17" />
			<polyline points="10 9 9 9 8 9" />
		</svg>
	);
}

function OpenRequestsIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10" />
			<path d="M8 14s1.5 2 4 2 4-2 4-2" />
			<line x1="9" y1="9" x2="9.01" y2="9" />
			<line x1="15" y1="9" x2="15.01" y2="9" />
		</svg>
	);
}

function ProfileIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</svg>
	);
}

function NotificationsIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<rect x="2" y="4" width="20" height="16" rx="2" />
			<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
		</svg>
	);
}

function SignOutIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<polyline points="16 17 21 12 16 7" />
			<line x1="21" y1="12" x2="9" y2="12" />
		</svg>
	);
}

function AdminIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
		</svg>
	);
}

function DashboardIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<rect x="3" y="3" width="7" height="7" rx="1" />
			<rect x="14" y="3" width="7" height="7" rx="1" />
			<rect x="3" y="14" width="7" height="7" rx="1" />
			<rect x="14" y="14" width="7" height="7" rx="1" />
		</svg>
	);
}

function AdminRequestsIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
			<line x1="16" y1="13" x2="8" y2="13" />
			<line x1="16" y1="17" x2="8" y2="17" />
			<polyline points="10 9 9 9 8 9" />
		</svg>
	);
}

function UsersIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	);
}

function SettingsIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
		</svg>
	);
}

function BackIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<line x1="19" y1="12" x2="5" y2="12" />
			<polyline points="12 19 5 12 12 5" />
		</svg>
	);
}

// --- Tab Configuration ---

interface NavTab {
	id: string;
	label: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	/** If set, clicking this tab sets the home mode instead of just navigating */
	homeMode?: "home" | "request_help" | "offer_help";
}

const APP_TABS: NavTab[] = [
	{ id: "home", label: "Home", href: "/app", icon: HomeIcon, homeMode: "home" },
	{ id: "my-requests", label: "My Requests", href: "/app", icon: MyRequestsIcon, homeMode: "request_help" },
	{ id: "open-requests", label: "Open Requests", href: "/app", icon: OpenRequestsIcon, homeMode: "offer_help" },
	{ id: "notifications", label: "Notifications", href: "/app/notifications", icon: NotificationsIcon },
	{ id: "profile", label: "Profile", href: "/app/profile", icon: ProfileIcon },
];

const ADMIN_TABS: NavTab[] = [
	{ id: "dashboard", label: "Dashboard", href: "/app/admin", icon: DashboardIcon },
	{ id: "requests", label: "Requests", href: "/app/admin/requests", icon: AdminRequestsIcon },
	{ id: "users", label: "Users", href: "/app/admin/users", icon: UsersIcon },
	{ id: "settings", label: "Settings", href: "/app/admin/settings", icon: SettingsIcon },
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
	const isOnAdminRoute = pathname.startsWith("/app/admin");

	const tabs = isOnAdminRoute ? ADMIN_TABS : APP_TABS;
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
			<nav
				aria-label={isOnAdminRoute ? "Admin navigation" : "App navigation"}
				className="hidden lg:flex lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-gray-6 lg:bg-gray-1"
			>
				{/* Logo header */}
				<div className="flex h-14 items-center border-b border-gray-6 px-4">
					<Link
						href="/app"
						className="flex items-center gap-2 rounded-md outline-none ring-gray-8 focus-visible:ring-2 focus-visible:ring-offset-2"
					>
						<LomoLogo className="size-7 shrink-0" aria-hidden />
						<span className="font-display text-lg font-semibold text-gray-12">
							{isOnAdminRoute ? "LoMo Admin" : "LoMo"}
						</span>
					</Link>
				</div>

				{/* Back to app link (admin only) */}
				{isOnAdminRoute && (
					<div className="px-3 pt-3">
						<Link
							href="/app"
							className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-11 transition-colors hover:bg-gray-3 hover:text-gray-12"
						>
							<BackIcon className="size-4" />
							<span>Back to app</span>
						</Link>
					</div>
				)}

				{/* Nav tabs */}
				<div role="tablist" aria-label={isOnAdminRoute ? "Admin sections" : "App sections"} className="flex flex-1 flex-col gap-1 p-3">
					{tabs.map(tab => (
						<SidebarTab
							key={tab.id}
							tab={tab}
							isActive={activeTabId === tab.id}
							onTabClick={handleTabClick}
						/>
					))}

					{/* Admin link for non-admin routes */}
					{!isOnAdminRoute && isAdmin && (
						<>
							<div className="my-2 border-t border-gray-6" />
							<Link
								href="/app/admin"
								className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-11 transition-colors hover:bg-gray-3 hover:text-gray-12"
							>
								<AdminIcon className="size-5 text-gray-11" />
								<span>Admin</span>
							</Link>
						</>
					)}
				</div>

				{/* Sign out at the bottom of sidebar */}
				<div className="border-t border-gray-6 p-3">
					<button
						type="button"
						onClick={() => void handleSignOut()}
						className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-11 transition-colors hover:bg-gray-3 hover:text-gray-12"
					>
						<SignOutIcon className="size-5" />
						<span>Sign out</span>
					</button>
				</div>
			</nav>

			{/* Mobile/tablet bottom bar (below lg) */}
			<nav
				aria-label={isOnAdminRoute ? "Admin navigation" : "App navigation"}
				className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-6 bg-gray-1/95 backdrop-blur supports-[backdrop-filter]:bg-gray-1/85 lg:hidden"
			>
				<div role="tablist" aria-label={isOnAdminRoute ? "Admin sections" : "App sections"} className="flex items-center justify-around px-2 py-1">
					{tabs.map(tab => (
						<BottomTab
							key={tab.id}
							tab={tab}
							isActive={activeTabId === tab.id}
							onTabClick={handleTabClick}
						/>
					))}
				</div>
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
	const Icon = tab.icon;

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
			role="tab"
			aria-selected={isActive}
			onClick={handleClick}
			className={[
				"flex items-center gap-3 rounded-lg px-3 py-2.5",
				"min-h-[44px] min-w-[44px]",
				"text-sm font-medium transition-colors",
				"outline-none focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2",
				isActive
					? "bg-gray-4 text-gray-12"
					: "text-gray-11 hover:bg-gray-3 hover:text-gray-12",
			].join(" ")}
		>
			<Icon className={isActive ? "text-gray-12" : "text-gray-11"} />
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
	const Icon = tab.icon;

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
			role="tab"
			aria-selected={isActive}
			onClick={handleClick}
			className={[
				"flex flex-col items-center justify-center gap-0.5",
				"min-h-[44px] min-w-[44px] px-2 py-1",
				"text-xs font-medium transition-colors",
				"outline-none focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2",
				isActive ? "text-gray-12" : "text-gray-11",
			].join(" ")}
		>
			<Icon className={`size-5 ${isActive ? "text-gray-12" : "text-gray-11"}`} />
			<span>{tab.label}</span>
		</Link>
	);
}
