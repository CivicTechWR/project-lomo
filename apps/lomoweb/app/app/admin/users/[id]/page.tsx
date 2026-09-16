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
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { deriveUserStatus, USER_STATUS_BADGE_COLOR } from "../../lib/filters";

/* -------------------------------------------------------------------------- */
/*                                  Types                                       */
/* -------------------------------------------------------------------------- */

interface MiniRequest {
	_id: Id<"helpRequests">;
	_creationTime: number;
	title: string;
	status: HelpRequestStatus;
	category: string;
}

/* -------------------------------------------------------------------------- */
/*                            Status badge helpers                              */
/* -------------------------------------------------------------------------- */

const REQUEST_STATUS_BADGE_COLOR: Record<HelpRequestStatus, "gray" | "yellow" | "sage" | "red"> = {
	pending: "gray",
	assigned: "yellow",
	awaiting_requester_acceptance: "yellow",
	in_progress: "sage",
	complete: "sage",
	cancelled: "red",
};

const STATUS_LABELS: Record<HelpRequestStatus, string> = {
	pending: "Pending",
	assigned: "Assigned",
	awaiting_requester_acceptance: "Awaiting",
	in_progress: "In Progress",
	complete: "Completed",
	cancelled: "Cancelled",
};

/* -------------------------------------------------------------------------- */
/*                             UserDetailSkeleton                               */
/* -------------------------------------------------------------------------- */

function UserDetailSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			{/* Header skeleton */}
			<div className="flex items-center gap-4">
				<div className="h-16 w-16 animate-pulse rounded-full bg-terracotta-3" />
				<div className="flex-1">
					<div className="h-5 w-40 animate-pulse rounded bg-terracotta-3" />
					<div className="mt-2 h-4 w-56 animate-pulse rounded bg-terracotta-3" />
				</div>
			</div>

			{/* Profile card skeleton */}
			<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
				<div className="h-4 w-32 animate-pulse rounded bg-terracotta-3" />
				<div className="mt-3 h-4 w-48 animate-pulse rounded bg-terracotta-3" />
				<div className="mt-3 h-4 w-24 animate-pulse rounded bg-terracotta-3" />
			</Card>

			{/* Sections skeleton */}
			<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
				<div className="h-5 w-36 animate-pulse rounded bg-terracotta-3" />
				<div className="mt-4 h-16 w-full animate-pulse rounded bg-terracotta-3" />
			</Card>
			<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
				<div className="h-5 w-36 animate-pulse rounded bg-terracotta-3" />
				<div className="mt-4 h-16 w-full animate-pulse rounded bg-terracotta-3" />
			</Card>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                             MiniRequestCard                                  */
/* -------------------------------------------------------------------------- */

function MiniRequestCard({ request }: { request: MiniRequest }) {
	return (
		<li>
			<Link
				href={`/app/admin/requests/${request._id}`}
				className="block rounded-3 border-2 border-terracotta-6 bg-white p-3 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-9 focus-visible:ring-offset-2"
			>
				<div className="flex items-center justify-between gap-2">
					<p className="min-w-0 truncate text-sm font-medium text-terracotta-9">
						{request.title}
					</p>
					<Badge
						variant="soft"
						color={REQUEST_STATUS_BADGE_COLOR[request.status]}
						size={1}
					>
						{STATUS_LABELS[request.status]}
					</Badge>
				</div>
				<div className="mt-1.5 flex items-center gap-2">
					<Badge variant="soft" color="terracotta" size={1}>
						{request.category}
					</Badge>
					<Text size={1} color="terracotta">
						{new Date(request._creationTime).toLocaleDateString("en-CA", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})}
					</Text>
				</div>
			</Link>
		</li>
	);
}

/* -------------------------------------------------------------------------- */
/*                           BlockConfirmationDialog                            */
/* -------------------------------------------------------------------------- */

function BlockConfirmationDialog({
	userName,
	onConfirm,
	isPending,
}: {
	userName: string;
	onConfirm: () => void;
	isPending: boolean;
}) {
	return (
		<div className="flex flex-col gap-4 p-6">
			<Heading level={2} size={5} weight="medium">
				Block User
			</Heading>
			<Text size={3} color="terracotta">
				Are you sure you want to block
				{" "}
				<strong>{userName}</strong>
				? This will prevent them from creating requests or sending messages, and cancel all their active requests.
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
					color="red"
					size={2}
					onPress={onConfirm}
					isDisabled={isPending}
					className="flex-1"
				>
					{isPending ? "Blocking..." : "Confirm Block"}
				</Button>
			</div>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                            UserDetailView (page)                             */
/* -------------------------------------------------------------------------- */

export default function UserDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const userId = params.id as Id<"users">;

	const userData = useQuery(api.users.adminGetUser, { userId });
	const blockUser = useMutation(api.users.adminBlockUser);
	const unblockUser = useMutation(api.users.adminUnblockUser);

	const [isBlocking, setIsBlocking] = useState(false);
	const [isUnblocking, setIsUnblocking] = useState(false);
	const [blockDialogOpen, setBlockDialogOpen] = useState(false);

	const isLoading = userData === undefined;

	// Split requests into active vs past
	const activeStatuses = new Set<HelpRequestStatus>([
		"pending",
		"assigned",
		"awaiting_requester_acceptance",
		"in_progress",
	]);
	const pastStatuses = new Set<HelpRequestStatus>(["complete", "cancelled"]);

	const activeRequests: MiniRequest[] = userData?.requests
		?.filter(r => activeStatuses.has(r.status as HelpRequestStatus))
		.map(r => ({
			_id: r._id,
			_creationTime: r._creationTime,
			title: r.title,
			status: r.status as HelpRequestStatus,
			category: r.category,
		})) ?? [];

	const pastRequests: MiniRequest[] = userData?.requests
		?.filter(r => pastStatuses.has(r.status as HelpRequestStatus))
		.map(r => ({
			_id: r._id,
			_creationTime: r._creationTime,
			title: r.title,
			status: r.status as HelpRequestStatus,
			category: r.category,
		})) ?? [];

	// Derive activity history from requests (reverse chronological by creation time)
	const activityHistory = userData?.requests
		?.map(r => ({
			_id: r._id,
			title: r.title,
			status: r.status as HelpRequestStatus,
			date: r._creationTime,
		}))
		.sort((a, b) => b.date - a.date) ?? [];

	// Handle block action
	async function handleBlock() {
		setIsBlocking(true);
		try {
			await blockUser({ userId });
			setBlockDialogOpen(false);
		}
		finally {
			setIsBlocking(false);
		}
	}

	/*
	 * Unblocking restores the account to whatever it was before — the derived
	 * status falls back to Volunteer/Resting/Member from the user's own settings,
	 * which blocking never overwrote. Requests cancelled at block time stay
	 * cancelled; those are not restored.
	 */
	async function handleUnblock() {
		setIsUnblocking(true);
		try {
			await unblockUser({ userId });
		}
		finally {
			setIsUnblocking(false);
		}
	}

	if (isLoading) {
		return (
			<div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 lg:py-10">
				<div aria-live="polite" aria-atomic="true" className="sr-only">
					Loading user details
				</div>
				<UserDetailSkeleton />
			</div>
		);
	}

	if (!userData) {
		return (
			<div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:py-10">
				<Card size={2} className="rounded-4 border border-gray-6">
					<Text size={3} color="gray" className="text-center">
						User not found.
					</Text>
				</Card>
			</div>
		);
	}

	const userStatus = deriveUserStatus(userData);
	const badgeColor = USER_STATUS_BADGE_COLOR[userStatus];
	const initial = (userData.name ?? userData.email ?? "?").charAt(0).toUpperCase();
	const registrationDate = new Date(userData._creationTime).toLocaleDateString(
		"en-CA",
		{ year: "numeric", month: "long", day: "numeric" },
	);

	const helpPreferences = userData.helpPreferences ?? [];

	return (
		<div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 lg:py-10">
			{/* aria-live region for loaded state */}
			<div aria-live="polite" aria-atomic="true" className="sr-only">
				{`User details loaded for ${userData.name ?? "user"}`}
			</div>

			{/* Back button */}
			<nav aria-label="Back navigation" className="mb-4">
				<Button
					variant="ghost"
					size={2}
					onPress={() => router.push("/app/admin/users")}
					aria-label="Back to users list"
				>
					<span aria-hidden="true" className="mr-1">&larr;</span>
					Back to Users
				</Button>
			</nav>

			{/* Header */}
			<header className="mb-6 flex items-center gap-4">
				<div
					className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-terracotta-3 text-xl font-semibold text-terracotta-9"
					aria-hidden="true"
				>
					{initial}
				</div>
				<div className="min-w-0 flex-1">
					<Heading level={1} size={6} weight="bold" className="truncate">
						{userData.name ?? "Unnamed User"}
					</Heading>
					{userData.email && (
						<Text size={3} color="terracotta" className="truncate">
							{userData.email}
						</Text>
					)}
				</div>
			</header>

			{/* Profile Info Card */}
			<section aria-labelledby="profile-heading" className="mb-6">
				<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
					<Heading level={2} size={5} weight="medium" id="profile-heading" className="mb-3">
						Profile Information
					</Heading>

					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<Text size={2} weight="medium" color="terracotta">Status:</Text>
							<Badge variant="soft" color={badgeColor} size={1}>
								{userStatus}
							</Badge>
						</div>

						{helpPreferences.length > 0 && (
							<div>
								<Text size={2} weight="medium" color="terracotta" className="mb-1">
									Help Preferences:
								</Text>
								<div className="flex flex-wrap gap-1.5">
									{helpPreferences.map(pref => (
										<Badge key={pref} variant="soft" color="terracotta" size={1}>
											{pref}
										</Badge>
									))}
								</div>
							</div>
						)}

						<div className="flex items-center gap-2">
							<Text size={2} weight="medium" color="terracotta">Registered:</Text>
							<Text size={2} color="terracotta">{registrationDate}</Text>
						</div>

						{/*
						  No separate "Blocked" badge here: blocking now derives the
						  Status badge above, so a second pill would be the same fact
						  twice and could contradict it if one was ever updated alone.
						*/}
					</div>
				</Card>
			</section>

			{/* Active Requests */}
			<section aria-labelledby="active-requests-heading" className="mb-6">
				<div className="mb-3 flex items-center gap-2">
					<Heading level={2} size={5} weight="medium" id="active-requests-heading">
						Active Requests
					</Heading>
					<Badge variant="soft" color="terracotta" size={1}>
						{activeRequests.length}
					</Badge>
				</div>

				{activeRequests.length === 0
					? (
							<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
								<Text size={2} color="terracotta" className="text-center">
									No active requests
								</Text>
							</Card>
						)
					: (
							<ul className="flex flex-col gap-3" role="list" aria-label={`Active requests, ${activeRequests.length} items`}>
								{activeRequests.map(req => (
									<MiniRequestCard key={req._id} request={req} />
								))}
							</ul>
						)}
			</section>

			{/* Past Requests */}
			<section aria-labelledby="past-requests-heading" className="mb-6">
				<div className="mb-3 flex items-center gap-2">
					<Heading level={2} size={5} weight="medium" id="past-requests-heading">
						Past Requests
					</Heading>
					<Badge variant="soft" color="terracotta" size={1}>
						{pastRequests.length}
					</Badge>
				</div>

				{pastRequests.length === 0
					? (
							<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
								<Text size={2} color="terracotta" className="text-center">
									No past requests
								</Text>
							</Card>
						)
					: (
							<ul className="flex flex-col gap-3" role="list" aria-label={`Past requests, ${pastRequests.length} items`}>
								{pastRequests.map(req => (
									<MiniRequestCard key={req._id} request={req} />
								))}
							</ul>
						)}
			</section>

			{/* Activity History */}
			<section aria-labelledby="activity-heading" className="mb-6">
				<Heading level={2} size={5} weight="medium" id="activity-heading" className="mb-3">
					Activity History
				</Heading>

				{activityHistory.length === 0
					? (
							<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
								<Text size={2} color="terracotta" className="text-center">
									No activity yet
								</Text>
							</Card>
						)
					: (
							<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
								<ul className="flex flex-col gap-3" role="list" aria-label="Activity history">
									{activityHistory.map(entry => (
										<li key={`${entry._id}-${entry.date}`} className="flex items-start gap-3 border-b border-terracotta-3 pb-3 last:border-b-0 last:pb-0">
											<div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-terracotta-6" aria-hidden="true" />
											<div className="min-w-0 flex-1">
												<Text size={2} color="terracotta" className="truncate">
													Created request:
													{" "}
													<strong>{entry.title}</strong>
												</Text>
												<Text size={1} color="terracotta">
													{new Date(entry.date).toLocaleDateString("en-CA", {
														year: "numeric",
														month: "short",
														day: "numeric",
													})}
													{" "}
													&mdash;
													{" "}
													{STATUS_LABELS[entry.status]}
												</Text>
											</div>
										</li>
									))}
								</ul>
							</Card>
						)}
			</section>

			{/* Action Buttons */}
			<section aria-label="User actions" className="flex flex-col gap-3 sm:flex-row">
				{/*
				  Blocking is admin-only and has no self-service equivalent, so this
				  page is the only place the Blocked status can be set or cleared.
				  Unblock is a plain button: it is the recoverable direction, so it
				  does not need a confirmation step the way blocking does.
				*/}
				{userData.blocked === true
					? (
							<Button
								variant="solid"
								color="gray"
								size={3}
								className="flex-1"
								isDisabled={isUnblocking}
								onPress={() => void handleUnblock()}
							>
								{isUnblocking ? "Unblocking..." : "Unblock"}
							</Button>
						)
					: (
							<DialogTrigger isOpen={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
								<Button
									variant="solid"
									color="red"
									size={3}
									className="flex-1"
								>
									Block
								</Button>
								<ModalOverlay isDismissable>
									<Modal aria-label="Confirm block user" size={2}>
										<BlockConfirmationDialog
											userName={userData.name ?? "this user"}
											onConfirm={handleBlock}
											isPending={isBlocking}
										/>
									</Modal>
								</ModalOverlay>
							</DialogTrigger>
						)}

				{/* Message button */}
				<Button
					variant="solid"
					size={3}
					className="flex-1"
					href={`mailto:${userData.email ?? ""}`}
				>
					Message
				</Button>
			</section>
		</div>
	);
}
