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
	writeStoredHomeMode,
} from "@/lib/app-home-mode";
import {
	HELP_REQUEST_STATUS_LABEL,
	type HelpRequestStatus,
	statusBadgeColor,
} from "@/lib/help-request-status";

export function OfferRequestDetailView() {
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
		api.helpRequests.getAsHelper,
		requestId ? { requestId: requestId as Id<"helpRequests"> } : "skip",
	);

	const acceptRequest = useMutation(api.helpRequests.accept);
	const [accepting, setAccepting] = useState(false);

	function goHomeOffering() {
		writeStoredHomeMode("offer_help");
		router.push("/app");
	}

	async function handleAccept() {
		if (!requestId || !doc) {
			return;
		}
		setAccepting(true);
		try {
			await acceptRequest({ requestId: requestId as Id<"helpRequests"> });
		}
		catch (e) {
			console.error(e);
			window.alert(
				e instanceof Error ? e.message : "Could not accept this request.",
			);
		}
		finally {
			setAccepting(false);
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
					This request isn&apos;t open for you to help with, or it&apos;s no
					longer available.
				</Text>
				<Button variant="outline" onPress={goHomeOffering}>
					Back to open requests
				</Button>
			</div>
		);
	}

	const st = doc.status as HelpRequestStatus;
	const isPending = st === "pending";

	return (
		<div className="flex w-full max-w-lg flex-col gap-6">
			<Button
				variant="ghost"
				color="gray"
				className="self-start px-0"
				onPress={goHomeOffering}
			>
				← Back to open requests
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

			{isPending && (
				<Button
					variant="solid"
					color="sage"
					className="w-full"
					isDisabled={accepting}
					onPress={handleAccept}
				>
					{accepting ? "Accepting…" : "Accept request"}
				</Button>
			)}

			{st === "in_progress" && (
				<CardNotice>
					You&apos;re helping with this request. The requester has been
					notified it&apos;s in progress.
				</CardNotice>
			)}
		</div>
	);
}

function CardNotice({ children }: { children: React.ReactNode }) {
	return (
		<div className="rounded-lg border border-sage-6 bg-sage-2 px-4 py-3">
			<Text size={2} color="gray">
				{children}
			</Text>
		</div>
	);
}
