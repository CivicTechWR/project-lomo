"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import type { Id } from "@repo/convex-backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Button } from "@repo/ui/button";
import { Text } from "@repo/ui/text";
import Link from "next/link";
import { useState } from "react";

export function NotificationsPanel() {
	const notifications = useQuery(api.notifications.listMine, { unreadOnly: true });
	const markRead = useMutation(api.notifications.markRead);
	const acceptAssigned = useMutation(api.helpRequests.accept);
	const declineAssigned = useMutation(api.helpRequests.declineAssigned);
	const requesterAcceptMatch = useMutation(api.helpRequests.requesterAcceptMatch);
	const requesterDeclineMatch = useMutation(api.helpRequests.requesterDeclineMatch);
	const [busyId, setBusyId] = useState<string | null>(null);
	type NotificationDoc = NonNullable<typeof notifications>[number];

	if (!notifications || notifications.length === 0) {
		return null;
	}

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

	return (
		<div className="mb-6 flex flex-col gap-3">
			{notifications.map(n => (
				<div key={n._id} className="rounded-lg border border-amber-6 bg-amber-2 p-4">
					<Text size={3} weight="medium">{n.title}</Text>
					<Text size={2} className="mt-1">{n.body}</Text>
					<div className="mt-3 flex flex-wrap gap-2">
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
								>
									Open
								</Link>
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
			))}
		</div>
	);
}
