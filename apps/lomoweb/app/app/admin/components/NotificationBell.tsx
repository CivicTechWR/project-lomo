"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import { AdminNotificationsPanel } from "./AdminNotificationsPanel";

function BellIcon({ className }: { className?: string }) {
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
			aria-hidden="true"
		>
			<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
			<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
		</svg>
	);
}

/**
 * Bell icon button with unread notification count badge for the admin title bar.
 * Opens the AdminNotificationsPanel slide-over when clicked.
 */
export function NotificationBell() {
	const [panelOpen, setPanelOpen] = useState(false);
	const unread = useQuery(api.notifications.listForAdmin, { unreadOnly: true });
	const count = unread?.length ?? 0;
	const loading = unread === undefined;

	return (
		<>
			<div className="relative inline-flex">
				<button
					type="button"
					className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-terracotta-9"
					aria-label="Notifications"
					aria-haspopup="dialog"
					aria-expanded={panelOpen}
					onClick={() => setPanelOpen(true)}
				>
					<BellIcon />
				</button>
				{/* aria-live region for screen reader count updates */}
				<span aria-live="polite" aria-atomic="true" className="sr-only">
					{loading
						? "Loading notifications"
						: count > 0
							? `${count} unread notification${count === 1 ? "" : "s"}`
							: "No unread notifications"}
				</span>
				{!loading && count > 0 && (
					<span
						aria-hidden="true"
						className="pointer-events-none absolute -right-0.5 -top-0.5 flex min-w-[1.125rem] items-center justify-center rounded-full bg-red-9 px-1 text-[10px] font-semibold leading-none text-white"
					>
						{count > 99 ? "99+" : count}
					</span>
				)}
			</div>

			<AdminNotificationsPanel
				isOpen={panelOpen}
				onClose={() => setPanelOpen(false)}
			/>
		</>
	);
}
