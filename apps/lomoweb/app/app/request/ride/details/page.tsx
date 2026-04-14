"use client";

import { Checkbox } from "@repo/ui/checkbox";
import { Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Switch } from "@repo/ui";
import { Input, TextArea, TextField } from "@repo/ui/text-field";
import { Text } from "@repo/ui/text";
import { useRouter } from "next/navigation";
import { useRequestDraft } from "../../request-draft-context";
import { RequestStepFooter } from "../../request-step-footer";

export default function RideDetailsPage() {
	const router = useRouter();
	const { draft, setRideDetails } = useRequestDraft();
	const r = draft.rideDetails;

	function handleNext() {
		router.push("/app/request/ride/urgency");
	}

	return (
		<>
			<div className="flex flex-1 flex-col gap-5">
				<Heading size={7} className="text-center">
					Tell us a bit more
				</Heading>

				<TextField
					name="pickup"
					value={r.pickupLocation}
					onChange={v => setRideDetails({ pickupLocation: v })}
				>
					<Label>What's the pickup location?</Label>
					<Group>
						<Input placeholder="" />
					</Group>
				</TextField>

				<TextField
					name="dropoff"
					value={r.dropoffLocation}
					onChange={v => setRideDetails({ dropoffLocation: v })}
				>
					<Label>What's the drop-off location?</Label>
					<Group>
						<Input placeholder="" />
					</Group>
				</TextField>

				<Switch
					isSelected={r.needsReturnRide}
					onChange={isOn => setRideDetails({ needsReturnRide: isOn })}
				>
					I&apos;ll also need a return ride
				</Switch>

				<TextField
					name="whenText"
					value={r.whenText}
					onChange={v => setRideDetails({ whenText: v })}
				>
					<Label>When would you like to go?</Label>
					<Group>
						<Input placeholder="" />
					</Group>
				</TextField>

				<div className="flex flex-col gap-2">
					<Text size={3} weight="medium" className="text-gray-12">
						Accessibility
					</Text>
					<div className="rounded-lg border border-gray-6 bg-gray-2 p-4">
						<Checkbox
							isSelected={r.accessibilityNeeded}
							onChange={v => {
								setRideDetails({
									accessibilityNeeded: v,
									...(!v ? { accessibilityAccommodation: "" } : {}),
								});
							}}
						>
							<Label>I have accessibility or mobility needs</Label>
						</Checkbox>

						{r.accessibilityNeeded && (
							<div className="mt-4 border-t border-gray-5 pt-4">
								<TextField
									name="accessibilityAccommodation"
									value={r.accessibilityAccommodation}
									onChange={v =>
										setRideDetails({ accessibilityAccommodation: v })}
								>
									<Label>What kind of accommodation do you need?</Label>
									<Group>
										<TextArea rows={3} placeholder="" />
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
