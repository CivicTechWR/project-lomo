"use client";

import type { ReactNode } from "react";
import { AdminAccessGate } from "./components/AdminAccessGate";
import { AdminErrorBoundary } from "./components/AdminErrorBoundary";
import { ConnectivityIndicator } from "./components/ConnectivityIndicator";
import { NotificationBell } from "./components/NotificationBell";

/**
 * Admin layout shell.
 *
 * Wraps all admin routes with:
 * 1. AdminAccessGate — verifies the user has admin privileges
 * 2. AdminErrorBoundary — catches render errors at the page level
 * 3. ConnectivityIndicator — shows offline/reconnecting status
 * 4. A utility bar carrying the admin notification bell
 *
 * Navigation is handled by the unified AppSidebar in the parent layout,
 * which automatically switches to admin tabs when on /app/admin routes.
 *
 * The notification bell lives here rather than in AppSidebar because it opens a
 * slide-over rather than navigating, so it doesn't belong among the nav links —
 * and placing it in the layout keeps it reachable at every breakpoint, whereas
 * the sidebar collapses to a bottom tab bar on small screens.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<AdminAccessGate>
			<AdminErrorBoundary level="page">
				<div className="flex min-h-0 flex-1 flex-col">
					{/* aria-live region for loading/connectivity announcements */}
					<div aria-live="polite" aria-atomic="true" className="sr-only">
						{/* Connectivity and loading status messages injected here */}
					</div>

					{/* Connectivity indicator banner — only visible when offline/reconnecting */}
					<ConnectivityIndicator />

					{/*
					  Admin utility bar. Each admin page owns its own <h1>, so this bar
					  carries only chrome-level actions and is labelled rather than titled.
					*/}
					<div
						role="toolbar"
						aria-label="Admin tools"
						className="flex shrink-0 items-center justify-end border-b border-gray-6 px-4 py-1"
					>
						<NotificationBell />
					</div>

					<AdminErrorBoundary level="section">
						{children}
					</AdminErrorBoundary>
				</div>
			</AdminErrorBoundary>
		</AdminAccessGate>
	);
}
