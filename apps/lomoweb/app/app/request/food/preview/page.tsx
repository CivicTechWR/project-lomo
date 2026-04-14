"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import { useMutation } from "convex/react";
import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { FOOD_KIND_OPTIONS, URGENCY_OPTIONS } from "@/lib/request-flow/food";
import {
	foodRequestListSummary,
	foodRequestTitle,
	summarizeFoodDraftBody,
} from "@/lib/request-flow/summarize-food-draft";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRequestDraft } from "../../request-draft-context";
import { RequestStepFooter } from "../../request-step-footer";

export default function FoodPreviewPage() {
	const router = useRouter();
	const { draft, resetDraft } = useRequestDraft();
	const createRequest = useMutation(api.helpRequests.create);
	const [posting, setPosting] = useState(false);

	const title = foodRequestTitle(draft);
	const urgencyLabel
		= URGENCY_OPTIONS.find(o => o.id === draft.urgency)?.title ?? "—";
	const body = summarizeFoodDraftBody(draft);

	async function postRequest() {
		setPosting(true);
		try {
			await createRequest({
				category: "food",
				title,
				summary: foodRequestListSummary(draft),
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

				<div className="flex gap-3">
					<div
						className="size-14 shrink-0 rounded-full bg-gray-4"
						aria-hidden
					/>
					<div className="min-w-0 flex-1">
						<Text size={4} weight="medium">
							{title}
						</Text>
						<Text size={2} color="gray">
							From you
						</Text>
						<Text size={2} weight="medium" className="mt-1 text-terracotta-11">
							{urgencyLabel}
						</Text>
					</div>
				</div>

				<div className="rounded-lg border border-gray-6 bg-gray-1 p-4">
					<Text size={2} className="whitespace-pre-wrap">
						{body}
					</Text>
					<div className="mt-4 flex gap-6 border-t border-gray-5 pt-3">
						<div>
							<Text size={1} color="gray" weight="medium">
								Time
							</Text>
							<Text size={2}>When you&apos;re matched</Text>
						</div>
						<div>
							<Text size={1} color="gray" weight="medium">
								Duration
							</Text>
							<Text size={2}>As needed</Text>
						</div>
					</div>
				</div>

				<Button
					variant="outline"
					className="w-full"
					isDisabled={posting}
					onPress={() => router.push("/app/request/food/details")}
				>
					Edit
				</Button>
			</div>

			<div className="flex w-full flex-col gap-3 pt-6">
				<RequestStepFooter
					onBack={() => router.push("/app/request/food/urgency")}
					onNext={postRequest}
					nextLabel="Post"
					nextDisabled={posting}
				/>
			</div>
		</>
	);
}
