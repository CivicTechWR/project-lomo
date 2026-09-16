"use client";

import type { Id } from "@repo/convex-backend/convex/_generated/dataModel";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Heading } from "@repo/ui/heading";
import { Icon } from "@repo/ui/icons";
import { DialogTrigger, Modal, ModalOverlay } from "@repo/ui/modal";
import { Text } from "@repo/ui/text";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                            AssignPageSkeleton                                */
/* -------------------------------------------------------------------------- */

function AssignPageSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			{/* Back button skeleton */}
			<div className="h-10 w-20 animate-pulse rounded-full bg-terracotta-3" />

			{/* Title skeleton */}
			<div className="h-7 w-3/4 animate-pulse rounded bg-terracotta-3" />

			{/* Search skeleton */}
			<div className="h-11 w-full animate-pulse rounded-full bg-terracotta-3" />

			{/* Volunteer card skeletons */}
			<ul className="flex flex-col gap-3" aria-label="Loading volunteers">
				{Array.from({ length: 5 }, (_, i) => `skeleton-${i}`).map(key => (
					<li key={key}>
						<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 animate-pulse rounded-full bg-terracotta-3" />
								<div className="flex-1">
									<div className="h-4 w-32 animate-pulse rounded bg-terracotta-3" />
									<div className="mt-2 h-3 w-48 animate-pulse rounded bg-terracotta-3" />
								</div>
							</div>
						</Card>
					</li>
				))}
			</ul>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                         VolunteerCard                                        */
/* -------------------------------------------------------------------------- */

interface Volunteer {
	_id: Id<"users">;
	name?: string | null;
	email?: string | null;
}

function VolunteerCard({
	volunteer,
	onSelect,
}: {
	volunteer: Volunteer;
	onSelect: (volunteer: Volunteer) => void;
}) {
	const initial = (volunteer.name ?? volunteer.email ?? "?").charAt(0).toUpperCase();

	return (
		<li>
			<button
				type="button"
				onClick={() => onSelect(volunteer)}
				className="flex w-full items-center gap-3 rounded-4 border-2 border-terracotta-6 bg-white p-4 text-left transition-colors hover:bg-terracotta-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-9 focus-visible:ring-offset-2"
				aria-label={`Assign ${volunteer.name ?? volunteer.email ?? "unnamed volunteer"}`}
			>
				{/* Avatar */}
				<div
					className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta-3 text-sm font-semibold text-terracotta-9"
					aria-hidden="true"
				>
					{initial}
				</div>
				<div className="min-w-0 flex-1">
					<p className="truncate font-medium text-terracotta-9">
						{volunteer.name ?? "Unnamed User"}
					</p>
					{volunteer.email && (
						<p className="mt-0.5 truncate text-sm text-terracotta-8">
							{volunteer.email}
						</p>
					)}
				</div>
			</button>
		</li>
	);
}

/* -------------------------------------------------------------------------- */
/*                          AssignHelperPage                                    */
/* -------------------------------------------------------------------------- */

export default function AssignHelperPage() {
	const router = useRouter();
	const params = useParams();
	const rawId = params.id;
	const requestId = typeof rawId === "string"
		? rawId
		: Array.isArray(rawId)
			? rawId[0]
			: undefined;

	const [search, setSearch] = useState("");
	const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
	const [isAssigning, setIsAssigning] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);

	const request = useQuery(
		api.helpRequests.adminGetRequest,
		requestId ? { requestId: requestId as Id<"helpRequests"> } : "skip",
	);

	const volunteers = useQuery(api.helpRequests.listVolunteersForAdmin);

	const assignVolunteer = useMutation(api.helpRequests.assignVolunteer);

	const filteredVolunteers = useMemo(() => {
		if (!volunteers)
			return [];
		const term = search.toLowerCase().trim();
		if (!term)
			return volunteers;
		return volunteers.filter((v) => {
			const name = (v.name ?? "").toLowerCase();
			const email = (v.email ?? "").toLowerCase();
			return name.includes(term) || email.includes(term);
		});
	}, [volunteers, search]);

	const handleSelectVolunteer = useCallback((volunteer: Volunteer) => {
		setSelectedVolunteer(volunteer);
		setConfirmOpen(true);
	}, []);

	const handleConfirmAssign = useCallback(async () => {
		if (!selectedVolunteer || !requestId)
			return;
		setIsAssigning(true);
		try {
			await assignVolunteer({
				requestId: requestId as Id<"helpRequests">,
				volunteerUserId: selectedVolunteer._id,
			});
			router.push(`/app/admin/requests/${requestId}`);
		}
		catch {
			// Error is handled by Convex — stay on page
			setIsAssigning(false);
			setConfirmOpen(false);
		}
	}, [assignVolunteer, requestId, selectedVolunteer, router]);

	const isLoading = request === undefined || volunteers === undefined;

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
				{isLoading ? "Loading volunteer list" : `${filteredVolunteers.length} volunteers available`}
			</div>

			{isLoading
				? <AssignPageSkeleton />
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
					: (
							<div className="flex flex-col gap-6">
								{/* Back button */}
								<button
									type="button"
									onClick={() => router.push(`/app/admin/requests/${requestId}`)}
									className="min-h-11 self-start rounded-full border-2 border-terracotta-6 px-4 py-2 text-sm font-medium text-terracotta-9 transition-colors hover:bg-terracotta-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-9 focus-visible:ring-offset-2"
									aria-label="Go back to request detail"
								>
									← Back
								</button>

								{/* Page title with request name */}
								<Heading level={1} size={6} weight="bold">
									Assign Helper
								</Heading>
								<Text size={3} color="terracotta">
									Select a volunteer to assign to &ldquo;
									{request.title}
									&rdquo;
								</Text>

								{/* Search input */}
								<div className="relative">
									<label htmlFor="volunteer-search" className="sr-only">
										Search volunteers by name or email
									</label>
									<input
										id="volunteer-search"
										type="search"
										aria-label="Search volunteers by name or email"
										placeholder="Search by name or email..."
										value={search}
										onChange={e => setSearch(e.target.value)}
										maxLength={100}
										className="h-11 w-full rounded-full border-2 border-terracotta-6 bg-white px-4 py-2 text-sm text-terracotta-9 placeholder:text-terracotta-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-9 focus-visible:ring-offset-2"
									/>
									<Icon
										name="search"
										className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-terracotta-7"
									/>
								</div>

								{/* Volunteer list */}
								{filteredVolunteers.length === 0
									? (
											<Card border="medium" borderColor="terracotta" size={2} className="rounded-4">
												<div className="flex flex-col items-center gap-2 py-6 text-center">
													<Text size={3} weight="medium" color="terracotta">
														No volunteers found
													</Text>
													<Text size={2} color="terracotta">
														{search ? "Try adjusting your search." : "No volunteers are available."}
													</Text>
												</div>
											</Card>
										)
									: (
											<ul
												className="flex flex-col gap-3"
												role="list"
												aria-label={`Volunteers list, ${filteredVolunteers.length} results`}
											>
												{filteredVolunteers.map(volunteer => (
													<VolunteerCard
														key={volunteer._id}
														volunteer={volunteer}
														onSelect={handleSelectVolunteer}
													/>
												))}
											</ul>
										)}

								{/* Confirmation dialog */}
								<DialogTrigger isOpen={confirmOpen} onOpenChange={setConfirmOpen}>
									{/* Hidden trigger — dialog is opened programmatically */}
									<Button className="hidden" aria-hidden="true">Open</Button>
									<ModalOverlay isDismissable>
										<Modal aria-label="Confirm volunteer assignment" size={2}>
											<div className="flex flex-col gap-4">
												<Heading level={2} size={5} weight="medium">
													Confirm Assignment
												</Heading>
												<Text size={3} color="terracotta">
													Assign
													{" "}
													{selectedVolunteer?.name ?? selectedVolunteer?.email ?? "this volunteer"}
													{" "}
													to &ldquo;
													{request.title}
													&rdquo;?
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
														color="yellow"
														size={2}
														onPress={() => void handleConfirmAssign()}
														isDisabled={isAssigning}
														className="flex-1"
													>
														{isAssigning ? "Assigning…" : "Confirm"}
													</Button>
												</div>
											</div>
										</Modal>
									</ModalOverlay>
								</DialogTrigger>
							</div>
						)}
		</div>
	);
}
