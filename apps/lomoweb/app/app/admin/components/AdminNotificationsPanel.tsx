"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Icon } from "@repo/ui/icons";
import { Modal, ModalOverlay } from "@repo/ui/modal";
import { Text } from "@repo/ui/text";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface AdminNotificationsPanelProps {
	isOpen: boolean;
	onClose: () => void;
}

/**
 * Slide-over panel from the right listing admin notifications
 * in reverse-chronological order. Provides "Mark all read" action
 * and navigation to the relevant detail view on tap.
 *
 * Uses react-aria ModalOverlay for focus trapping and Escape to dismiss.
 */
export function AdminNotificationsPanel({ isOpen, onClose }: AdminNotificationsPanelProps) {
	const router = useRouter();
	const notifications = useQuery(api.notifications.listForAdmin, {});
	const markAllRead = useMutation(api.notifications.markAllRead);

	const handleMarkAllRead = useCallback(async () => {
		await markAllRead();
	}, [markAllRead]);

	const handleNotificationClick = useCallback((requestId?: string) => {
		if (requestId) {
			router.push(`/app/admin/requests/${requestId}`);
			onClose();
		}
	}, [router, onClose]);

	const loading = notifications === undefined;
	const items = notifications ?? [];
	const hasUnread = items.some(n => !n.isRead);

	return (
		<ModalOverlay
			isOpen={isOpen}
			onOpenChange={(open) => {
				if (!open)
					onClose();
			}}
			isDismissable
			className="place-items-end"
		>
			<Modal
				aria-label="Admin notifications"
				className="ml-auto h-full max-h-[100dvh] w-full max-w-sm animate-in slide-in-from-right duration-200"
			>
				<div className="flex h-full max-h-[100dvh] flex-col overflow-hidden">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-terracotta-6 px-4 py-3">
						<Heading level={2} size={5} className="text-terracotta-9">
							Notifications
						</Heading>
						<div className="flex items-center gap-2">
							{hasUnread && (
								<Button
									variant="ghost"
									color="gray"
									size={1}
									onPress={() => void handleMarkAllRead()}
								>
									Mark all read
								</Button>
							)}
							<Button
								variant="ghost"
								color="gray"
								size={1}
								className="min-h-11 min-w-11"
								aria-label="Close notifications"
								onPress={onClose}
							>
								<Icon name="close" className="size-4.5" />
							</Button>
						</div>
					</div>

					{/* Notification list */}
					<div className="flex-1 overflow-y-auto p-4">
						{loading && (
							<div className="flex flex-col gap-3">
								{Array.from({ length: 3 }).map((_, i) => (
									<div
										// eslint-disable-next-line react/no-array-index-key
										key={i}
										className="h-20 animate-pulse rounded-2 bg-terracotta-3"
									/>
								))}
							</div>
						)}

						{!loading && items.length === 0 && (
							<div className="flex flex-col items-center gap-2 py-8 text-center">
								<Text className="text-terracotta-8">
									No notifications yet.
								</Text>
							</div>
						)}

						{!loading && items.length > 0 && (
							<ul className="flex flex-col gap-3" role="list">
								{items.map(notification => (
									<li key={notification._id}>
										<button
											type="button"
											className={`w-full rounded-2 border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-terracotta-9 focus-visible:ring-offset-2 ${
												notification.isRead
													? "border-terracotta-6 bg-white"
													: "border-terracotta-6 bg-yellow-2"
											} ${notification.requestId ? "cursor-pointer hover:bg-terracotta-2" : ""}`}
											onClick={() => handleNotificationClick(notification.requestId)}
											disabled={!notification.requestId}
											aria-label={`${notification.title}${notification.isRead ? "" : " (unread)"}`}
										>
											<div className="flex flex-col gap-1">
												<div className="flex items-start justify-between gap-2">
													<Text size={3} weight="medium" className="text-terracotta-9">
														{notification.title}
													</Text>
													{!notification.isRead && (
														<span
															aria-hidden="true"
															className="mt-1.5 size-2 shrink-0 rounded-full bg-red-9"
														/>
													)}
												</div>
												<Text size={2} className="text-terracotta-8">
													{notification.body}
												</Text>
												<Text size={1} className="text-terracotta-7">
													{formatRelativeTime(notification._creationTime)}
												</Text>
											</div>
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</Modal>
		</ModalOverlay>
	);
}

/**
 * Formats a timestamp into a human-readable relative time string.
 */
function formatRelativeTime(timestamp: number): string {
	const now = Date.now();
	const diff = now - timestamp;
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (seconds < 60)
		return "Just now";
	if (minutes < 60)
		return `${minutes}m ago`;
	if (hours < 24)
		return `${hours}h ago`;
	if (days < 7)
		return `${days}d ago`;
	return new Date(timestamp).toLocaleDateString();
}
