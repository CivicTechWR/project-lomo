"use client";

import type { Id } from "@repo/convex-backend/convex/_generated/dataModel";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Button } from "@repo/ui/button";
import { Text } from "@repo/ui/text";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function MailIcon({ className }: { className?: string }) {
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
			<rect x="2" y="4" width="20" height="16" rx="2" />
			<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
		</svg>
	);
}

/** Icon button linking to the notifications page, with unread badge. */
export function NotificationsNavButton() {
	const unread = useQuery(api.notifications.listMine, { unreadOnly: true });
	const count = unread?.length ?? 0;
	const loading = unread === undefined;

	return (
		<Link
			href="/app/notifications"
			className={
				"relative inline-flex min-h-9 min-w-9 items-center justify-center rounded-[max(var(--radius-2),var(--radius-full))] "
				+ "text-gray-11 outline-none transition-colors hover:bg-gray-3 focus-visible:ring-2 "
				+ "focus-visible:ring-gray-8 focus-visible:ring-offset-2"
			}
			aria-label={
				!loading && count > 0
					? `Notifications, ${count} unread`
					: "Notifications"
			}
		>
			<MailIcon />
			{!loading && count > 0 && (
				<span className="absolute -right-0.5 -top-0.5 flex min-w-[1.125rem] items-center justify-center rounded-full bg-red-9 px-1 text-[10px] font-semibold leading-none text-white">
					{count > 9 ? "9+" : count}
				</span>
			)}
		</Link>
	);
}

export function NotificationsList({ unreadOnly = false }: { unreadOnly?: boolean }) {
	const notifications = useQuery(api.notifications.listMine, { unreadOnly });
	const markRead = useMutation(api.notifications.markRead);
	const acceptAssigned = useMutation(api.helpRequests.accept);
	const declineAssigned = useMutation(api.helpRequests.declineAssigned);
	const requesterAcceptMatch = useMutation(api.helpRequests.requesterAcceptMatch);
	const requesterDeclineMatch = useMutation(api.helpRequests.requesterDeclineMatch);
	const [busyId, setBusyId] = useState<string | null>(null);
	type NotificationDoc = NonNullable<typeof notifications>[number];

	// Close the panel whenever the route changes.
	const prevPathnameRef = useRef(pathname);
	if (pathname !== prevPathnameRef.current) {
		prevPathnameRef.current = pathname;
		if (open) {
			setOpen(false);
		}
	}

	// Compute initial panel position synchronously when opening to avoid flicker.
	// Subsequent updates (resize/scroll) are handled by event listeners in the effect below.
	const prevOpenRef = useRef(open);
	if (open && !prevOpenRef.current && buttonWrapRef.current) {
		setPanelBox(computePanelBox(buttonWrapRef.current));
	}
	prevOpenRef.current = open;

	useLayoutEffect(() => {
		if (!open) {
			return;
		}
		const handleSync = () => {
			const btn = buttonWrapRef.current;
			if (!btn) {
				return;
			}
			setPanelBox(computePanelBox(btn));
		};
		window.addEventListener("resize", handleSync);
		window.addEventListener("scroll", handleSync, true);
		return () => {
			window.removeEventListener("resize", handleSync);
			window.removeEventListener("scroll", handleSync, true);
		};
	}, [open]);

	useLayoutEffect(() => {
		if (!open) {
			return;
		}
		function onPointerDown(e: PointerEvent) {
			const t = e.target as Node;
			if (buttonWrapRef.current?.contains(t) || panelRef.current?.contains(t)) {
				return;
			}
			setOpen(false);
		}
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				setOpen(false);
			}
		}
		document.addEventListener("pointerdown", onPointerDown, true);
		document.addEventListener("keydown", onKeyDown, true);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown, true);
			document.removeEventListener("keydown", onKeyDown, true);
		};
	}, [open]);

	async function handleAction(n: NotificationDoc, action: "accept" | "decline") {
		if (!n.requestId) {
			await markRead({ notificationId: n._id });
			return;
		}
		if (n.isStale) {
			await markRead({ notificationId: n._id });
			return;
		}
		setBusyId(n._id);
		try {
			if (n.canVolunteerAcceptAssignment) {
				if (action === "accept") {
					await acceptAssigned({ requestId: n.requestId as Id<"helpRequests"> });
				}
				else {
					await declineAssigned({ requestId: n.requestId as Id<"helpRequests"> });
				}
			}
			else if (n.canRequesterReviewOffer) {
				if (action === "accept") {
					await requesterAcceptMatch({ requestId: n.requestId as Id<"helpRequests"> });
				}
				else {
					await requesterDeclineMatch({ requestId: n.requestId as Id<"helpRequests"> });
				}
			}
			else {
				await markRead({ notificationId: n._id });
				return;
			}
			await markRead({ notificationId: n._id });
		}
		catch (e) {
			console.error(e);
			window.alert(e instanceof Error ? e.message : "Action failed.");
		}
		finally {
			setBusyId(null);
		}
	}

	const loading = notifications === undefined;
	const count = notifications?.length ?? 0;

	if (loading) {
		return (
			<Text size={2} color="gray">
				Loading…
			</Text>
		);
	}

	if (count === 0) {
		return (
			<Text size={2} color="gray">
				{unreadOnly
					? "No unread notifications. You're all caught up."
					: "No notifications yet."}
			</Text>
		);
	}

	return (
		<ul className="flex flex-col gap-3">
			{notifications.map(n => (
				<li key={n._id}>
					<div
						className={
							n.isRead
								? "rounded-[max(var(--radius-3),12px)] border border-gray-6 bg-gray-2 p-4"
								: "rounded-[max(var(--radius-3),12px)] border border-amber-6 bg-amber-2 p-4"
						}
					>
						<div className="flex min-w-0 flex-col gap-1">
							<Text size={3} weight="medium">{n.title}</Text>
							<Text size={2}>{n.body}</Text>
						</div>
						<div className="mt-3 flex flex-col gap-2">
							{n.isStale && (
								<Text size={1} color="gray">
									This request was updated. Open it for the latest status.
								</Text>
							)}
							<div className="flex flex-wrap gap-2">
								{n.canVolunteerAcceptAssignment && (
									<>
										<Button
											size={1}
											variant="solid"
											color="sage"
											isDisabled={busyId === n._id}
											onPress={() => handleAction(n, "accept")}
										>
											Accept
										</Button>
										<Button
											size={1}
											variant="outline"
											color="red"
											isDisabled={busyId === n._id}
											onPress={() => handleAction(n, "decline")}
										>
											Decline
										</Button>
									</>
								)}
								{n.canRequesterReviewOffer && (
									<>
										<Button
											size={1}
											variant="solid"
											color="sage"
											isDisabled={busyId === n._id}
											onPress={() => handleAction(n, "accept")}
										>
											Accept match
										</Button>
										<Button
											size={1}
											variant="outline"
											color="red"
											isDisabled={busyId === n._id}
											onPress={() => handleAction(n, "decline")}
										>
											Decline
										</Button>
									</>
								)}
								{n.openPath && (
									<Link
										href={n.openPath}
										className="inline-flex min-h-8 items-center rounded-md border border-gray-6 px-3 text-sm"
									>
										{n.ctaLabel ?? "Open"}
									</Link>
								)}
								{!n.isRead && (
									<Button
										size={1}
										variant="outline"
										color="gray"
										isDisabled={busyId === n._id}
										onPress={() => void markRead({ notificationId: n._id })}
									>
										Mark read
									</Button>
								)}
							</div>
						</div>
					</div>
				</li>
			))}
		</ul>
	);
}
