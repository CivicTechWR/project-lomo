"use client";

import { Checkbox } from "@repo/ui/checkbox";
import { Description, Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { Input, TextArea, TextField } from "@repo/ui/text-field";
import { useRouter } from "next/navigation";
import { AddressAutocompleteField } from "../../address-autocomplete-field";
import { useRequestDraft } from "../../request-draft-context";
import { RequestStepFooter } from "../../request-step-footer";

export default function ItemsDetailsPage() {
	const router = useRouter();
	const { draft, setItemsDetails } = useRequestDraft();
	const d = draft.itemsDetails;

	function handleNext() {
		if (d.needsDelivery) {
			if (!d.address.trim() || d.addressLat == null || d.addressLng == null) {
				window.alert(
					"Please choose a delivery address from the suggestions so we can match helpers nearby.",
				);
				return;
			}
		}
		router.push("/app/request/items/urgency");
	}

	return (
		<>
			<div className="flex flex-1 flex-col gap-5">
				<Heading size={7} className="text-center">
					Tell us a bit more
				</Heading>

				<TextField
					name="itemDescription"
					value={d.itemDescription}
					onChange={v => setItemsDetails({ itemDescription: v })}
				>
					<Label>What item(s) would help right now?</Label>
					<Group>
						<TextArea rows={5} placeholder="" />
					</Group>
				</TextField>

				<TextField
					name="sizeOrStyle"
					value={d.sizeOrStyle}
					onChange={v => setItemsDetails({ sizeOrStyle: v })}
				>
					<Label>Size or style (optional)</Label>
					<Group>
						<Input placeholder="" />
					</Group>
				</TextField>

				<div className="flex flex-col gap-2">
					<Text size={3} weight="medium" className="text-gray-12">
						Delivery
					</Text>
					<div className="rounded-2 border border-gray-6 bg-gray-2 p-4">
						<Checkbox
							isSelected={d.needsDelivery}
							onChange={(v) => {
								if (v) {
									setItemsDetails({ needsDelivery: true });
								}
								else {
									setItemsDetails({
										needsDelivery: false,
										address: "",
										addressLat: undefined,
										addressLng: undefined,
									});
								}
							}}
						>
							<Label>
								I need delivery (Picking up isn&apos;t an option)
							</Label>
						</Checkbox>

						{d.needsDelivery && (
							<div className="mt-4 flex flex-col gap-4 border-t border-gray-5 pt-4">
								<AddressAutocompleteField
									name="address"
									value={d.address}
									selectedLat={d.addressLat}
									selectedLng={d.addressLng}
									onChange={v => setItemsDetails({ address: v })}
									onSelect={({ label, lat, lng }) =>
										setItemsDetails({
											address: label,
											addressLat: lat,
											addressLng: lng,
										})}
									onClearSelection={() =>
										setItemsDetails({
											addressLat: undefined,
											addressLng: undefined,
										})}
								/>
								<TextField
									name="deliveryInstructions"
									value={d.deliveryInstructions}
									onChange={v =>
										setItemsDetails({ deliveryInstructions: v })}
								>
									<Label>Instructions</Label>
									<Description>e.g., side door, buzzer</Description>
									<Group>
										<Input placeholder="e.g., side door, buzzer" />
									</Group>
								</TextField>
							</div>
						)}
					</div>
				</div>
			</div>

			<RequestStepFooter
				onBack={() => router.push("/app/request")}
				onNext={handleNext}
			/>
		</>
	);
}
