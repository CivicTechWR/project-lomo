"use client";

import { Checkbox } from "@repo/ui/checkbox";
import { Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Input, TextField } from "@repo/ui/text-field";
import { Text } from "@repo/ui/text";
import { useRouter } from "next/navigation";
import { useRequestDraft } from "../../request-draft-context";
import { RequestStepFooter } from "../../request-step-footer";

export default function PaperworkDeliveryPage() {
	const router = useRouter();
	const { draft, setMicrograntDetails } = useRequestDraft();
	const d = draft.micrograntDetails;

	function setMethod(id: "e_transfer" | "gift_card" | "other", selected: boolean) {
		setMicrograntDetails({
			methods: selected
				? [...new Set([...d.methods, id])]
				: d.methods.filter(v => v !== id),
		});
	}

	function handleNext() {
		if (d.methods.length === 0) {
			window.alert("Choose at least one transfer method.");
			return;
		}
		router.push("/app/request/paperwork/preview");
	}

	return (
		<>
			<div className="flex flex-1 flex-col gap-5">
				<Heading size={7}>Microgrant support</Heading>
				<Text size={2} color="gray">
					We'll only ask for what's needed to complete the microgrant.
				</Text>

				<div className="rounded-lg border border-gray-6 bg-gray-2 p-4">
					<Text size={3} weight="medium">How should the microgrant be sent?</Text>
					<Text size={2} color="gray" className="mt-1">Choose at least one.</Text>
					<div className="mt-3 flex flex-col gap-3">
						<Checkbox
							isSelected={d.methods.includes("e_transfer")}
							onChange={v => setMethod("e_transfer", v)}
						>
							<Label>E-transfer</Label>
						</Checkbox>
						<Checkbox
							isSelected={d.methods.includes("gift_card")}
							onChange={v => setMethod("gift_card", v)}
						>
							<Label>Digital gift card</Label>
						</Checkbox>
						<Checkbox
							isSelected={d.methods.includes("other")}
							onChange={v => setMethod("other", v)}
						>
							<Label>Other</Label>
						</Checkbox>
					</div>
				</div>

				{d.methods.includes("other") && (
					<TextField
						name="otherMethodText"
						value={d.otherMethodText}
						onChange={v => setMicrograntDetails({ otherMethodText: v })}
					>
						<Label>Other method (specify)</Label>
						<Group><Input placeholder="e.g., community drop-off" /></Group>
					</TextField>
				)}

				{d.methods.includes("e_transfer") && (
					<div className="rounded-lg border border-gray-6 bg-gray-1 p-4">
						<TextField
							name="etransferContact"
							value={d.etransferContact}
							onChange={v => setMicrograntDetails({ etransferContact: v })}
						>
							<Label>Email address or phone number</Label>
							<Group><Input placeholder="Used only to send the microgrant" /></Group>
						</TextField>
						<TextField
							name="etransferPassword"
							value={d.etransferPassword}
							onChange={v => setMicrograntDetails({ etransferPassword: v })}
							className="mt-3"
						>
							<Label>Password, if needed (optional)</Label>
							<Group><Input placeholder="" /></Group>
						</TextField>
					</div>
				)}

				{d.methods.includes("gift_card") && (
					<div className="rounded-lg border border-gray-6 bg-gray-1 p-4">
						<TextField
							name="giftCardEmail"
							value={d.giftCardEmail}
							onChange={v => setMicrograntDetails({ giftCardEmail: v })}
						>
							<Label>Email address</Label>
							<Group><Input placeholder="" /></Group>
						</TextField>
						<TextField
							name="giftCardType"
							value={d.giftCardType}
							onChange={v => setMicrograntDetails({ giftCardType: v })}
							className="mt-3"
						>
							<Label>Gift card type</Label>
							<Group><Input placeholder="Store name" /></Group>
						</TextField>
					</div>
				)}

				{d.methods.includes("other") && (
					<TextField
						name="otherTransferDetails"
						value={d.otherTransferDetails}
						onChange={v => setMicrograntDetails({ otherTransferDetails: v })}
					>
						<Label>Transfer details</Label>
						<Group><Input placeholder="e.g., cashapp, venmo, etc." /></Group>
					</TextField>
				)}
			</div>
			<RequestStepFooter
				onBack={() => router.push("/app/request/paperwork/details")}
				onNext={handleNext}
			/>
		</>
	);
}
