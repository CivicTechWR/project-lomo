"use client";

import type { FunctionReturnType } from "convex/server";
import type { HelpRequestStatus } from "@/lib/help-request-status";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Modal, ModalOverlay } from "@repo/ui/modal";
import { Text } from "@repo/ui/text";
import { Input, TextArea, TextField } from "@repo/ui/text-field";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";
import {
	HELP_REQUEST_CATEGORY_IDS,
	helpRequestCategoryLabel,
} from "@/lib/help-request-category";
import { HELP_REQUEST_STATUS_LABEL, statusBadgeColor } from "@/lib/help-request-status";

type AdminRequest = FunctionReturnType<typeof api.helpRequests.listAllForAdmin>[number];

export function AdminRequestDetail({
	request,
	onClose,
}: {
	request: AdminRequest | null;
	onClose: () => void;
}) {
	const updateRequest = useMutation(api.helpRequests.adminUpdateRequest);
	const deleteRequest = useMutation(api.helpRequests.adminDeleteRequest);

	const [title, setTitle] = useState("");
	const [summary, setSummary] = useState("");
	const [details, setDetails] = useState("");
	const [category, setCategory] = useState("");
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [confirmingDelete, setConfirmingDelete] = useState(false);

	// Reset the form whenever a different request is opened.
	const syncedRequestRef = useRef(request);
	if (request !== syncedRequestRef.current) {
		syncedRequestRef.current = request;
		setTitle(request?.title ?? "");
		setSummary(request?.summary ?? "");
		setDetails(request?.details ?? "");
		setCategory(request?.category ?? "");
		setConfirmingDelete(false);
	}

	if (!request) {
		return null;
	}
	const requestId = request._id;

	async function handleSave() {
		setSaving(true);
		try {
			await updateRequest({
				requestId,
				title,
				summary,
				details,
				category: category as AdminRequest["category"],
			});
			onClose();
		}
		catch (e) {
			console.error(e);
			window.alert(e instanceof Error ? e.message : "Could not save changes.");
		}
		finally {
			setSaving(false);
		}
	}

	async function handleDelete() {
		setDeleting(true);
		try {
			await deleteRequest({ requestId });
			onClose();
		}
		catch (e) {
			console.error(e);
			window.alert(e instanceof Error ? e.message : "Could not delete request.");
		}
		finally {
			setDeleting(false);
		}
	}

	const busy = saving || deleting;

	return (
		<ModalOverlay isOpen isDismissable={!busy} onOpenChange={open => !open && onClose()}>
			<Modal size={3} aria-label="Request details">
				<div className="flex flex-col gap-5">
					<div className="flex flex-wrap items-start justify-between gap-3">
						<Heading level={2} size={6}>Request details</Heading>
						<Badge
							variant="soft"
							size={1}
							color={statusBadgeColor(request.status as HelpRequestStatus)}
						>
							{HELP_REQUEST_STATUS_LABEL[request.status as HelpRequestStatus]}
						</Badge>
					</div>

					<div className="flex flex-col gap-1">
						<DetailRow
							label="Owner"
							value={request.owner?.name ?? request.owner?.email ?? "Unknown requester"}
						/>
						{request.assignedHelperUserId && (
							<DetailRow
								label="Assigned helper"
								value={request.assignedHelper?.name
									?? request.assignedHelper?.email ?? "Unknown helper"}
							/>
						)}
						{request.helperUserId && (
							<DetailRow
								label="Offering helper"
								value={request.helper?.name ?? request.helper?.email ?? "Unknown helper"}
							/>
						)}
					</div>

					<div className="flex flex-col gap-4 border-t border-gray-5 pt-5">
						<TextField value={title} onChange={setTitle} isDisabled={busy} className="w-full">
							<Label>Title</Label>
							<Group>
								<Input />
							</Group>
						</TextField>

						<label className="flex flex-col gap-1">
							<Text size={2} weight="medium">Category</Text>
							<select
								className="min-h-10 rounded-md border border-gray-6 bg-gray-1 px-3"
								value={category}
								disabled={busy}
								onChange={e => setCategory(e.target.value)}
							>
								{HELP_REQUEST_CATEGORY_IDS.map(id => (
									<option key={id} value={id}>{helpRequestCategoryLabel(id)}</option>
								))}
							</select>
						</label>

						<TextField value={summary} onChange={setSummary} isDisabled={busy} className="w-full">
							<Label>Summary</Label>
							<Group>
								<TextArea rows={2} />
							</Group>
						</TextField>

						<TextField value={details} onChange={setDetails} isDisabled={busy} className="w-full">
							<Label>Details</Label>
							<Group>
								<TextArea rows={5} />
							</Group>
						</TextField>
					</div>

					<div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-5 pt-5">
						{confirmingDelete
							? (
									<div className="flex w-full flex-col gap-2">
										<Text size={2} color="red">
											Delete this request permanently? This cannot be undone —
											its messages and notifications are removed too.
										</Text>
										<div className="flex flex-wrap gap-2">
											<Button
												variant="solid"
												color="red"
												isDisabled={busy}
												onPress={handleDelete}
											>
												{deleting ? "Deleting…" : "Delete permanently"}
											</Button>
											<Button
												variant="soft"
												color="gray"
												isDisabled={busy}
												onPress={() => setConfirmingDelete(false)}
											>
												Cancel
											</Button>
										</div>
									</div>
								)
							: (
									<>
										<Button
											variant="soft"
											color="red"
											isDisabled={busy}
											onPress={() => setConfirmingDelete(true)}
										>
											Delete
										</Button>
										<div className="flex flex-wrap gap-2">
											<Button
												variant="outline"
												color="gray"
												isDisabled={busy}
												onPress={onClose}
											>
												Cancel
											</Button>
											<Button
												variant="solid"
												color="sage"
												isDisabled={busy}
												onPress={handleSave}
											>
												{saving ? "Saving…" : "Save changes"}
											</Button>
										</div>
									</>
								)}
					</div>
				</div>
			</Modal>
		</ModalOverlay>
	);
}

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-3">
			<Text size={2} color="gray">{label}</Text>
			<Text size={2}>{value}</Text>
		</div>
	);
}
