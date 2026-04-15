"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import type { Id } from "@repo/convex-backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
	HELP_REQUEST_STATUS_LABEL,
	type HelpRequestStatus,
	statusBadgeColor,
} from "@/lib/help-request-status";

function canCancelRequest(status: HelpRequestStatus): boolean {
	return status === "pending" || status === "in_progress";
}

export function RequestDetailView() {
	const router = useRouter();
	const params = useParams();
	const rawId = params.id;
	const requestId
		= typeof rawId === "string"
			? rawId
			: Array.isArray(rawId)
				? rawId[0]
				: undefined;

	const doc = useQuery(
		api.helpRequests.get,
		requestId ? { requestId: requestId as Id<"helpRequests"> } : "skip",
	);

	const cancelRequest = useMutation(api.helpRequests.cancel);
	const acceptMatch = useMutation(api.helpRequests.requesterAcceptMatch);
	const declineMatch = useMutation(api.helpRequests.requesterDeclineMatch);
	const [cancelling, setCancelling] = useState(false);
	const [updatingMatch, setUpdatingMatch] = useState(false);

	async function handleCancel() {
		if (!requestId || !doc) {
			return;
		}
		if (!canCancelRequest(doc.status as HelpRequestStatus)) {
			return;
		}
		if (!window.confirm("Cancel this request? This can’t be undone.")) {
			return;
		}
		setCancelling(true);
		try {
			await cancelRequest({ requestId: requestId as Id<"helpRequests"> });
			router.push("/app");
		}
		catch (e) {
			console.error(e);
			window.alert(
				e instanceof Error ? e.message : "Could not cancel the request.",
			);
		}
		finally {
			setCancelling(false);
		}
	}

	async function handleAcceptMatch() {
		if (!requestId) {
			return;
		}
		setUpdatingMatch(true);
		try {
			await acceptMatch({ requestId: requestId as Id<"helpRequests"> });
		}
		catch (e) {
			console.error(e);
			window.alert(
				e instanceof Error ? e.message : "Could not accept the match.",
			);
		}
		finally {
			setUpdatingMatch(false);
		}
	}

	async function handleDeclineMatch() {
		if (!requestId) {
			return;
		}
		setUpdatingMatch(true);
		try {
			await declineMatch({ requestId: requestId as Id<"helpRequests"> });
			router.push("/app");
		}
		catch (e) {
			console.error(e);
			window.alert(
				e instanceof Error ? e.message : "Could not decline the match.",
			);
		}
		finally {
			setUpdatingMatch(false);
		}
	}

	if (!requestId) {
		return (
			<Text size={3} color="gray">
				Missing request.
			</Text>
		);
	}

	if (doc === undefined) {
		return (
			<Text size={3} color="gray">
				Loading…
			</Text>
		);
	}

	if (doc === null) {
		return (
			<div className="flex flex-col gap-4">
				<Text size={3} color="gray">
					This request doesn&apos;t exist or you don&apos;t have access.
				</Text>
				<Button variant="outline" onPress={() => router.push("/app")}>
					Back to requests
				</Button>
			</div>
		);
	}

	const st = doc.status as HelpRequestStatus;

	return (
		<div className="flex w-full max-w-lg flex-col gap-6">
			<Button
				variant="ghost"
				color="gray"
				className="self-start px-0"
				onPress={() => router.push("/app")}
			>
				← Back to requests
			</Button>

			<div className="flex flex-wrap items-start justify-between gap-3">
				<Heading level={1} size={7} className="min-w-0 flex-1">
					{doc.title}
				</Heading>
				<Badge
					variant="soft"
					size={2}
					color={statusBadgeColor(st)}
				>
					{HELP_REQUEST_STATUS_LABEL[st]}
				</Badge>
			</div>

			<Text size={2} color="gray">
				Category: {doc.category}
			</Text>

			<div className="rounded-lg border border-gray-6 bg-gray-1 p-4">
				<Text size={2} className="whitespace-pre-wrap">
					{doc.details}
				</Text>
			</div>

			{st === "in_progress" && doc.helperSubject && (
				<Text size={2} color="gray">
					A community member has accepted your request and is helping out.
				</Text>
			)}

			{st === "awaiting_requester_acceptance" && (
				<div className="flex gap-3">
					<Button
						variant="solid"
						color="sage"
						className="min-w-0 flex-1"
						isDisabled={updatingMatch}
						onPress={handleAcceptMatch}
					>
						Accept match
					</Button>
					<Button
						variant="outline"
						color="red"
						className="min-w-0 flex-1"
						isDisabled={updatingMatch}
						onPress={handleDeclineMatch}
					>
						Decline match
					</Button>
				</div>
			)}

			{canCancelRequest(st) && (
				<Button
					variant="outline"
					color="red"
					className="w-full"
					isDisabled={cancelling}
					onPress={handleCancel}
				>
					{cancelling ? "Cancelling…" : "Cancel request"}
				</Button>
			)}
		</div>
	);
}
