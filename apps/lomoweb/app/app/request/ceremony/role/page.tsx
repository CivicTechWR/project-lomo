"use client";

import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { useRouter } from "next/navigation";
import { useRequestDraft } from "../../request-draft-context";
import { RequestStepFooter } from "../../request-step-footer";
import { SelectionCard } from "../../selection-card";

export default function CeremonyRolePage() {
	const router = useRouter();
	const { draft, setCeremonyDetails } = useRequestDraft();
	const selected = draft.ceremonyDetails.role;

	return (
		<>
			<div className="flex flex-1 flex-col gap-4">
				<Heading size={7}>Ceremony support</Heading>
				<Text size={2} color="gray">
					Support roles for community ceremony.
				</Text>
				<SelectionCard
					selected={selected === "firekeeping"}
					title="Firekeeping"
					description="Keeping the ceremonial fire tended"
					onClick={() => {
						setCeremonyDetails({ role: "firekeeping" });
						router.push("/app/request/ceremony/details");
					}}
				/>
				<SelectionCard
					selected={selected === "ceremony_support"}
					title="Ceremony support"
					description="General help before, during, or after ceremony"
					onClick={() => {
						setCeremonyDetails({ role: "ceremony_support" });
						router.push("/app/request/ceremony/details");
					}}
				/>
				<Text size={1} color="gray">
					Ceremony roles are offered in respect of the traditions being
					practiced. Specific guidance will be shared by organizers.
				</Text>
			</div>
			<RequestStepFooter
				showNext={false}
				onBack={() => router.push("/app/request")}
			/>
		</>
	);
}
