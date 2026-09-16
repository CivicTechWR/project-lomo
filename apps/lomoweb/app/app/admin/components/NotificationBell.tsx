"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import { Icon } from "@repo/ui/icons";
import { useQuery } from "convex/react";
import { useState } from "react";
import { AdminNotificationsPanel } from "./AdminNotificationsPanel";

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
					className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-gray-11 outline-none transition-colors hover:bg-gray-3 hover:text-gray-12 focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2"
					aria-label="Notifications"
					aria-haspopup="dialog"
					aria-expanded={panelOpen}
					onClick={() => setPanelOpen(true)}
				>
					<Icon name="notifications" className="size-5" />
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
						className="pointer-events-none absolute right-1 top-1 flex min-w-4.5 items-center justify-center rounded-full bg-red-9 px-1 text-[length:var(--text-1)] font-semibold leading-none text-white"
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
