"use client";

import { Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { Input, TextArea, TextField } from "@repo/ui/text-field";
import { useRouter } from "next/navigation";
import { NeededByField } from "../../needed-by-field";
import { useRequestDraft } from "../../request-draft-context";
import { RequestStepFooter } from "../../request-step-footer";

export default function OtherDetailsPage() {
	const router = useRouter();
	const { draft, setOtherDetails, setNeededBy } = useRequestDraft();
	const d = draft.otherDetails;

	function handleNext() {
		// `whenText` is no longer required: timing is now captured by the deadline
		// field, and this box is for optional nuance on top of it.
		if (!d.whatNeed.trim() || !d.location.trim()) {
			window.alert("Please fill in what you need and a location.");
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

				<NeededByField value={draft.neededBy} onChange={setNeededBy} />

				{/*
				  Kept as prose alongside the deadline. The deadline drives the admin
				  alert; this carries nuance a date cannot ("flexible this week").
				*/}
				<TextField
					name="whenText"
					value={d.whenText}
					onChange={v => setOtherDetails({ whenText: v })}
				>
					<Label>Anything else about timing?</Label>
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
