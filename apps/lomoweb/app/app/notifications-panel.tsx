"use client";

import type { Id } from "@repo/convex-backend/convex/_generated/dataModel";
import { Button } from "@repo/ui/button";
import { Text } from "@repo/ui/text";
import Link from "next/link";
import { useState } from "react";
import {
	useAcceptAssignedRequest,
	useDeclineAssignedRequest,
	useRequesterAcceptMatch,
	useRequesterDeclineMatch,
} from "@/lib/hooks/use-help-requests";
import {
	useMarkNotificationRead,
	useMyNotifications,
} from "@/lib/hooks/use-notifications";

export function NotificationsList({ unreadOnly = false }: { unreadOnly?: boolean }) {
	const notifications = useMyNotifications(unreadOnly);
	const markRead = useMarkNotificationRead();
	const acceptAssigned = useAcceptAssignedRequest();
	const declineAssigned = useDeclineAssignedRequest();
	const requesterAcceptMatch = useRequesterAcceptMatch();
	const requesterDeclineMatch = useRequesterDeclineMatch();
	const [busyId, setBusyId] = useState<string | null>(null);
	type NotificationDoc = NonNullable<typeof notifications>[number];

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
										className="inline-flex min-h-8 items-center rounded-1 border border-gray-6 px-3 text-sm"
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
