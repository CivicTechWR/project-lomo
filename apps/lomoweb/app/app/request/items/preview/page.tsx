"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import { useMutation } from "convex/react";
import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { URGENCY_OPTIONS } from "@/lib/request-flow/food";
import {
	itemsRequestListSummary,
	itemsRequestTitle,
	summarizeItemsDraftBody,
} from "@/lib/request-flow/summarize-items-draft";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRequestDraft } from "../../request-draft-context";
import { RequestStepFooter } from "../../request-step-footer";

export default function ItemsPreviewPage() {
	const router = useRouter();
	const { draft, resetDraft } = useRequestDraft();
	const createRequest = useMutation(api.helpRequests.create);
	const [posting, setPosting] = useState(false);

	const title = itemsRequestTitle(draft);
	const urgencyLabel
		= URGENCY_OPTIONS.find(o => o.id === draft.urgency)?.title ?? "—";
	const body = summarizeItemsDraftBody(draft);

	async function postRequest() {
		if (!draft.itemsDetails.itemDescription.trim()) {
			window.alert("Please describe what item(s) would help.");
			return;
		}
		setPosting(true);
		try {
			await createRequest({
				category: "items",
				title,
				summary: itemsRequestListSummary(draft),
				details: body,
				payload: JSON.stringify({ v: 1, draft }),
			});
			resetDraft();
			router.replace("/app");
		}
		catch (e) {
			console.error(e);
			window.alert(
				e instanceof Error ? e.message : "Could not post your request.",
			);
		}
		finally {
			setPosting(false);
		}
	}

	return (
		<>
			<div className="flex flex-1 flex-col gap-5">
				<Heading size={7}>Request preview</Heading>

				<div className="flex flex-col gap-3 sm:flex-row sm:items-start">
					<div
						className="size-14 shrink-0 rounded-full bg-gray-4"
						aria-hidden
					/>
					<div className="flex min-w-0 flex-1 flex-col gap-1">
						<Text size={4} weight="medium">
							{title}
						</Text>
						<Text size={2} color="gray">
							From you
						</Text>
						<Text size={2} weight="medium" className="text-terracotta-11">
							{`Urgency: ${urgencyLabel}`}
						</Text>
					</div>
				</div>

				<div className="rounded-lg border border-gray-6 bg-gray-1 p-4">
					<Text size={2} className="whitespace-pre-wrap">
						{body}
					</Text>
					<div className="mt-4 flex flex-col gap-2 border-t border-gray-5 pt-3">
						<Text size={2}>Time: When you&apos;re matched</Text>
						<Text size={2}>Duration: As needed</Text>
					</div>
				</div>

				<Button
					variant="outline"
					className="w-full"
					isDisabled={posting}
					onPress={() => router.push("/app/request/items/details")}
				>
					Edit
				</Button>
			</div>

			<div className="flex w-full flex-col gap-3 pt-6">
				<RequestStepFooter
					onBack={() => router.push("/app/request/items/urgency")}
					onNext={postRequest}
					nextLabel="Post"
					nextDisabled={posting}
				/>
			</div>
		</>
	);
}
