"use client";

import { Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Input, TextArea, TextField } from "@repo/ui/text-field";
import { Text } from "@repo/ui/text";
import { useRouter } from "next/navigation";
import { useRequestDraft } from "../../request-draft-context";
import { RequestStepFooter } from "../../request-step-footer";

export default function CeremonyDetailsPage() {
	const router = useRouter();
	const { draft, setCeremonyDetails } = useRequestDraft();
	const d = draft.ceremonyDetails;

	function handleNext() {
		if (!d.whatNeed.trim() || !d.whenText.trim() || !d.locationAddress.trim()) {
			window.alert("Please share what you need, when, and location.");
			return;
		}
		router.push("/app/request/ceremony/preview");
	}

	return (
		<>
			<div className="flex flex-1 flex-col gap-5">
				<Heading size={7}>Tell us a bit more</Heading>
				<Text size={2} color="gray">
					Share only what feels okay. You can keep this general.
				</Text>

				<TextField
					name="whatNeed"
					value={d.whatNeed}
					onChange={v => setCeremonyDetails({ whatNeed: v })}
				>
					<Label>What do you need?</Label>
					<Group><TextArea rows={3} placeholder="A few words about the help needed" /></Group>
				</TextField>

				<TextField
					name="ceremonyType"
					value={d.ceremonyType}
					onChange={v => setCeremonyDetails({ ceremonyType: v })}
				>
					<Label>Type of ceremony? (optional)</Label>
					<Group><Input placeholder="e.g., sweat lodge, healing circle" /></Group>
				</TextField>

				<TextField
					name="durationApprox"
					value={d.durationApprox}
					onChange={v => setCeremonyDetails({ durationApprox: v })}
				>
					<Label>How long do you need help? (approximate)</Label>
					<Group><Input placeholder="This helps people understand commitment" /></Group>
				</TextField>

				<TextField
					name="helperNotes"
					value={d.helperNotes}
					onChange={v => setCeremonyDetails({ helperNotes: v })}
				>
					<Label>Anything helpers should know? (optional)</Label>
					<Group><TextArea rows={3} placeholder="Protocols, boundaries, important notes" /></Group>
				</TextField>

				<TextField
					name="whenText"
					value={d.whenText}
					onChange={v => setCeremonyDetails({ whenText: v })}
				>
					<Label>When?</Label>
					<Group><Input placeholder="e.g., Saturday at dawn" /></Group>
				</TextField>

				<TextField
					name="locationAddress"
					value={d.locationAddress}
					onChange={v => setCeremonyDetails({ locationAddress: v })}
				>
					<Label>Location of ceremony</Label>
					<Group><Input placeholder="Address" /></Group>
				</TextField>

				<TextField
					name="locationDirections"
					value={d.locationDirections}
					onChange={v => setCeremonyDetails({ locationDirections: v })}
				>
					<Label>Directions or instructions (optional)</Label>
					<Group><Input placeholder="" /></Group>
				</TextField>
			</div>
			<RequestStepFooter
				onBack={() => router.push("/app/request/ceremony/role")}
				onNext={handleNext}
			/>
		</>
	);
}
