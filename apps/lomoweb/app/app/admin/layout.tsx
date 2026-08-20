"use client";

import type { ReactNode } from "react";
import { AdminAccessGate } from "./components/AdminAccessGate";
import { AdminErrorBoundary } from "./components/AdminErrorBoundary";
import { AdminNavigation } from "./components/AdminNavigation";
import { ConnectivityIndicator } from "./components/ConnectivityIndicator";
import { NotificationBell } from "./components/NotificationBell";

/**
 * Admin layout shell.
 *
 * Wraps all admin routes with:
 * 1. AdminAccessGate — verifies the user has admin privileges
 * 2. AdminErrorBoundary — catches render errors at the page level
 * 3. Responsive layout structure with semantic landmarks
 * 4. AdminNavigation — four-tab nav (sidebar on lg+, bottom bar below lg)
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<AdminAccessGate>
			<AdminErrorBoundary level="page">
				<div className="flex min-h-screen flex-col bg-surface-warm text-terracotta-9 lg:flex-row">
					{/* Sidebar navigation — desktop (lg+) */}
					<nav
						aria-label="Admin navigation"
						className="hidden lg:flex lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-terracotta-6 lg:bg-white"
					>
						<div className="flex h-14 items-center border-b border-terracotta-6 px-4">
							<span className="font-display text-lg font-semibold text-terracotta-9">
								LoMo Admin
							</span>
						</div>
						<AdminNavigation />
					</nav>

					{/* Main content area */}
					<main className="flex min-h-0 flex-1 flex-col pb-16 lg:pb-0">
						{/* Title bar with notification bell */}
						<header className="flex h-14 items-center justify-between rounded-b-[20px] bg-terracotta-9 px-4">
							<span className="font-display text-lg font-bold text-white">
								LoMo
							</span>
							<NotificationBell />
						</header>

						{/* aria-live region for loading/connectivity announcements */}
						<div aria-live="polite" aria-atomic="true" className="sr-only">
							{/* Connectivity and loading status messages injected here — task 7.4 */}
						</div>

						{/* Connectivity indicator banner */}
						<div className="px-4 pt-3">
							<ConnectivityIndicator />
						</div>

						<AdminErrorBoundary level="section">
							{children}
						</AdminErrorBoundary>
					</main>

					{/* Aside panel slot — used by master-detail layouts (tasks 10.1, 11.1) */}
					{/* Rendered conditionally by child route layouts on lg+ */}

					{/* Bottom navigation — mobile/tablet (below lg) */}
					<nav
						aria-label="Admin navigation"
						className="fixed inset-x-0 bottom-0 z-40 border-t border-terracotta-6 bg-white lg:hidden"
					>
						<AdminNavigation />
					</nav>
				</div>
			</AdminErrorBoundary>
		</AdminAccessGate>
	);
}
