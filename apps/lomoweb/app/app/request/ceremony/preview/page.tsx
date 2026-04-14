"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import { useMutation } from "convex/react";
import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import {
	ceremonyRequestListSummary,
	ceremonyRequestTitle,
	summarizeCeremonyDraftBody,
} from "@/lib/request-flow/summarize-ceremony-draft";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRequestDraft } from "../../request-draft-context";
import { RequestStepFooter } from "../../request-step-footer";

export default function CeremonyPreviewPage() {
	const router = useRouter();
	const { draft, resetDraft } = useRequestDraft();
	const createRequest = useMutation(api.helpRequests.create);
	const [posting, setPosting] = useState(false);

	const title = ceremonyRequestTitle(draft);
	const body = summarizeCeremonyDraftBody(draft);

	async function postRequest() {
		if (!draft.ceremonyDetails.role || !draft.ceremonyDetails.whatNeed.trim()) {
			window.alert("Please choose a role and tell us what you need.");
			return;
		}
		setPosting(true);
		try {
			await createRequest({
				category: "ceremony",
				title,
				summary: ceremonyRequestListSummary(draft),
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
				<div className="rounded-lg border border-gray-6 bg-gray-1 p-4">
					<Text size={3} weight="medium">{title}</Text>
					<Text size={2} className="mt-3 whitespace-pre-wrap">{body}</Text>
				</div>
				<Button
					variant="outline"
					className="w-full"
					isDisabled={posting}
					onPress={() => router.push("/app/request/ceremony/details")}
				>
					Edit
				</Button>
			</div>
			<div className="flex w-full flex-col gap-3 pt-6">
				<RequestStepFooter
					onBack={() => router.push("/app/request/ceremony/details")}
					onNext={postRequest}
					nextLabel="Post"
					nextDisabled={posting}
				/>
			</div>
		</>
	);
}
