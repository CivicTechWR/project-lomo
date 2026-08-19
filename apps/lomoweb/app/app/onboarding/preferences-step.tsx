"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	HelperPreferencesFields,
	helperPreferencesFromProfile,
} from "../helper-preferences-fields";
import { OnboardingStepFooter } from "./onboarding-step-footer";

export function PreferencesStep() {
	const router = useRouter();
	const profileRow = useQuery(api.users.getMyProfileRow);
	const updateHelperPreferences = useMutation(api.users.updateHelperPreferences);
	const completeOnboarding = useMutation(api.users.completeOnboarding);
	const [values, setValues] = useState(helperPreferencesFromProfile(undefined));
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (profileRow) {
			setValues(helperPreferencesFromProfile(profileRow));
		}
	}, [profileRow]);

	async function handleFinish() {
		setSaving(true);
		try {
			await updateHelperPreferences({
				canHelpNow: values.canHelpNow,
				helpPreferences: values.helpPreferences,
				helpAreaCenterLat: values.helpAreaCenterLat,
				helpAreaCenterLng: values.helpAreaCenterLng,
				helpAreaRadiusKm: values.helpAreaRadiusKm,
			});
			await completeOnboarding({});
			router.push("/app");
		}
		catch (e) {
			console.error(e);
			window.alert(e instanceof Error ? e.message : "Could not save your preferences.");
		}
		finally {
			setSaving(false);
		}
	}

	return (
		<div className="flex min-h-full flex-col gap-6">
			<div className="flex flex-col gap-2">
				<Heading level={2} size={8} className="font-display">
					Set your preference
				</Heading>
				<Text size={2} color="gray">
					You can update these anytime from your profile.
				</Text>
			</div>

			{profileRow === undefined
				? (
						<Text size={2} color="gray">Loading…</Text>
					)
				: (
						<HelperPreferencesFields values={values} onChange={setValues} />
					)}

			<OnboardingStepFooter
				onBack={() => router.push("/app/onboarding/safety")}
				onNext={handleFinish}
				nextDisabled={saving || profileRow === undefined}
				nextLabel={saving ? "Saving…" : "Finish"}
			/>
		</div>
	);
}
