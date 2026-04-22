"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import type { Id } from "@repo/convex-backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PANEL_MAX_WIDTH_PX = 22 * 16;
const VIEW_MARGIN_PX = 10;
const PANEL_GAP_PX = 6;

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
			aria-hidden
		>
			<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
			<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
		</svg>
	);
}

function computePanelBox(trigger: HTMLElement): { top: number; left: number; width: number } {
	const rect = trigger.getBoundingClientRect();
	const width = Math.min(
		PANEL_MAX_WIDTH_PX,
		window.innerWidth - 2 * VIEW_MARGIN_PX,
	);
	let left = rect.right - width;
	if (left < VIEW_MARGIN_PX) {
		left = VIEW_MARGIN_PX;
	}
	if (left + width > window.innerWidth - VIEW_MARGIN_PX) {
		left = Math.max(VIEW_MARGIN_PX, window.innerWidth - VIEW_MARGIN_PX - width);
	}
	return {
		top: rect.bottom + PANEL_GAP_PX,
		left,
		width,
	};
}

export function NotificationsDropdown() {
	const menuId = useId();
	const buttonWrapRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);
	const [panelBox, setPanelBox] = useState<{ top: number; left: number; width: number } | null>(
		null,
	);
	const pathname = usePathname();

	const notifications = useQuery(api.notifications.listMine, { unreadOnly: true });
	const markRead = useMutation(api.notifications.markRead);
	const acceptAssigned = useMutation(api.helpRequests.accept);
	const declineAssigned = useMutation(api.helpRequests.declineAssigned);
	const requesterAcceptMatch = useMutation(api.helpRequests.requesterAcceptMatch);
	const requesterDeclineMatch = useMutation(api.helpRequests.requesterDeclineMatch);
	const [busyId, setBusyId] = useState<string | null>(null);
	type NotificationDoc = NonNullable<typeof notifications>[number];

	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	function syncPanelPosition() {
		const el = buttonWrapRef.current;
		if (!el || !open) {
			return;
		}
		setPanelBox(computePanelBox(el));
	}

	useLayoutEffect(() => {
		if (!open) {
			setPanelBox(null);
			return;
		}
		syncPanelPosition();
		window.addEventListener("resize", syncPanelPosition);
		window.addEventListener("scroll", syncPanelPosition, true);
		return () => {
			window.removeEventListener("resize", syncPanelPosition);
			window.removeEventListener("scroll", syncPanelPosition, true);
		};
	}, [open]);

	useEffect(() => {
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
		setBusyId(n._id);
		try {
			if (n.ctaAction === "open_offer_request") {
				if (action === "accept") {
					await acceptAssigned({ requestId: n.requestId as Id<"helpRequests"> });
				}
				else {
					await declineAssigned({ requestId: n.requestId as Id<"helpRequests"> });
				}
			}
			if (n.ctaAction === "open_request") {
				if (action === "accept") {
					await requesterAcceptMatch({ requestId: n.requestId as Id<"helpRequests"> });
				}
				else {
					await requesterDeclineMatch({ requestId: n.requestId as Id<"helpRequests"> });
				}
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

	const count = notifications?.length ?? 0;
	const loading = notifications === undefined;

	const panel
		= open
			&& panelBox
			&& typeof document !== "undefined"
			&& createPortal(
				<div
					ref={panelRef}
					id={menuId}
					role="region"
					aria-label="Notifications"
					className={
						"flex max-h-[min(70vh,28rem)] flex-col overflow-hidden rounded-lg "
						+ "border border-gray-6 bg-gray-1 shadow-lg"
					}
					style={{
						position: "fixed",
						top: panelBox.top,
						left: panelBox.left,
						width: panelBox.width,
						zIndex: 80,
					}}
				>
					<div className="border-b border-gray-6 px-3 py-2">
						<Heading level={2} size={4}>
							Notifications
						</Heading>
					</div>
					<div className="min-h-0 flex-1 overflow-y-auto p-2">
						{loading && (
							<Text size={2} color="gray" className="px-2 py-3">
								Loading…
							</Text>
						)}
						{!loading && count === 0 && (
							<Text size={2} color="gray" className="px-2 py-3">
								No unread notifications. You&apos;re all caught up.
							</Text>
						)}
						{!loading && count > 0 && (
							<ul className="flex flex-col gap-2">
								{notifications!.map(n => (
									<li key={n._id}>
										<div className="rounded-lg border border-amber-6 bg-amber-2 p-3">
											<div className="flex min-w-0 flex-col gap-1">
												<Text size={3} weight="medium">{n.title}</Text>
												<Text size={2}>{n.body}</Text>
											</div>
											<div className="mt-2 flex flex-wrap gap-2">
												{n.requestId && n.ctaAction === "open_offer_request" && (
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
														<Link
															href={`/app/offer/${n.requestId}`}
															className="inline-flex min-h-8 items-center rounded-md border border-gray-6 px-3 text-sm"
															onClick={() => setOpen(false)}
														>
															Open
														</Link>
													</>
												)}
												{n.requestId && n.ctaAction === "open_request" && (
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
														<Link
															href={`/app/requests/${n.requestId}`}
															className="inline-flex min-h-8 items-center rounded-md border border-gray-6 px-3 text-sm"
															onClick={() => setOpen(false)}
														>
															Open
														</Link>
													</>
												)}
												{n.requestId
													&& (n.ctaAction === "open_request_thread"
														|| n.ctaAction === "open_offer_thread") && (
													<>
														<Link
															href={
																n.ctaAction === "open_request_thread"
																	? `/app/requests/${n.requestId}`
																	: `/app/offer/${n.requestId}`
															}
															className="inline-flex min-h-8 items-center rounded-md border border-gray-6 px-3 text-sm"
															onClick={() => setOpen(false)}
														>
															{n.ctaLabel ?? "Open conversation"}
														</Link>
														<Button
															size={1}
															variant="outline"
															color="gray"
															isDisabled={busyId === n._id}
															onPress={() => void markRead({ notificationId: n._id })}
														>
															Mark read
														</Button>
													</>
												)}
												{(!n.requestId || !n.ctaAction) && (
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
									</li>
								))}
							</ul>
						)}
					</div>
				</div>,
				document.body,
			);

	return (
		<div ref={buttonWrapRef} className="inline-flex">
			<Button
				variant="ghost"
				color="gray"
				size={1}
				className="relative min-h-9 min-w-9 px-2"
				aria-expanded={open}
				aria-haspopup="true"
				aria-controls={open ? menuId : undefined}
				onPress={() => setOpen(o => !o)}
			>
				<span className="sr-only">Notifications</span>
				<BellIcon className="text-gray-11" />
				{!loading && count > 0 && (
					<span className="absolute -right-0.5 -top-0.5 flex min-w-[1.125rem] items-center justify-center rounded-full bg-amber-9 px-1 text-[10px] font-semibold leading-none text-gray-1">
						{count > 9 ? "9+" : count}
					</span>
				)}
			</Button>
			{panel}
		</div>
	);
}
