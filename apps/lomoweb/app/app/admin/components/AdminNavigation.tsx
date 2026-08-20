"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * Navigation tab configuration for the admin interface.
 */
const ADMIN_TABS = [
	{
		id: "dashboard",
		label: "Dashboard",
		href: "/app/admin",
		icon: DashboardIcon,
	},
	{
		id: "requests",
		label: "Requests",
		href: "/app/admin/requests",
		icon: RequestsIcon,
	},
	{
		id: "users",
		label: "Users",
		href: "/app/admin/users",
		icon: UsersIcon,
	},
	{
		id: "settings",
		label: "Settings",
		href: "/app/admin/settings",
		icon: SettingsIcon,
	},
] as const;

// --- Icon Components ---

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

function RequestsIcon({ className }: { className?: string }) {
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

// --- Helpers ---

/**
 * Determines which tab is active based on the current pathname.
 * Dashboard matches exactly "/app/admin", others match by prefix.
 */
function getActiveTabId(pathname: string): string {
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
 * AdminNavigation provides the four-tab navigation for the admin interface.
 *
 * Renders as:
 * - Bottom tab bar (fixed) on viewports below lg breakpoint
 * - Sidebar navigation content on lg+ breakpoint
 *
 * Uses react-aria-components ARIA patterns (role="tablist", role="tab",
 * aria-selected, aria-controls) for full accessibility.
 *
 * Requirements: 1.1, 1.2, 1.3, 1.5, 14.1, 14.3, 15.2, 15.3, 15.12, 15.13
 */
export function AdminNavigation() {
	const pathname = usePathname() ?? "/app/admin";
	const activeTabId = getActiveTabId(pathname);

	const handleTabClick = useCallback(
		(tabId: string) => {
			// Scroll-to-top when re-tapping the active tab (Req 1.5)
			if (tabId === activeTabId) {
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		},
		[activeTabId],
	);

	return (
		<>
			{/* Desktop sidebar navigation (lg+) */}
			<div
				role="tablist"
				aria-label="Admin sections"
				className="hidden lg:flex lg:flex-col lg:gap-1 lg:p-3"
			>
				{ADMIN_TABS.map(tab => (
					<NavTab
						key={tab.id}
						tab={tab}
						isActive={activeTabId === tab.id}
						variant="sidebar"
						onTabClick={handleTabClick}
					/>
				))}
			</div>

			{/* Mobile/tablet bottom bar (below lg) */}
			<div
				role="tablist"
				aria-label="Admin sections"
				className="flex items-center justify-around px-2 py-1 lg:hidden"
			>
				{ADMIN_TABS.map(tab => (
					<NavTab
						key={tab.id}
						tab={tab}
						isActive={activeTabId === tab.id}
						variant="bottom"
						onTabClick={handleTabClick}
					/>
				))}
			</div>
		</>
	);
}

// --- NavTab Component ---

interface NavTabProps {
	tab: (typeof ADMIN_TABS)[number];
	isActive: boolean;
	variant: "sidebar" | "bottom";
	onTabClick: (tabId: string) => void;
}

function NavTab({ tab, isActive, variant, onTabClick }: NavTabProps) {
	const Icon = tab.icon;

	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			if (isActive) {
				// Prevent navigation, just scroll to top
				e.preventDefault();
				onTabClick(tab.id);
			}
		},
		[isActive, onTabClick, tab.id],
	);

	if (variant === "sidebar") {
		return (
			<Link
				href={tab.href}
				role="tab"
				aria-selected={isActive}
				aria-controls={`tabpanel-${tab.id}`}
				onClick={handleClick}
				className={[
					"flex items-center gap-3 rounded-lg px-3 py-2.5",
					"min-h-[44px] min-w-[44px]",
					"text-sm font-medium transition-colors",
					"outline-none focus-visible:ring-2 focus-visible:ring-[#F3C600] focus-visible:ring-offset-2",
					isActive
						? "bg-[#F3C600]/10 text-[#F3C600]"
						: "text-terracotta-9 hover:bg-terracotta-3",
				].join(" ")}
			>
				<Icon className={isActive ? "text-[#F3C600]" : "text-terracotta-9"} />
				<span>{tab.label}</span>
			</Link>
		);
	}

	// Bottom bar variant
	return (
		<Link
			href={tab.href}
			role="tab"
			aria-selected={isActive}
			aria-controls={`tabpanel-${tab.id}`}
			onClick={handleClick}
			className={[
				"flex flex-col items-center justify-center gap-0.5",
				"min-h-[44px] min-w-[44px] px-2 py-1",
				"text-xs font-medium transition-colors",
				"outline-none focus-visible:ring-2 focus-visible:ring-[#F3C600] focus-visible:ring-offset-2",
				isActive ? "text-[#F3C600]" : "text-terracotta-9",
			].join(" ")}
		>
			<Icon className={isActive ? "text-[#F3C600]" : "text-terracotta-9"} />
			<span>{tab.label}</span>
		</Link>
	);
}
