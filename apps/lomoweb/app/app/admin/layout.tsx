"use client";

import type { ReactNode } from "react";
import { AdminAccessGate } from "./components/AdminAccessGate";
import { AdminErrorBoundary } from "./components/AdminErrorBoundary";
import { ConnectivityIndicator } from "./components/ConnectivityIndicator";

/**
 * Admin layout shell.
 *
 * Wraps all admin routes with:
 * 1. AdminAccessGate — verifies the user has admin privileges
 * 2. AdminErrorBoundary — catches render errors at the page level
 * 3. ConnectivityIndicator — shows offline/reconnecting status
 *
 * Navigation is handled by the unified AppSidebar in the parent layout,
 * which automatically switches to admin tabs when on /app/admin routes.
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

					<AdminErrorBoundary level="section">
						{children}
					</AdminErrorBoundary>
				</div>
			</AdminErrorBoundary>
		</AdminAccessGate>
	);
}
