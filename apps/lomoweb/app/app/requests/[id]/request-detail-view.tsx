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
	statusBadgeColor,
} from "@/lib/help-request-status";
import { REQUEST_CATEGORIES } from "@/lib/request-flow/categories";
import { isRequestUrgent } from "@/lib/request-urgency";

function formatHelperIntro(preview: {
	firstName: string | null;
	pronouns: string | null;
}): string {
	const name = preview.firstName?.trim();
	const pron = preview.pronouns?.trim();
	const tail
		= " offered to help with your request. If you accept, they will see your full details, including location.";
	if (name && pron) {
		return `${name} (${pron})${tail}`;
	}
	if (name) {
		return `${name}${tail}`;
	}
	return `Someone${tail}`;
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
			<Text size={1} weight="medium" className="uppercase tracking-wide text-gray-10">
				{label}
			</Text>
			<div className="text-gray-12">{children}</div>
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
	const showMessages = st === "in_progress";
	const showMatchActions = st === "awaiting_requester_acceptance";
	const showComplete = st === "in_progress";
	const showCancel = canCancelRequest(st);
	const hasActions = showMatchActions || showComplete || showCancel;

	const helperIntro
		= showMatchActions && offerHelperPreview
			? formatHelperIntro(offerHelperPreview)
			: null;

	const summary = doc.summary?.trim() ?? "";
	const details = doc.details?.trim() ?? "";
	const showSummary = summary.length > 0 && summary !== details;

	return (
		<div className="flex w-full max-w-full flex-col gap-5">
			<Button
				variant="ghost"
				color="gray"
				className="self-start px-0"
				onPress={() => router.push("/app")}
			>
				← Back to home
			</Button>

			<div
				className={
					showMessages
						? "grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6"
						: "flex flex-col"
				}
			>
				<article className="flex flex-col overflow-hidden rounded-[max(var(--radius-4),12px)] border-2 border-terracotta-9 bg-white shadow-brand">
					<header className="flex flex-col gap-3 border-b-2 border-terracotta-6 px-4 py-4 sm:px-5 sm:py-5">
						<div className="flex flex-wrap items-start justify-between gap-3">
							<Heading level={1} size={7} className="min-w-0 flex-1 text-gray-12">
								{doc.title}
							</Heading>
							<div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
								{isRequestUrgent(doc)
									? (
											<Badge variant="soft" size={2} color="red">
												Urgent
											</Badge>
										)
									: null}
								<Badge
									variant="soft"
									size={2}
									color={statusBadgeColor(st)}
								>
									{st === "awaiting_requester_acceptance"
										? "Awaiting confirmation"
										: HELP_REQUEST_STATUS_LABEL[st]}
								</Badge>
							</div>
						</div>
					</header>

					<div className="flex flex-col gap-5 px-4 py-5 sm:px-5">
						<FieldBlock label="Category">
							<Text size={3}>{categoryLabel(doc.category)}</Text>
						</FieldBlock>

						{showSummary
							? (
									<FieldBlock label="Summary">
										<Text size={3}>{summary}</Text>
									</FieldBlock>
								)
							: null}

						{details.length > 0
							? (
									<FieldBlock label="Details">
										<Text size={3} className="whitespace-pre-wrap leading-relaxed">
											{details}
										</Text>
									</FieldBlock>
								)
							: null}

						{st === "in_progress" && doc.helperUserId
							? (
									<div className="rounded-[max(var(--radius-3),10px)] border-2 border-sage-7 bg-sage-2 px-4 py-3">
										<Text size={2} color="gray">
											A community member is helping with this request. Use messages
											to coordinate.
										</Text>
									</div>
								)
							: null}

						{helperIntro
							? (
									<div className="rounded-[max(var(--radius-3),10px)] border-2 border-sage-7 bg-sage-2 px-4 py-3">
										<Text size={2} color="gray">
											{helperIntro}
										</Text>
									</div>
								)
							: null}
					</div>

					{hasActions
						? (
								<footer className="mt-auto flex flex-col gap-3 border-t-2 border-terracotta-6 bg-terracotta-1/50 px-4 py-4 sm:px-5">
									{showMatchActions
										? (
												<div className="flex flex-col gap-2 sm:flex-row">
													<Button
														variant="solid"
														color="yellow"
														size={2}
														border="large"
														borderColor="terracotta"
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
											)
										: null}

									{showComplete || showCancel
										? (
												<div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
													{showComplete
														? (
																<Button
																	variant="solid"
																	color="sage"
																	size={2}
																	border="large"
																	className="min-w-0 sm:flex-1"
																	isDisabled={completing}
																	onPress={handleMarkComplete}
																>
																	{completing ? "Saving…" : "Mark complete"}
																</Button>
															)
														: null}
													{showCancel
														? (
																<Button
																	variant="outline"
																	color="red"
																	className="min-w-0 sm:flex-1"
																	isDisabled={cancelling}
																	onPress={handleCancel}
																>
																	{cancelling ? "Cancelling…" : "Cancel request"}
																</Button>
															)
														: null}
												</div>
											)
										: null}
								</footer>
							)
						: null}
				</article>

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
