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
import { useHomeMode } from "@/lib/home-mode-context";
import { REQUEST_CATEGORIES } from "@/lib/request-flow/categories";
import { isRequestUrgent } from "@/lib/request-urgency";

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

function CardNotice({ children }: { children: React.ReactNode }) {
	return (
		<div className="rounded-[max(var(--radius-3),10px)] border-2 border-sage-7 bg-sage-2 px-4 py-3">
			<Text size={2} color="gray">
				{children}
			</Text>
		</div>
	);
}

export function OfferRequestDetailView() {
	const router = useRouter();
	const { setMode } = useHomeMode();
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
	const declineAssigned = useMutation(api.helpRequests.declineAssigned);
	const volunteerOfferHelp = useMutation(api.helpRequests.volunteerOfferHelp);
	const withdrawOffer = useMutation(api.helpRequests.withdrawOffer);
	const markComplete = useMutation(api.helpRequests.markComplete);
	const [accepting, setAccepting] = useState(false);
	const [declining, setDeclining] = useState(false);
	const [offering, setOffering] = useState(false);
	const [withdrawing, setWithdrawing] = useState(false);
	const [completing, setCompleting] = useState(false);

	function goHomeOffering() {
		setMode("home");
		router.push("/app");
	}

	async function handleDecline() {
		if (!requestId || !doc) {
			return;
		}
		setDeclining(true);
		try {
			await declineAssigned({ requestId: requestId as Id<"helpRequests"> });
			goHomeOffering();
		}
		catch (e) {
			console.error(e);
			window.alert(
				e instanceof Error ? e.message : "Could not decline this request.",
			);
		}
		finally {
			setDeclining(false);
		}
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

	async function handleOfferHelp() {
		if (!requestId || !doc) {
			return;
		}
		setOffering(true);
		try {
			await volunteerOfferHelp({ requestId: requestId as Id<"helpRequests"> });
		}
		catch (e) {
			console.error(e);
			window.alert(
				e instanceof Error ? e.message : "Could not send your offer.",
			);
		}
		finally {
			setOffering(false);
		}
	}

	async function handleWithdrawOffer() {
		if (!requestId || !doc) {
			return;
		}
		if (!window.confirm("Withdraw your offer? The request will reopen for others.")) {
			return;
		}
		setWithdrawing(true);
		try {
			await withdrawOffer({ requestId: requestId as Id<"helpRequests"> });
			goHomeOffering();
		}
		catch (e) {
			console.error(e);
			window.alert(
				e instanceof Error ? e.message : "Could not withdraw your offer.",
			);
		}
		finally {
			setWithdrawing(false);
		}
	}

	async function handleMarkComplete() {
		if (!requestId || !doc) {
			return;
		}
		setCompleting(true);
		try {
			await markComplete({ requestId: requestId as Id<"helpRequests"> });
			goHomeOffering();
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
	const isAwaitingVolunteer = st === "assigned";
	const isPendingOpen = st === "pending";
	const showMessages = st === "in_progress";
	const showAwaitingNotice = st === "awaiting_requester_acceptance";
	const showComplete = st === "in_progress";
	const hasActions
		= isPendingOpen
			|| isAwaitingVolunteer
			|| showAwaitingNotice
			|| showComplete;

	const summary = doc.summary?.trim() ?? "";
	const details = doc.details?.trim() ?? "";
	const showSummary = summary.length > 0 && summary !== details;

	return (
		<div className="flex w-full max-w-full flex-col gap-5">
			<Button
				variant="ghost"
				color="gray"
				className="self-start px-0"
				onPress={goHomeOffering}
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

						{showAwaitingNotice
							? (
									<CardNotice>
										Waiting for the requester to confirm the match. Address and
										location stay hidden until then.
									</CardNotice>
								)
							: null}

						{showMessages
							? (
									<CardNotice>
										This request is in progress. You can see the full details above,
										including location.
									</CardNotice>
								)
							: null}
					</div>

					{hasActions
						? (
								<footer className="mt-auto flex flex-col gap-3 border-t-2 border-terracotta-6 bg-terracotta-1/50 px-4 py-4 sm:px-5">
									{isPendingOpen
										? (
												<Button
													variant="solid"
													color="yellow"
													size={2}
													border="large"
													borderColor="terracotta"
													className="w-full"
													isDisabled={offering}
													onPress={handleOfferHelp}
												>
													{offering ? "Sending…" : "I can help"}
												</Button>
											)
										: null}

									{isAwaitingVolunteer
										? (
												<div className="flex flex-col gap-2 sm:flex-row">
													<Button
														variant="solid"
														color="yellow"
														size={2}
														border="large"
														borderColor="terracotta"
														className="min-w-0 flex-1"
														isDisabled={accepting || declining}
														onPress={handleAccept}
													>
														{accepting ? "Accepting…" : "Accept request"}
													</Button>
													<Button
														variant="outline"
														color="red"
														className="min-w-0 flex-1"
														isDisabled={accepting || declining}
														onPress={handleDecline}
													>
														{declining ? "Declining…" : "Decline"}
													</Button>
												</div>
											)
										: null}

									{showAwaitingNotice
										? (
												<Button
													variant="outline"
													color="red"
													className="w-full"
													isDisabled={withdrawing}
													onPress={handleWithdrawOffer}
												>
													{withdrawing ? "Withdrawing…" : "Withdraw offer"}
												</Button>
											)
										: null}

									{showComplete
										? (
												<Button
													variant="solid"
													color="sage"
													size={2}
													border="large"
													className="w-full"
													isDisabled={completing}
													onPress={handleMarkComplete}
												>
													{completing ? "Saving…" : "Mark complete"}
												</Button>
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
