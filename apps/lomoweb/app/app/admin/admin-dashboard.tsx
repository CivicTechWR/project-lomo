"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import type { Id } from "@repo/convex-backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { useMemo, useState } from "react";
import { HELP_REQUEST_STATUS_LABEL, statusBadgeColor, type HelpRequestStatus } from "@/lib/help-request-status";

export function AdminDashboard() {
	const isAdmin = useQuery(api.helpRequests.isAdmin, {});
	const requests = useQuery(api.helpRequests.listAllForAdmin, isAdmin ? {} : "skip");
	const volunteers = useQuery(api.helpRequests.listVolunteersForAdmin, isAdmin ? {} : "skip");
	const assignVolunteer = useMutation(api.helpRequests.assignVolunteer);
	const [assigningId, setAssigningId] = useState<string | null>(null);
	const [selectedByRequest, setSelectedByRequest] = useState<Record<string, string>>({});

	const volunteerOptions = useMemo(
		() => (volunteers ?? []).map(v => ({
			subject: v.subject,
			label: `${v.name ?? "Unnamed"}${v.email ? ` (${v.email})` : ""}`,
		})),
		[volunteers],
	);

	if (isAdmin === undefined) {
		return <Text size={2} color="gray">Checking admin access…</Text>;
	}
	if (!isAdmin) {
		return <Text size={3} color="red">You do not have admin access.</Text>;
	}

	async function handleAssign(requestId: Id<"helpRequests">) {
		const volunteerSubject = selectedByRequest[requestId];
		if (!volunteerSubject) {
			window.alert("Choose a volunteer first.");
			return;
		}
		setAssigningId(requestId);
		try {
			await assignVolunteer({ requestId, volunteerSubject });
		}
		catch (e) {
			console.error(e);
			window.alert(e instanceof Error ? e.message : "Could not assign volunteer.");
		}
		finally {
			setAssigningId(null);
		}
	}

	return (
		<div className="flex flex-col gap-8">
			<div>
				<Heading level={1} size={8}>Admin dashboard</Heading>
				<Text size={2} color="gray" className="mt-1">
					Assign volunteers to incoming requests and monitor match state.
				</Text>
			</div>

			<section className="flex flex-col gap-4">
				<Heading level={2} size={6}>All requests</Heading>
				{requests === undefined && <Text size={2} color="gray">Loading requests…</Text>}
				{requests && requests.length === 0 && <Text size={2} color="gray">No requests yet.</Text>}
				{requests && requests.length > 0 && (
					<ul className="flex flex-col gap-3">
						{requests.map(r => (
							<li key={r._id} className="rounded-lg border border-gray-6 bg-gray-1 p-4">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div className="min-w-0 flex-1">
										<Text size={3} weight="medium">{r.title}</Text>
										<Text size={2} color="gray" className="mt-1">
											Owner: {r.ownerSubject}
										</Text>
									</div>
									<Badge
										variant="soft"
										size={1}
										color={statusBadgeColor(r.status as HelpRequestStatus)}
									>
										{HELP_REQUEST_STATUS_LABEL[r.status as HelpRequestStatus]}
									</Badge>
								</div>
								<div className="mt-3 flex flex-wrap gap-2">
									<select
										className="min-h-10 min-w-[260px] rounded-md border border-gray-6 bg-gray-1 px-3"
										value={selectedByRequest[r._id] ?? ""}
										onChange={e =>
											setSelectedByRequest(prev => ({ ...prev, [r._id]: e.target.value }))}
									>
										<option value="">Select volunteer…</option>
										{volunteerOptions
											.filter(v => v.subject !== r.ownerSubject)
											.map(v => (
												<option key={v.subject} value={v.subject}>{v.label}</option>
											))}
									</select>
									<Button
										variant="solid"
										color="sage"
										isDisabled={assigningId === r._id || r.status !== "pending"}
										onPress={() => handleAssign(r._id)}
									>
										{assigningId === r._id ? "Assigning…" : "Assign volunteer"}
									</Button>
								</div>
								{r.assignedHelperSubject && (
									<Text size={1} color="gray" className="mt-2">
										Assigned helper: {r.assignedHelperSubject}
									</Text>
								)}
							</li>
						))}
					</ul>
				)}
			</section>

			<section className="flex flex-col gap-4">
				<Heading level={2} size={6}>Volunteer helpers</Heading>
				{volunteers === undefined && <Text size={2} color="gray">Loading volunteers…</Text>}
				{volunteers && volunteers.length === 0 && <Text size={2} color="gray">No volunteer profiles yet.</Text>}
				{volunteers && volunteers.length > 0 && (
					<ul className="grid gap-3 sm:grid-cols-2">
						{volunteers.map(v => (
							<li key={v._id} className="rounded-lg border border-gray-6 bg-gray-1 p-4">
								<Text size={3} weight="medium">{v.name ?? "Unnamed user"}</Text>
								<Text size={2} color="gray">{v.email ?? "No email on file"}</Text>
								<Text size={1} color="gray" className="mt-2 break-all">{v.subject}</Text>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
