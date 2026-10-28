"use client";

import type { Id } from "@repo/convex-backend/convex/_generated/dataModel";
import type { HelpRequestStatus } from "@/lib/help-request-status";
import type { RequestCategoryId } from "@/lib/request-flow/types";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { RequestMessagesPanel } from "@/app/app/request-messages-panel";
import {
	HELP_REQUEST_STATUS_LABEL,
	statusBadgeProps,
} from "@/lib/help-request-status";
import { REQUEST_CATEGORIES } from "@/lib/request-flow/categories";
import { isRequestUrgent } from "@/lib/request-urgency";

/** Soft white card matching the homepage How it Works section. */
const softCard
	= "rounded-5 bg-white shadow-brand";

const MATCH_ACCEPT_NOTICE
	= "If you accept, they will see the full details of your request and you will be able to message them directly.";

function helperDisplayName(preview: {
	firstName: string | null;
	pronouns: string | null;
} | null | undefined): string {
	const name = preview?.firstName?.trim();
	const pron = preview?.pronouns?.trim();
	if (name && pron) {
		return `${name} (${pron})`;
	}
	if (name) {
		return name;
	}
	return "Someone";
}

function formatHelperOfferHeading(preview: {
	firstName: string | null;
	pronouns: string | null;
} | null | undefined): string {
	return `${helperDisplayName(preview)} has offered to help with your request`;
}

function formatHelperInProgressHeading(preview: {
	firstName: string | null;
	pronouns: string | null;
} | null | undefined): string {
	return `${helperDisplayName(preview)} is helping with this request`;
}

function canCancelRequest(status: HelpRequestStatus): boolean {
	return (
		status === "pending"
		|| status === "in_progress"
		|| status === "assigned"
		|| status === "awaiting_requester_acceptance"
	);
}

function categoryLabel(category: string): string {
	return REQUEST_CATEGORIES.find(c => c.id === category as RequestCategoryId)?.title
		?? category;
}

function FieldBlock({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="select-none font-display text-xs font-black uppercase tracking-widest text-terracotta-11">
				{label}
			</span>
			<div className="text-black">{children}</div>
		</div>
	);
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

	const offerHelperPreview = useQuery(
		api.helpRequests.getOfferHelperPreview,
		requestId ? { requestId: requestId as Id<"helpRequests"> } : "skip",
	);

	const cancelRequest = useMutation(api.helpRequests.cancel);
	const acceptMatch = useMutation(api.helpRequests.requesterAcceptMatch);
	const declineMatch = useMutation(api.helpRequests.requesterDeclineMatch);
	const markComplete = useMutation(api.helpRequests.markComplete);
	const [cancelling, setCancelling] = useState(false);
	const [updatingMatch, setUpdatingMatch] = useState(false);
	const [completing, setCompleting] = useState(false);

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

	async function handleMarkComplete() {
		if (!requestId) {
			return;
		}
		setCompleting(true);
		try {
			await markComplete({ requestId: requestId as Id<"helpRequests"> });
			router.push("/app");
		}
		catch (e) {
			console.error(e);
			window.alert(
				e instanceof Error ? e.message : "Could not mark this complete.",
			);
		}
		finally {
			setCompleting(false);
		}
	}

	if (!requestId) {
		return (
			<Text size={3} className="text-black/70">
				Missing request.
			</Text>
		);
	}

	if (doc === undefined) {
		return (
			<Text size={3} className="text-black/70">
				Loading…
			</Text>
		);
	}

	if (doc === null) {
		return (
			<div className="flex flex-col gap-4">
				<Text size={3} className="text-black/70">
					This request doesn&apos;t exist or you don&apos;t have access.
				</Text>
				<Button variant="outline" onPress={() => router.push("/app")}>
					Back to requests
				</Button>
			</div>
		);
	}

	const st = doc.status as HelpRequestStatus;
	const showMessages = st === "in_progress";
	const showMatchOffer = st === "awaiting_requester_acceptance";
	const showComplete = st === "in_progress";
	const showCancel = canCancelRequest(st);

	const helperOfferHeading = showMatchOffer
		? formatHelperOfferHeading(offerHelperPreview)
		: null;
	const helperInProgressHeading = showComplete
		? formatHelperInProgressHeading(offerHelperPreview)
		: null;

	const summary = doc.summary?.trim() ?? "";
	const details = doc.details?.trim() ?? "";
	const showSummary = summary.length > 0 && summary !== details;
	const statusBadge = statusBadgeProps(st);

	return (
		<div className="flex w-full max-w-full flex-col gap-6">
			{showMatchOffer
				? (
						<section
							aria-label="Match offer"
							className={`flex flex-col gap-5 p-6 sm:p-7 ${softCard}`}
						>
							<div className="flex flex-col gap-2">
								<Heading
									level={2}
									size={5}
									className="font-display font-extrabold leading-tight text-black"
								>
									{helperOfferHeading}
								</Heading>
								<Text size={3} className="font-medium leading-relaxed text-black/70">
									{MATCH_ACCEPT_NOTICE}
								</Text>
							</div>
							<div className="flex flex-wrap items-stretch gap-2">
								<Button
									variant="solid"
									color="sage"
									size={2}
									border="medium"
									borderColor="sage"
									className="h-10"
									isDisabled={updatingMatch}
									onPress={handleAcceptMatch}
								>
									Accept match
								</Button>
								<Button
									variant="outline"
									color="red"
									size={2}
									border="medium"
									borderColor="red"
									className="h-10"
									isDisabled={updatingMatch}
									onPress={handleDeclineMatch}
								>
									Decline match
								</Button>
							</div>
						</section>
					)
				: null}

			{showComplete
				? (
						<section
							aria-label="Request in progress"
							className={`flex flex-col gap-5 p-6 sm:p-7 ${softCard}`}
						>
							<div className="flex flex-col gap-2">
								<Heading
									level={2}
									size={5}
									className="font-display font-extrabold leading-tight text-black"
								>
									{helperInProgressHeading}
								</Heading>
								<Text size={3} className="font-medium leading-relaxed text-black/70">
									Use messages to coordinate. Please mark the request complete when it's done.
								</Text>
							</div>
							<div className="flex flex-wrap items-stretch gap-2">
								<Button
									variant="solid"
									color="sage"
									size={2}
									border="medium"
									borderColor="sage"
									className="h-10"
									isDisabled={completing}
									onPress={handleMarkComplete}
								>
									{completing ? "Saving…" : "Mark complete"}
								</Button>
							</div>
						</section>
					)
				: null}

			<div
				className={
					showMessages
						? "grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
						: "flex flex-col"
				}
			>
				<div className="flex flex-col gap-4">
					<article className={`flex flex-col overflow-hidden ${softCard}`}>
						<header className="flex flex-col gap-3 px-6 pb-2 pt-6 sm:px-7 sm:pt-7">
							<div className="flex flex-wrap items-start justify-between gap-3">
								<Heading
									level={1}
									size={7}
									className="min-w-0 flex-1 font-display font-black leading-tight text-black"
								>
									{doc.title}
								</Heading>
								<div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
									{isRequestUrgent(doc)
										? (
												<Badge variant="solid" size={2} color="red">
													Urgent
												</Badge>
											)
										: null}
									<Badge
										variant={statusBadge.variant}
										size={2}
										color={statusBadge.color}
										className={statusBadge.className}
									>
										{st === "awaiting_requester_acceptance"
											? "Awaiting confirmation"
											: HELP_REQUEST_STATUS_LABEL[st]}
									</Badge>
								</div>
							</div>
						</header>

						<div className="flex flex-col gap-5 px-6 py-5 sm:px-7">
							<FieldBlock label="Category">
								<Text size={3} className="font-medium">
									{categoryLabel(doc.category)}
								</Text>
							</FieldBlock>

							{showSummary
								? (
										<FieldBlock label="Summary">
											<Text size={3} className="font-medium leading-relaxed text-black/80">
												{summary}
											</Text>
										</FieldBlock>
									)
								: null}

							{details.length > 0
								? (
										<FieldBlock label="Details">
											<Text size={3} className="whitespace-pre-wrap font-medium leading-relaxed text-black/80">
												{details}
											</Text>
										</FieldBlock>
									)
								: null}
						</div>

						{showCancel
							? (
									<footer className="mt-auto flex flex-wrap gap-2 px-6 pb-6 pt-2 sm:px-7 sm:pb-7">
										<Button
											variant="outline"
											color="gray"
											size={1}
											isDisabled={cancelling}
											onPress={handleCancel}
										>
											{cancelling ? "Cancelling…" : "Cancel request"}
										</Button>
									</footer>
								)
							: null}
					</article>

					<Button
						variant="outline"
						color="gray"
						className="self-start"
						onPress={() => router.push("/app")}
					>
						← Back home
					</Button>
				</div>

				{showMessages
					? (
							<RequestMessagesPanel
								requestId={requestId as Id<"helpRequests">}
								className="lg:sticky lg:top-4"
							/>
						)
					: null}
			</div>
		</div>
	);
}
