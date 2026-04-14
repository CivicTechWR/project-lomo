"use client";

import { Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Input, TextArea, TextField } from "@repo/ui/text-field";
import { Text } from "@repo/ui/text";
import { useRouter } from "next/navigation";
import { useRequestDraft } from "../../request-draft-context";
import { RequestStepFooter } from "../../request-step-footer";

const NEED_OPTIONS = [
	{ id: "education_career", label: "Education or career based" },
	{ id: "food_groceries", label: "Food or groceries" },
	{ id: "transportation", label: "Transportation" },
	{ id: "medication_health", label: "Medication or health costs" },
	{ id: "phone_internet", label: "Phone or internet" },
	{ id: "utilities_bills", label: "Utilities or bills" },
	{ id: "clothing_essentials", label: "Clothing or essentials" },
	{ id: "something_else", label: "Something else" },
] as const;

const AMOUNT_OPTIONS = [
	{ id: "under_25", label: "Under $25" },
	{ id: "25_50", label: "$25-$50" },
	{ id: "50_100", label: "$50-$100" },
	{ id: "100_plus", label: "$100+" },
] as const;

export default function PaperworkDetailsPage() {
	const router = useRouter();
	const { draft, setMicrograntDetails } = useRequestDraft();
	const d = draft.micrograntDetails;

	function handleNext() {
		if (!d.needType || !d.amountRange || !d.needByText.trim()) {
			window.alert("Please choose what this helps with, amount, and timing.");
			return;
		}
		router.push("/app/request/paperwork/delivery");
	}

	return (
		<>
			<div className="flex flex-1 flex-col gap-5">
				<Heading size={7}>Microgrant support</Heading>
				<Text size={2} color="gray">
					Small, one-time financial help. Limited funds. Not guaranteed.
				</Text>

				<div className="rounded-lg border border-gray-6 bg-gray-2 p-4">
					<Text size={3} weight="medium">What would this help with?</Text>
					<Text size={2} color="gray" className="mt-1">
						Choose the option that fits best.
					</Text>
					<div className="mt-3 flex flex-col gap-2">
						{NEED_OPTIONS.map(opt => (
							<button
								key={opt.id}
								type="button"
								className={
									d.needType === opt.id
										? "rounded-lg border border-gray-8 bg-gray-3 px-3 py-2 text-left"
										: "rounded-lg border border-gray-6 bg-gray-1 px-3 py-2 text-left"
								}
								onClick={() => setMicrograntDetails({ needType: opt.id })}
							>
								{opt.label}
							</button>
						))}
					</div>
					{d.needType === "something_else" && (
						<TextField
							name="needOtherText"
							value={d.needOtherText}
							onChange={v => setMicrograntDetails({ needOtherText: v })}
							className="mt-3"
						>
							<Label>Tell us what this would help with</Label>
							<Group><Input placeholder="Something else…" /></Group>
						</TextField>
					)}
				</div>

				<div className="rounded-lg border border-gray-6 bg-gray-2 p-4">
					<Text size={3} weight="medium">About how much would help?</Text>
					<Text size={2} color="gray" className="mt-1">Select a range.</Text>
					<div className="mt-3 flex flex-wrap gap-2">
						{AMOUNT_OPTIONS.map(opt => (
							<button
								key={opt.id}
								type="button"
								className={
									d.amountRange === opt.id
										? "rounded-full border border-gray-8 bg-gray-3 px-3 py-1.5"
										: "rounded-full border border-gray-6 bg-gray-1 px-3 py-1.5"
								}
								onClick={() => setMicrograntDetails({ amountRange: opt.id })}
							>
								{opt.label}
							</button>
						))}
					</div>
					{d.amountRange === "100_plus" && (
						<TextField
							name="amountOver100Text"
							value={d.amountOver100Text}
							onChange={v => setMicrograntDetails({ amountOver100Text: v })}
							className="mt-3"
						>
							<Label>For $100+, what amount range should we consider?</Label>
							<Group><Input placeholder="e.g., 120 to 150" /></Group>
						</TextField>
					)}
				</div>

				<TextField
					name="needByText"
					value={d.needByText}
					onChange={v => setMicrograntDetails({ needByText: v })}
				>
					<Label>When do you need this by?</Label>
					<Group><Input placeholder="e.g., today, tomorrow, Monday" /></Group>
				</TextField>

				<TextField
					name="optionalDetails"
					value={d.optionalDetails}
					onChange={v => setMicrograntDetails({ optionalDetails: v })}
				>
					<Label>Would you like to share any details? (optional)</Label>
					<Group><TextArea rows={4} placeholder="Share only what feels helpful." /></Group>
				</TextField>
			</div>
			<RequestStepFooter
				onBack={() => router.push("/app/request")}
				onNext={handleNext}
			/>
		</>
	);
}
