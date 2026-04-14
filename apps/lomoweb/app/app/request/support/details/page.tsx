"use client";

import { Checkbox } from "@repo/ui/checkbox";
import { Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Input, TextField } from "@repo/ui/text-field";
import { Text } from "@repo/ui/text";
import { useRouter } from "next/navigation";
import { useRequestDraft } from "../../request-draft-context";
import { RequestStepFooter } from "../../request-step-footer";

const WALK_LENGTH_OPTIONS = [
	{ id: "10_15", label: "10-15 minutes" },
	{ id: "20_30", label: "20-30 minutes" },
	{ id: "45_60", label: "45-60 minutes" },
] as const;

const WALK_TYPE_OPTIONS = [
	{
		id: "slow_scenic",
		label: "Slow & scenic",
		description: "Pausing, gentle pace, noticing surroundings",
	},
	{
		id: "conversational",
		label: "Conversational",
		description: "Easy talk while walking, shared company",
	},
	{
		id: "quiet_presence",
		label: "Quiet presence",
		description: "Being together without pressure to talk",
	},
	{
		id: "grounding",
		label: "Grounding",
		description: "Focused on movement, breath, or getting regulated",
	},
	{
		id: "not_sure_yet",
		label: "Not sure yet",
		description: "We'll figure it out together",
	},
] as const;

export default function SupportDetailsPage() {
	const router = useRouter();
	const { draft, setPublicWalkDetails } = useRequestDraft();
	const d = draft.publicWalkDetails;

	function toggleWalkType(id: (typeof WALK_TYPE_OPTIONS)[number]["id"]) {
		const exists = d.walkTypes.includes(id);
		setPublicWalkDetails({
			walkTypes: exists
				? d.walkTypes.filter(v => v !== id)
				: [...d.walkTypes, id],
		});
	}

	function handleNext() {
		if (!d.preferredTime.trim() || !d.location.trim()) {
			window.alert("Please add a preferred time and a public walk location.");
			return;
		}
		router.push("/app/request/support/preview");
	}

	return (
		<>
			<div className="flex flex-1 flex-col gap-5">
				<Heading size={7}>Walk together</Heading>
				<Text size={2} color="gray">
					Walks are in public spaces only. Either person can end the walk at any
					time.
				</Text>

				<TextField
					name="preferredTime"
					value={d.preferredTime}
					onChange={v => setPublicWalkDetails({ preferredTime: v })}
				>
					<Label>When would you like to walk?</Label>
					<Group>
						<Input placeholder="Preferred time (date and time)" />
					</Group>
				</TextField>

				<div className="flex flex-col gap-2">
					<Text size={3} weight="medium">About how long?</Text>
					<Text size={2} color="gray">Approximate length (optional)</Text>
					<div className="flex flex-wrap gap-2">
						{WALK_LENGTH_OPTIONS.map(opt => (
							<button
								key={opt.id}
								type="button"
								onClick={() =>
									setPublicWalkDetails({
										walkLength: d.walkLength === opt.id ? null : opt.id,
									})}
								className={
									d.walkLength === opt.id
										? "rounded-full border border-gray-8 bg-gray-3 px-3 py-1.5 text-[length:var(--text-2)]"
										: "rounded-full border border-gray-6 bg-gray-1 px-3 py-1.5 text-[length:var(--text-2)]"
								}
							>
								{opt.label}
							</button>
						))}
					</div>
					<Text size={1} color="gray">This is just a guide, not a commitment.</Text>
				</div>

				<TextField
					name="location"
					value={d.location}
					onChange={v => setPublicWalkDetails({ location: v })}
				>
					<Label>Where should the walk be?</Label>
					<Group>
						<Input placeholder="e.g., park, main street, trail entrance" />
					</Group>
				</TextField>
				<Text size={1} color="gray">Please choose a public, well-lit place.</Text>

				<div className="rounded-lg border border-gray-6 bg-gray-2 p-4">
					<Text size={3} weight="medium">
						What kind of walk is this? (Optional)
					</Text>
					<Text size={2} color="gray" className="mt-1">
						Choose what feels right today. You can change your mind anytime.
					</Text>
					<div className="mt-3 flex flex-col gap-3">
						{WALK_TYPE_OPTIONS.map(opt => (
							<Checkbox
								key={opt.id}
								isSelected={d.walkTypes.includes(opt.id)}
								onChange={() => toggleWalkType(opt.id)}
							>
								<div>
									<Label>{opt.label}</Label>
									<Text size={1} color="gray">{opt.description}</Text>
								</div>
							</Checkbox>
						))}
					</div>
				</div>

				<Text size={1} color="gray">
					You can pause or stop this request at any time.
				</Text>
			</div>

			<RequestStepFooter
				onBack={() => router.push("/app/request")}
				onNext={handleNext}
			/>
		</>
	);
}
