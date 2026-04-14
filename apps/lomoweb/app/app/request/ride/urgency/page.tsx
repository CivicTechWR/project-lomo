"use client";

import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { URGENCY_OPTIONS } from "@/lib/request-flow/food";
import { useRouter } from "next/navigation";
import { useRequestDraft } from "../../request-draft-context";
import { RequestStepFooter } from "../../request-step-footer";
import { SelectionCard } from "../../selection-card";

export default function RideUrgencyPage() {
	const router = useRouter();
	const { draft, setUrgency } = useRequestDraft();

	return (
		<>
			<div className="flex flex-1 flex-col gap-4">
				<Heading size={7} className="text-center">
					Almost done
				</Heading>
				<Text size={3} color="gray">
					How urgent is this? (This helps us prioritize)
				</Text>

				<div className="mt-2 flex flex-col gap-3">
					{URGENCY_OPTIONS.map(opt => (
						<SelectionCard
							key={opt.id}
							title={opt.title}
							description={opt.description}
							selected={draft.urgency === opt.id}
							onClick={() => {
								setUrgency(opt.id);
								router.push("/app/request/ride/preview");
							}}
						/>
					))}
				</div>
			</div>

			<RequestStepFooter
				showNext={false}
				onBack={() => router.push("/app/request/ride/details")}
			/>
		</>
	);
}
