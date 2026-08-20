"use client";

import type { Id } from "@repo/convex-backend/convex/_generated/dataModel";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Category Options                                 */
/* -------------------------------------------------------------------------- */

const CATEGORY_OPTIONS = [
	{ value: "food", label: "Food" },
	{ value: "items", label: "Items" },
	{ value: "other", label: "Other" },
	{ value: "support", label: "Support" },
	{ value: "paperwork", label: "Paperwork" },
	{ value: "ceremony", label: "Ceremony" },
] as const;

type CategoryValue = (typeof CATEGORY_OPTIONS)[number]["value"];

/* -------------------------------------------------------------------------- */
/*                           EditRequestSkeleton                                */
/* -------------------------------------------------------------------------- */

function EditRequestSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<div className="h-8 w-48 animate-pulse rounded bg-terracotta-3" />
			<Card border="medium" borderColor="terracotta" size={2} className="rounded-[20px]">
				<div className="flex flex-col gap-4">
					<div className="h-4 w-20 animate-pulse rounded bg-terracotta-3" />
					<div className="h-10 w-full animate-pulse rounded bg-terracotta-3" />
					<div className="h-4 w-24 animate-pulse rounded bg-terracotta-3" />
					<div className="h-10 w-full animate-pulse rounded bg-terracotta-3" />
					<div className="h-4 w-16 animate-pulse rounded bg-terracotta-3" />
					<div className="h-24 w-full animate-pulse rounded bg-terracotta-3" />
					<div className="h-4 w-24 animate-pulse rounded bg-terracotta-3" />
					<div className="h-10 w-full animate-pulse rounded bg-terracotta-3" />
				</div>
			</Card>
			<div className="flex gap-3">
				<div className="h-11 w-24 animate-pulse rounded-full bg-terracotta-3" />
				<div className="h-11 w-24 animate-pulse rounded-full bg-terracotta-3" />
			</div>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                            EditRequestForm                                   */
/* -------------------------------------------------------------------------- */

interface RequestData {
	_id: Id<"helpRequests">;
	title: string;
	summary: string;
	details: string;
	category: string;
}

function EditRequestForm({ request }: { request: RequestData }) {
	const router = useRouter();
	const updateRequest = useMutation(api.helpRequests.adminUpdateRequest);

	const [title, setTitle] = useState(request.title);
	const [summary, setSummary] = useState(request.summary);
	const [details, setDetails] = useState(request.details);
	const [category, setCategory] = useState<CategoryValue>(request.category as CategoryValue);

	const [titleError, setTitleError] = useState<string | null>(null);
	const [summaryError, setSummaryError] = useState<string | null>(null);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	const titleRef = useRef<HTMLInputElement>(null);

	// Auto-focus title field on mount
	useEffect(() => {
		titleRef.current?.focus();
	}, []);

	const validate = useCallback((): boolean => {
		let valid = true;

		if (title.trim().length === 0) {
			setTitleError("Title cannot be empty.");
			valid = false;
		}
		else {
			setTitleError(null);
		}

		if (summary.trim().length === 0) {
			setSummaryError("Summary cannot be empty.");
			valid = false;
		}
		else {
			setSummaryError(null);
		}

		return valid;
	}, [title, summary]);

	const handleSave = useCallback(async () => {
		if (!validate()) {
			return;
		}

		setIsSaving(true);
		setSubmitError(null);

		// Only send fields that have changed
		const updates: {
			requestId: Id<"helpRequests">;
			title?: string;
			summary?: string;
			details?: string;
			category?: CategoryValue;
		} = { requestId: request._id };

		if (title.trim() !== request.title) {
			updates.title = title.trim();
		}
		if (summary.trim() !== request.summary) {
			updates.summary = summary.trim();
		}
		if (details !== request.details) {
			updates.details = details;
		}
		if (category !== request.category) {
			updates.category = category;
		}

		try {
			await updateRequest(updates);
			router.push(`/app/admin/requests/${request._id}`);
		}
		catch {
			setSubmitError("Failed to save changes. Please try again.");
		}
		finally {
			setIsSaving(false);
		}
	}, [validate, title, summary, details, category, request, updateRequest, router]);

	const handleCancel = useCallback(() => {
		router.push(`/app/admin/requests/${request._id}`);
	}, [router, request._id]);

	return (
		<div className="flex flex-col gap-6">
			<Card border="medium" borderColor="terracotta" size={2} className="rounded-[20px]">
				<div className="flex flex-col gap-5">
					{/* Title field */}
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="edit-title"
							className="text-sm font-medium text-terracotta-9"
						>
							Title
						</label>
						<input
							ref={titleRef}
							id="edit-title"
							type="text"
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
								if (titleError)
									setTitleError(null);
							}}
							aria-describedby={titleError ? "edit-title-error" : undefined}
							aria-invalid={!!titleError}
							className={`
								w-full rounded-lg border px-3 py-2 text-sm text-terracotta-9
								focus:outline-none focus:ring-2 focus:ring-terracotta-9 focus:ring-offset-2
								${titleError ? "border-red-8" : "border-terracotta-6"}
							`}
						/>
						{titleError && (
							<Text
								id="edit-title-error"
								size={1}
								className="text-red-9"
								role="alert"
							>
								{titleError}
							</Text>
						)}
					</div>

					{/* Summary field */}
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="edit-summary"
							className="text-sm font-medium text-terracotta-9"
						>
							Summary
						</label>
						<input
							id="edit-summary"
							type="text"
							value={summary}
							onChange={(e) => {
								setSummary(e.target.value);
								if (summaryError)
									setSummaryError(null);
							}}
							aria-describedby={summaryError ? "edit-summary-error" : undefined}
							aria-invalid={!!summaryError}
							className={`
								w-full rounded-lg border px-3 py-2 text-sm text-terracotta-9
								focus:outline-none focus:ring-2 focus:ring-terracotta-9 focus:ring-offset-2
								${summaryError ? "border-red-8" : "border-terracotta-6"}
							`}
						/>
						{summaryError && (
							<Text
								id="edit-summary-error"
								size={1}
								className="text-red-9"
								role="alert"
							>
								{summaryError}
							</Text>
						)}
					</div>

					{/* Details field */}
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="edit-details"
							className="text-sm font-medium text-terracotta-9"
						>
							Details
						</label>
						<textarea
							id="edit-details"
							value={details}
							onChange={e => setDetails(e.target.value)}
							rows={5}
							className="w-full rounded-lg border border-terracotta-6 px-3 py-2 text-sm text-terracotta-9 focus:outline-none focus:ring-2 focus:ring-terracotta-9 focus:ring-offset-2"
						/>
					</div>

					{/* Category field */}
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="edit-category"
							className="text-sm font-medium text-terracotta-9"
						>
							Category
						</label>
						<select
							id="edit-category"
							value={category}
							onChange={e => setCategory(e.target.value as CategoryValue)}
							className="w-full rounded-lg border border-terracotta-6 bg-white px-3 py-2 text-sm text-terracotta-9 focus:outline-none focus:ring-2 focus:ring-terracotta-9 focus:ring-offset-2"
						>
							{CATEGORY_OPTIONS.map(opt => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>
				</div>
			</Card>

			{/* Submit error */}
			{submitError && (
				<Text
					size={2}
					className="text-red-9"
					role="alert"
					aria-live="assertive"
				>
					{submitError}
				</Text>
			)}

			{/* Action buttons */}
			<div className="flex flex-col gap-3 sm:flex-row">
				<Button
					variant="solid"
					color="yellow"
					size={3}
					onPress={() => void handleSave()}
					isDisabled={isSaving}
					className="min-h-[44px] min-w-[44px]"
				>
					{isSaving ? "Saving…" : "Save"}
				</Button>
				<Button
					variant="outline"
					color="gray"
					size={3}
					onPress={handleCancel}
					isDisabled={isSaving}
					className="min-h-[44px] min-w-[44px]"
				>
					Cancel
				</Button>
			</div>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                             EditRequestPage                                  */
/* -------------------------------------------------------------------------- */

export default function EditRequestPage() {
	const params = useParams();
	const router = useRouter();
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
				{isLoading ? "Loading request for editing" : "Request loaded"}
			</div>

			{/* Back button */}
			<button
				type="button"
				onClick={() => router.push(`/app/admin/requests/${requestId}`)}
				className="mb-6 min-h-[44px] self-start rounded-full border-2 border-terracotta-6 px-4 py-2 text-sm font-medium text-terracotta-9 transition-colors hover:bg-terracotta-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-9 focus-visible:ring-offset-2"
				aria-label="Go back to request detail"
			>
				← Back
			</button>

			<Heading level={1} size={6} weight="bold" className="mb-6">
				Edit Request
			</Heading>

			{isLoading
				? <EditRequestSkeleton />
				: request === null
					? (
							<div className="flex flex-col items-center gap-4 py-12">
								<Text size={3} color="terracotta">
									This request no longer exists.
								</Text>
								<button
									type="button"
									onClick={() => router.push("/app/admin/requests")}
									className="min-h-[44px] rounded-full border-2 border-terracotta-6 px-4 py-2 text-sm font-medium text-terracotta-9 transition-colors hover:bg-terracotta-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-9 focus-visible:ring-offset-2"
								>
									← Back to requests
								</button>
							</div>
						)
					: <EditRequestForm request={request} />}
		</div>
	);
}
