"use client";

import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { Description, Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Input, TextArea, TextField } from "@repo/ui/text-field";
import { Text } from "@repo/ui/text";
import type { GroceryTypeId } from "@/lib/request-flow/types";
import { GROCERY_TYPE_OPTIONS } from "@/lib/request-flow/food";
import { useRouter } from "next/navigation";
import { useRequestDraft } from "../../request-draft-context";
import { RequestStepFooter } from "../../request-step-footer";

function groceryTileClass(selected: boolean): string {
	if (selected) {
		return "flex min-h-[4.25rem] flex-col items-center justify-center rounded-lg border border-gray-8 bg-gray-3 p-2 text-center shadow-sm transition-colors";
	}
	return "flex min-h-[4.25rem] flex-col items-center justify-center rounded-lg border border-gray-6 bg-gray-1 p-2 text-center transition-colors hover:border-gray-7 hover:bg-gray-2";
}

export default function FoodDetailsPage() {
	const router = useRouter();
	const { draft, setFoodDetails } = useRequestDraft();
	const d = draft.foodDetails;
	const isGroceries = draft.foodKind === "groceries";

	function toggleGroceryType(id: GroceryTypeId) {
		const nextTypes = d.groceryTypes.includes(id)
			? d.groceryTypes.filter(t => t !== id)
			: [...d.groceryTypes, id];
		setFoodDetails({
			groceryNoPreference: false,
			groceryTypes: nextTypes,
		});
	}

	function handleNext() {
		router.push("/app/request/food/urgency");
	}

	return (
		<>
			<div className="flex flex-1 flex-col gap-5">
				<Heading size={7} className="text-center">
					Tell us a bit more
				</Heading>

				{isGroceries && (
					<fieldset className="flex flex-col gap-3 border-0 p-0">
						<legend className="mb-1 text-[length:var(--text-3)] font-medium text-gray-12">
							What types of groceries?
						</legend>
						<div className="grid grid-cols-4 gap-2">
							{GROCERY_TYPE_OPTIONS.map(opt => {
								const selected
									= !d.groceryNoPreference && d.groceryTypes.includes(opt.id);
								return (
									<button
										key={opt.id}
										type="button"
										className={groceryTileClass(selected)}
										aria-pressed={selected}
										onClick={() => toggleGroceryType(opt.id)}
									>
										<span className="text-[length:var(--text-2)] font-semibold text-gray-12 leading-tight">
											{opt.label}
										</span>
									</button>
								);
							})}
						</div>
						<Button
							type="button"
							variant={d.groceryNoPreference ? "solid" : "outline"}
							color="gray"
							className="w-full"
							onPress={() =>
								setFoodDetails({
									groceryNoPreference: true,
									groceryTypes: [],
								})}
						>
							No preference
						</Button>
					</fieldset>
				)}

				<TextField
					name="helpfulNote"
					value={d.helpfulNote}
					onChange={v => setFoodDetails({ helpfulNote: v })}
				>
					<Label>What would be most helpful right now? (optional)</Label>
					<Group>
						<TextArea rows={4} placeholder="Anything we should know…" />
					</Group>
				</TextField>

				<TextField
					name="allergies"
					value={d.allergies}
					onChange={v => setFoodDetails({ allergies: v })}
				>
					<Label>Allergies (optional)</Label>
					<Group>
						<Input placeholder="e.g., peanuts, dairy" />
					</Group>
				</TextField>

				<TextField
					name="dietary"
					value={d.dietary}
					onChange={v => setFoodDetails({ dietary: v })}
				>
					<Label>Dietary preferences or needs (optional)</Label>
					<Group>
						<Input placeholder="e.g., vegetarian, halal, diabetic" />
					</Group>
				</TextField>

				<TextField
					name="peopleCount"
					value={d.peopleCount}
					onChange={v => setFoodDetails({ peopleCount: v })}
				>
					<Label>For how many people?</Label>
					<Group>
						<Input inputMode="numeric" placeholder="e.g., 2" />
					</Group>
				</TextField>

				<div className="flex flex-col gap-2">
					<Text size={3} weight="medium" className="text-gray-12">
						Delivery
					</Text>
					<div className="rounded-lg border border-gray-6 bg-gray-2 p-4">
						<Checkbox
							isSelected={d.needsDelivery}
							onChange={v => setFoodDetails({ needsDelivery: v })}
						>
							<Label>
								I need delivery (Picking up isn&apos;t an option)
							</Label>
						</Checkbox>

						{d.needsDelivery && (
							<div className="mt-4 flex flex-col gap-4 border-t border-gray-5 pt-4">
								<TextField
									name="address"
									value={d.address}
									onChange={v => setFoodDetails({ address: v })}
								>
									<Label>Address</Label>
									<Group>
										<Input placeholder="Street, city" />
									</Group>
								</TextField>
								<TextField
									name="deliveryInstructions"
									value={d.deliveryInstructions}
									onChange={v =>
										setFoodDetails({ deliveryInstructions: v })}
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
				onBack={() => router.push("/app/request/food/kind")}
				onNext={handleNext}
			/>
		</>
	);
}
