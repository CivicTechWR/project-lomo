"use client";

import { Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Input, TextArea, TextField } from "@repo/ui/text-field";
import { Text } from "@repo/ui/text";
import { useRouter } from "next/navigation";
import { useRequestDraft } from "../../request-draft-context";
import { RequestStepFooter } from "../../request-step-footer";

export default function OtherDetailsPage() {
	const router = useRouter();
	const { draft, setOtherDetails } = useRequestDraft();
	const d = draft.otherDetails;

	function handleNext() {
		if (!d.whatNeed.trim() || !d.whenText.trim() || !d.location.trim()) {
			window.alert("Please fill in what you need, when, and location.");
			return;
		}
		router.push("/app/request/other/preview");
	}

	return (
		<>
			<div className="flex flex-1 flex-col gap-5">
				<Heading size={7} className="text-center">
					Other request
				</Heading>
				<Text size={2} color="gray" className="text-center">
					Describe your situation in your own words.
				</Text>

				<TextField
					name="whatNeed"
					value={d.whatNeed}
					onChange={v => setOtherDetails({ whatNeed: v })}
				>
					<Label>What do you need?</Label>
					<Group>
						<TextArea rows={5} placeholder="" />
					</Group>
				</TextField>

				<TextField
					name="whenText"
					value={d.whenText}
					onChange={v => setOtherDetails({ whenText: v })}
				>
					<Label>When?</Label>
					<Group>
						<Input placeholder="e.g. Saturday morning, flexible this week" />
					</Group>
				</TextField>

				<TextField
					name="location"
					value={d.location}
					onChange={v => setOtherDetails({ location: v })}
				>
					<Label>Location</Label>
					<Group>
						<Input placeholder="Neighbourhood, landmark, or address" />
					</Group>
				</TextField>
			</div>

			<div className="flex w-full flex-col gap-3 pt-6">
				<RequestStepFooter
					onBack={() => router.push("/app/request")}
					onNext={handleNext}
					nextLabel="Continue"
				/>
			</div>
		</>
	);
}
