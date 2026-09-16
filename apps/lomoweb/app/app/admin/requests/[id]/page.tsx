"use client";

import type { Id } from "@repo/convex-backend/convex/_generated/dataModel";
import type { HelpRequestStatus } from "../../lib/filters";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Heading } from "@repo/ui/heading";
import { DialogTrigger, Modal, ModalOverlay } from "@repo/ui/modal";
import { Text } from "@repo/ui/text";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                          RequestDetailSkeleton                               */
/* -------------------------------------------------------------------------- */

function RequestDetailSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			{/* Header skeleton */}
			<div className="flex items-center gap-3">
				<div className="h-10 w-10 animate-pulse rounded-full bg-terracotta-3" />
				<div className="flex-1">
					<div className="h-6 w-3/4 animate-pulse rounded bg-terracotta-3" />
					<div className="mt-2 flex gap-2">
						<div className="h-5 w-20 animate-pulse rounded-full bg-terracotta-3" />
						<div className="h-5 w-16 animate-pulse rounded-full bg-terracotta-3" />
					</div>
				</div>
			</div>

			{/* Details skeleton */}
			<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
				<div className="h-4 w-full animate-pulse rounded bg-terracotta-3" />
				<div className="mt-3 h-4 w-5/6 animate-pulse rounded bg-terracotta-3" />
				<div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-terracotta-3" />
				<div className="mt-4 h-3 w-40 animate-pulse rounded bg-terracotta-3" />
			</Card>

			{/* Person cards skeleton */}
			<div className="grid gap-4 sm:grid-cols-2">
				{["requester-skel", "helper-skel"].map(key => (
					<Card key={key} border="medium" borderColor="terracotta" size={2} className="rounded-4">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 animate-pulse rounded-full bg-terracotta-3" />
							<div className="flex-1">
								<div className="h-4 w-28 animate-pulse rounded bg-terracotta-3" />
								<div className="mt-2 h-3 w-36 animate-pulse rounded bg-terracotta-3" />
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                         Status & Urgency Badges                              */
/* -------------------------------------------------------------------------- */

const STATUS_LABEL: Record<HelpRequestStatus, string> = {
	pending: "Pending",
	assigned: "Assigned",
	awaiting_requester_acceptance: "Awaiting Acceptance",
	in_progress: "In Progress",
	complete: "Completed",
	cancelled: "Cancelled",
};

const STATUS_BADGE_VARIANT: Record<HelpRequestStatus, "sage" | "yellow" | "gray" | "red"> = {
	pending: "gray",
	assigned: "yellow",
	awaiting_requester_acceptance: "yellow",
	in_progress: "sage",
	complete: "sage",
	cancelled: "red",
};

function StatusBadge({ status }: { status: HelpRequestStatus }) {
	return (
		<Badge
			variant="soft"
			color={STATUS_BADGE_VARIANT[status]}
			size={2}
		>
			{STATUS_LABEL[status]}
		</Badge>
	);
}

/* -------------------------------------------------------------------------- */
/*                             PersonCard                                       */
/* -------------------------------------------------------------------------- */

interface PersonSummary {
	_id: string;
	name: string | null;
	email: string | null;
	firstName: string | null;
	pronouns: string | null;
}

function PersonCard({
	label,
	person,
	emptyText,
}: {
	label: string;
	person: PersonSummary | null;
	emptyText: string;
}) {
	if (!person) {
		return (
			<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
				<Heading level={2} size={4} weight="medium" className="mb-2">
					{label}
				</Heading>
				<Text size={2} color="terracotta">
					{emptyText}
				</Text>
			</Card>
		);
	}

	const initial = (person.name ?? person.email ?? "?").charAt(0).toUpperCase();

	return (
		<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
			<Heading level={2} size={4} weight="medium" className="mb-3">
				{label}
			</Heading>
			<div className="flex items-center gap-3">
				{/* Avatar circle */}
				<div
					className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta-3 text-sm font-semibold text-terracotta-9"
					aria-hidden="true"
				>
					{initial}
				</div>
				<div className="min-w-0 flex-1">
					<p className="truncate font-medium text-terracotta-9">
						{person.name ?? "Unnamed User"}
					</p>
					{person.email && (
						<p className="mt-0.5 truncate text-sm text-terracotta-8">
							{person.email}
						</p>
					)}
				</div>
			</div>
		</Card>
	);
}

/* -------------------------------------------------------------------------- */
/*                            LocationSection                                   */
/* -------------------------------------------------------------------------- */

function LocationSection({ lat, lng }: { lat: number; lng: number }) {
	return (
		<section aria-labelledby="location-heading">
			<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
				<Heading level={2} size={4} weight="medium" id="location-heading" className="mb-2">
					Location
				</Heading>
				<Text size={2} color="terracotta">
					Coordinates:
					{" "}
					{lat.toFixed(5)}
					,
					{" "}
					{lng.toFixed(5)}
				</Text>
			</Card>
		</section>
	);
}

/* -------------------------------------------------------------------------- */
/*                            PayloadSection                                    */
/* -------------------------------------------------------------------------- */

function PayloadSection({ payload }: { payload: string }) {
	let parsed: Record<string, unknown> | null = null;
	try {
		const data = JSON.parse(payload);
		if (typeof data === "object" && data !== null && !Array.isArray(data)) {
			parsed = data as Record<string, unknown>;
		}
	}
	catch {
		// Not valid JSON — display as raw text
	}

	return (
		<section aria-labelledby="payload-heading">
			<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
				<Heading level={2} size={4} weight="medium" id="payload-heading" className="mb-3">
					Payload Data
				</Heading>
				{parsed
					? (
							<dl className="flex flex-col gap-2">
								{Object.entries(parsed).map(([key, value]) => (
									<div key={key} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
										<dt className="text-sm font-medium text-terracotta-9">
											{formatPayloadKey(key)}
											:
										</dt>
										<dd className="text-sm text-terracotta-8">
											{formatPayloadValue(value)}
										</dd>
									</div>
								))}
							</dl>
						)
					: (
							<pre className="whitespace-pre-wrap text-sm text-terracotta-8">
								{payload}
							</pre>
						)}
			</Card>
		</section>
	);
}

const UNDERSCORE_RE = /_/g;
const CAMEL_CASE_RE = /([a-z])([A-Z])/g;
const FIRST_CHAR_RE = /^./;

function formatPayloadKey(key: string): string {
	// Convert camelCase/snake_case to readable label
	return key
		.replace(UNDERSCORE_RE, " ")
		.replace(CAMEL_CASE_RE, "$1 $2")
		.replace(FIRST_CHAR_RE, s => s.toUpperCase());
}

function formatPayloadValue(value: unknown): string {
	if (value === null || value === undefined) {
		return "—";
	}
	if (typeof value === "boolean") {
		return value ? "Yes" : "No";
	}
	if (Array.isArray(value)) {
		return value.join(", ");
	}
	if (typeof value === "object") {
		return JSON.stringify(value);
	}
	return String(value);
}

/* -------------------------------------------------------------------------- */
/*                        MessageHistorySection                                 */
/* -------------------------------------------------------------------------- */

interface MessageData {
	_id: string;
	_creationTime: number;
	body: string;
	source: string;
	authorUserId?: Id<"users">;
}

function MessageHistorySection({
	messages,
	ownerUserId,
}: {
	messages: MessageData[];
	ownerUserId: Id<"users">;
}) {
	// Only show web/email messages, not admin notes
	const chatMessages = messages.filter(m => m.source === "web" || m.source === "email");

	if (chatMessages.length === 0) {
		return (
			<section aria-labelledby="messages-heading">
				<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
					<Heading level={2} size={4} weight="medium" id="messages-heading" className="mb-2">
						Message History
					</Heading>
					<Text size={2} color="terracotta">
						No messages yet.
					</Text>
				</Card>
			</section>
		);
	}

	return (
		<section aria-labelledby="messages-heading">
			<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
				<Heading level={2} size={4} weight="medium" id="messages-heading" className="mb-3">
					Message History
				</Heading>
				<div className="flex flex-col gap-2">
					{chatMessages.map((msg) => {
						const isOwner = msg.authorUserId === ownerUserId;
						return (
							<div
								key={msg._id}
								className={`flex ${isOwner ? "justify-start" : "justify-end"}`}
							>
								<div
									className={`max-w-[80%] rounded-4 px-3 py-2 ${
										isOwner
											? "bg-terracotta-2 text-terracotta-9"
											: "bg-sage-3 text-terracotta-9"
									}`}
								>
									<p className="text-sm">{msg.body}</p>
									<p className="mt-1 text-xs text-terracotta-7">
										{isOwner ? "Requester" : "Helper"}
										{" · "}
										{formatMessageTimestamp(msg._creationTime)}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</Card>
		</section>
	);
}

/* -------------------------------------------------------------------------- */
/*                           ActivitySection                                    */
/* -------------------------------------------------------------------------- */

function ActivitySection({
	messages,
	requestId,
}: {
	messages: MessageData[];
	requestId: Id<"helpRequests">;
}) {
	const addNote = useMutation(api.helpRequests.adminAddNote);
	const [noteText, setNoteText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Filter for admin_note messages, reverse chronological
	const adminNotes = messages
		.filter(m => m.source === "admin_note")
		.sort((a, b) => b._creationTime - a._creationTime);

	const handleSubmitNote = useCallback(async () => {
		const trimmed = noteText.trim();
		if (!trimmed)
			return;
		setIsSubmitting(true);
		try {
			await addNote({ requestId, body: trimmed });
			setNoteText("");
		}
		finally {
			setIsSubmitting(false);
		}
	}, [addNote, noteText, requestId]);

	return (
		<section aria-labelledby="activity-heading">
			<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
				<Heading level={2} size={4} weight="medium" id="activity-heading" className="mb-3">
					Activity
				</Heading>

				{/* Note Input */}
				<div className="mb-4 flex flex-col gap-2 sm:flex-row">
					<label htmlFor="note-input" className="sr-only">
						Add a coordinator note
					</label>
					<input
						id="note-input"
						type="text"
						value={noteText}
						onChange={e => setNoteText(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								void handleSubmitNote();
							}
						}}
						placeholder="Add a coordinator note…"
						aria-label="Add a coordinator note"
						className="min-h-11 flex-1 rounded-full border-2 border-terracotta-6 bg-gray-1 px-4 py-2 text-sm text-terracotta-9 placeholder:text-terracotta-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-9 focus-visible:ring-offset-2"
					/>
					<Button
						variant="solid"
						color="yellow"
						size={2}
						onPress={() => void handleSubmitNote()}
						isDisabled={isSubmitting || noteText.trim().length === 0}
						aria-label="Submit coordinator note"
					>
						{isSubmitting ? "Sending…" : "Add Note"}
					</Button>
				</div>

				{/* Activity Log */}
				{adminNotes.length === 0
					? (
							<Text size={2} color="terracotta">
								No coordinator notes yet.
							</Text>
						)
					: (
							<ul className="flex flex-col gap-2" role="list" aria-label="Coordinator notes">
								{adminNotes.map(note => (
									<li
										key={note._id}
										className="border-b border-terracotta-3 pb-2 last:border-b-0 last:pb-0"
									>
										<div className="rounded-2 bg-terracotta-2 px-3 py-2">
											<p className="text-sm text-terracotta-9">{note.body}</p>
											<p className="mt-1 text-xs text-terracotta-7">
												{formatMessageTimestamp(note._creationTime)}
											</p>
										</div>
									</li>
								))}
							</ul>
						)}
			</Card>
		</section>
	);
}

/* -------------------------------------------------------------------------- */
/*                          Confirmation Dialogs                                */
/* -------------------------------------------------------------------------- */

function ConfirmationDialog({
	title,
	description,
	confirmLabel,
	confirmColor,
	onConfirm,
	isPending,
}: {
	title: string;
	description: string;
	confirmLabel: string;
	confirmColor: "red" | "sage" | "yellow";
	onConfirm: () => void;
	isPending: boolean;
}) {
	return (
		<div className="flex flex-col gap-4">
			<Heading level={2} size={5} weight="medium">
				{title}
			</Heading>
			<Text size={3} color="terracotta">
				{description}
			</Text>
			<div className="flex gap-3">
				<Button
					variant="solid"
					color="gray"
					size={2}
					slot="close"
					className="flex-1"
				>
					Cancel
				</Button>
				<Button
					variant="solid"
					color={confirmColor}
					size={2}
					onPress={onConfirm}
					isDisabled={isPending}
					className="flex-1"
				>
					{isPending ? "Processing…" : confirmLabel}
				</Button>
			</div>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                            ActionButtons                                     */
/* -------------------------------------------------------------------------- */

function ActionButtons({
	request,
}: {
	request: RequestDetailData;
}) {
	const router = useRouter();
	const status = request.status as HelpRequestStatus;
	const requestId = request._id;

	// Mutations with optimistic updates
	const markComplete = useMutation(api.helpRequests.adminMarkComplete)
		.withOptimisticUpdate((localStore, args) => {
			const currentValue = localStore.getQuery(api.helpRequests.adminGetRequest, { requestId: args.requestId });
			if (currentValue) {
				localStore.setQuery(api.helpRequests.adminGetRequest, { requestId: args.requestId }, {
					...currentValue,
					status: "complete",
				});
			}
		});

	const cancelRequest = useMutation(api.helpRequests.adminCancelRequest)
		.withOptimisticUpdate((localStore, args) => {
			const currentValue = localStore.getQuery(api.helpRequests.adminGetRequest, { requestId: args.requestId });
			if (currentValue) {
				localStore.setQuery(api.helpRequests.adminGetRequest, { requestId: args.requestId }, {
					...currentValue,
					status: "cancelled",
				});
			}
		});

	const toggleUrgent = useMutation(api.helpRequests.adminToggleUrgent)
		.withOptimisticUpdate((localStore, args) => {
			const currentValue = localStore.getQuery(api.helpRequests.adminGetRequest, { requestId: args.requestId });
			if (currentValue) {
				localStore.setQuery(api.helpRequests.adminGetRequest, { requestId: args.requestId }, {
					...currentValue,
					isUrgent: args.isUrgent,
				});
			}
		});

	const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
	const [isCompleting, setIsCompleting] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);

	const isActive = status === "pending"
		|| status === "assigned"
		|| status === "awaiting_requester_acceptance"
		|| status === "in_progress";

	const handleMarkComplete = useCallback(async () => {
		setIsCompleting(true);
		try {
			await markComplete({ requestId });
			setCompleteDialogOpen(false);
		}
		finally {
			setIsCompleting(false);
		}
	}, [markComplete, requestId]);

	const handleCancel = useCallback(async () => {
		setIsCancelling(true);
		try {
			await cancelRequest({ requestId });
			setCancelDialogOpen(false);
		}
		finally {
			setIsCancelling(false);
		}
	}, [cancelRequest, requestId]);

	const handleToggleUrgent = useCallback(() => {
		void toggleUrgent({ requestId, isUrgent: !request.isUrgent });
	}, [toggleUrgent, requestId, request.isUrgent]);

	if (!isActive) {
		return (
			<section aria-label="Request actions" className="flex flex-col gap-3 sm:flex-row">
				<Button
					variant="solid"
					color="yellow"
					size={3}
					className="flex-1"
					onPress={() => router.push(`/app/admin/requests/${requestId}/edit`)}
					aria-label="Edit request"
				>
					Edit Request
				</Button>
			</section>
		);
	}

	return (
		<section aria-label="Request actions" className="flex flex-col gap-3">
			{/* Top row: Toggle Urgent */}
			<Button
				variant="solid"
				color={request.isUrgent ? "gray" : "darkred"}
				size={3}
				onPress={handleToggleUrgent}
				aria-label={request.isUrgent ? "Remove urgent flag" : "Mark as urgent"}
			>
				{request.isUrgent ? "Remove Urgent" : "Mark Urgent"}
			</Button>

			{/* Action row: responsive layout */}
			<div className="flex flex-col gap-3 sm:flex-row">
				{/* Assign Helper */}
				<Button
					variant="solid"
					color="yellow"
					size={3}
					className="flex-1"
					onPress={() => router.push(`/app/admin/requests/${requestId}/assign`)}
					aria-label="Assign helper to request"
				>
					Assign Helper
				</Button>

				{/* Mark Complete — only for in_progress */}
				{status === "in_progress" && (
					<DialogTrigger isOpen={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
						<Button
							variant="solid"
							color="sage"
							size={3}
							className="flex-1"
							aria-label="Mark request as complete"
						>
							Mark Complete
						</Button>
						<ModalOverlay isDismissable>
							<Modal aria-label="Confirm mark complete" size={2}>
								<ConfirmationDialog
									title="Mark Complete"
									description={`Are you sure you want to mark "${request.title}" as complete? Both the requester and helper will be notified.`}
									confirmLabel="Confirm Complete"
									confirmColor="sage"
									onConfirm={() => void handleMarkComplete()}
									isPending={isCompleting}
								/>
							</Modal>
						</ModalOverlay>
					</DialogTrigger>
				)}
			</div>

			{/* Bottom row: Edit + Cancel */}
			<div className="flex flex-col gap-3 sm:flex-row">
				<Button
					variant="solid"
					color="yellow"
					size={3}
					className="flex-1"
					onPress={() => router.push(`/app/admin/requests/${requestId}/edit`)}
					aria-label="Edit request"
				>
					Edit Request
				</Button>

				<DialogTrigger isOpen={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
					<Button
						variant="solid"
						color="red"
						size={3}
						className="flex-1"
						aria-label="Cancel request"
					>
						Cancel Request
					</Button>
					<ModalOverlay isDismissable>
						<Modal aria-label="Confirm cancel request" size={2}>
							<ConfirmationDialog
								title="Cancel Request"
								description={`Are you sure you want to cancel "${request.title}"? This action cannot be undone. The requester and any assigned helper will be notified.`}
								confirmLabel="Confirm Cancel"
								confirmColor="red"
								onConfirm={() => void handleCancel()}
								isPending={isCancelling}
							/>
						</Modal>
					</ModalOverlay>
				</DialogTrigger>
			</div>
		</section>
	);
}

/* -------------------------------------------------------------------------- */
/*                           Duration Formatting                                */
/* -------------------------------------------------------------------------- */

function formatElapsedDuration(creationTime: number): string {
	const elapsed = Date.now() - creationTime;
	const minutes = Math.floor(elapsed / 60_000);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) {
		return `${days} day${days === 1 ? "" : "s"} ago`;
	}
	if (hours > 0) {
		return `${hours} hour${hours === 1 ? "" : "s"} ago`;
	}
	if (minutes > 0) {
		return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
	}
	return "Just now";
}

function formatTimestamp(creationTime: number): string {
	return new Date(creationTime).toLocaleDateString("en-CA", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function formatMessageTimestamp(creationTime: number): string {
	return new Date(creationTime).toLocaleDateString("en-CA", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

/* -------------------------------------------------------------------------- */
/*                          RequestDetailView (page)                             */
/* -------------------------------------------------------------------------- */

export default function RequestDetailPage() {
	const router = useRouter();
	const params = useParams();
	const rawId = params.id;
	const requestId = typeof rawId === "string"
		? rawId
		: Array.isArray(rawId)
			? rawId[0]
			: undefined;

	const request = useQuery(
		api.helpRequests.adminGetRequest,
		requestId ? { requestId: requestId as Id<"helpRequests"> } : "skip",
	);

	const isLoading = request === undefined;

	if (!requestId) {
		return (
			<div className="p-6">
				<Text size={3} color="terracotta">
					Missing request ID.
				</Text>
			</div>
		);
	}

	return (
		<div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 lg:py-10">
			{/* aria-live for loading state */}
			<div aria-live="polite" aria-atomic="true" className="sr-only">
				{isLoading ? "Loading request details" : "Request details loaded"}
			</div>

			{isLoading
				? <RequestDetailSkeleton />
				: request === null
					? (
							<div className="flex flex-col items-center gap-4 py-12">
								<Text size={3} color="terracotta">
									This request no longer exists.
								</Text>
								<button
									type="button"
									onClick={() => router.push("/app/admin/requests")}
									className="min-h-11 rounded-full border-2 border-terracotta-6 px-4 py-2 text-sm font-medium text-terracotta-9 transition-colors hover:bg-terracotta-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-9 focus-visible:ring-offset-2"
								>
									← Back to requests
								</button>
							</div>
						)
					: <RequestDetailContent request={request} />}
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                         RequestDetailContent                                 */
/* -------------------------------------------------------------------------- */

interface RequestDetailData {
	_id: Id<"helpRequests">;
	_creationTime: number;
	title: string;
	summary: string;
	details: string;
	status: string;
	category: string;
	isUrgent?: boolean;
	payload?: string;
	locationLat?: number;
	locationLng?: number;
	ownerUserId: Id<"users">;
	owner: PersonSummary | null;
	helper: PersonSummary | null;
	assignedHelper: PersonSummary | null;
	messages: MessageData[];
}

function RequestDetailContent({ request }: { request: RequestDetailData }) {
	const router = useRouter();
	const status = request.status as HelpRequestStatus;

	return (
		<div className="flex flex-col gap-6">
			{/* Back button */}
			<button
				type="button"
				onClick={() => router.back()}
				className="min-h-11 self-start rounded-full border-2 border-terracotta-6 px-4 py-2 text-sm font-medium text-terracotta-9 transition-colors hover:bg-terracotta-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-9 focus-visible:ring-offset-2"
				aria-label="Go back to requests list"
			>
				← Back
			</button>

			{/* Header: title, status, urgency */}
			<header className="flex flex-wrap items-start justify-between gap-3">
				<Heading level={1} size={6} weight="bold" className="min-w-0 flex-1">
					{request.title}
				</Heading>
				<div className="flex flex-wrap items-center gap-2">
					<StatusBadge status={status} />
					{request.isUrgent && (
						<Badge variant="solid" color="darkred" size={2}>
							Urgent
						</Badge>
					)}
				</div>
			</header>

			{/* Details Section */}
			<section aria-labelledby="details-heading">
				<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
					<Heading level={2} size={4} weight="medium" id="details-heading" className="mb-3">
						Details
					</Heading>
					<div className="whitespace-pre-wrap text-sm text-terracotta-9">
						{request.details}
					</div>
					<div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
						<Text size={1} color="terracotta">
							Created:
							{" "}
							{formatTimestamp(request._creationTime)}
						</Text>
						<Text size={1} color="terracotta">
							{formatElapsedDuration(request._creationTime)}
						</Text>
						<Badge variant="soft" color="terracotta" size={1}>
							{request.category}
						</Badge>
					</div>
				</Card>
			</section>

			{/* Requester & Helper Cards */}
			<div className="grid gap-4 sm:grid-cols-2">
				<PersonCard
					label="Requester"
					person={request.owner}
					emptyText="Unknown requester"
				/>
				<PersonCard
					label="Helper"
					person={request.assignedHelper ?? request.helper}
					emptyText="No helper assigned yet"
				/>
			</div>

			{/* Location Section */}
			{request.locationLat != null && request.locationLng != null && (
				<LocationSection lat={request.locationLat} lng={request.locationLng} />
			)}

			{/* Payload Section */}
			{request.payload && (
				<PayloadSection payload={request.payload} />
			)}

			{/* Message History */}
			<MessageHistorySection
				messages={request.messages}
				ownerUserId={request.ownerUserId}
			/>

			{/* Activity Section (coordinator notes) */}
			<ActivitySection
				messages={request.messages}
				requestId={request._id}
			/>

			{/* Action Buttons */}
			<ActionButtons request={request} />
		</div>
	);
}
