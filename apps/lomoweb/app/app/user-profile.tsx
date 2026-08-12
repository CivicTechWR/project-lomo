"use client";

import type { Preloaded } from "convex/react";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { Input, TextField } from "@repo/ui/text-field";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
	HelperPreferencesFields,
	helperPreferencesFromProfile,
} from "./helper-preferences-fields";
import { SafetyAcknowledgment } from "./onboarding/safety-acknowledgment";

export function UserProfile({
	preloadedUser,
}: {
	preloadedUser: Preloaded<typeof api.auth.getCurrentUser>;
}) {
	const router = useRouter();
	const user = usePreloadedAuthQuery(preloadedUser);
	const profileRow = useQuery(api.users.getMyProfileRow, user ? {} : "skip");
	const updatePublicProfile = useMutation(api.users.updatePublicProfile);
	const updateHelperPreferences = useMutation(api.users.updateHelperPreferences);
	const acknowledgeSafety = useMutation(api.users.acknowledgeSafety);
	const [firstName, setFirstName] = useState("");
	const [pronouns, setPronouns] = useState("");
	const [phone, setPhone] = useState("");
	const [preferenceValues, setPreferenceValues] = useState(
		helperPreferencesFromProfile(undefined),
	);
	const [safetyAcknowledged, setSafetyAcknowledged] = useState(false);
	const [savingProfile, setSavingProfile] = useState(false);
	const [savingPreferences, setSavingPreferences] = useState(false);
	const [savingSafety, setSavingSafety] = useState(false);

	useEffect(() => {
		if (profileRow) {
			setFirstName(profileRow.firstName ?? "");
			setPronouns(profileRow.pronouns ?? "");
			setPhone(profileRow.phone ?? "");
			setPreferenceValues(helperPreferencesFromProfile(profileRow));
			setSafetyAcknowledged(!!profileRow.safetyAcknowledgedAt);
		}
	}, [profileRow]);

	const syncedProfileRef = useRef(profileRow);
	if (profileRow && profileRow !== syncedProfileRef.current) {
		syncedProfileRef.current = profileRow;
		setFirstName(profileRow.firstName ?? "");
		setPronouns(profileRow.pronouns ?? "");
		setPhone(profileRow.phone ?? "");
	}

	if (!user) {
		return null;
	}

	async function handleSignOut() {
		await authClient.signOut();
		router.push("/signin");
	}

	async function handleSaveVolunteerFields() {
		setSavingProfile(true);
		try {
			await updatePublicProfile({
				firstName,
				pronouns,
				phone: phone.trim() || undefined,
			});
		}
		catch (e) {
			console.error(e);
			window.alert(
				e instanceof Error ? e.message : "Could not save your profile.",
			);
		}
		finally {
			setSavingProfile(false);
		}
	}

	async function handleSavePreferences() {
		setSavingPreferences(true);
		try {
			await updateHelperPreferences({
				canHelpNow: preferenceValues.canHelpNow,
				helpPreferences: preferenceValues.helpPreferences,
				helpAreaCenterLat: preferenceValues.helpAreaCenterLat,
				helpAreaCenterLng: preferenceValues.helpAreaCenterLng,
				helpAreaRadiusKm: preferenceValues.helpAreaRadiusKm,
			});
		}
		catch (e) {
			console.error(e);
			window.alert(
				e instanceof Error ? e.message : "Could not save your preferences.",
			);
		}
		finally {
			setSavingPreferences(false);
		}
	}

	async function handleSaveSafety() {
		if (!safetyAcknowledged) {
			return;
		}
		setSavingSafety(true);
		try {
			await acknowledgeSafety({});
		}
		catch (e) {
			console.error(e);
			window.alert(
				e instanceof Error ? e.message : "Could not save your acknowledgment.",
			);
		}
		finally {
			setSavingSafety(false);
		}
	}

	return (
		<Card size={3} variant="surface" className="w-full max-w-lg">
			<div className="flex flex-col gap-4 p-4 sm:p-5">
				<div className="flex items-center justify-between gap-3">
					<Heading level={2} size={6}>
						Your profile
					</Heading>
				</div>

				<div className="flex flex-col gap-3">
				<Text size={2} color="gray">
					{user.email}
					</Text>
				</div>

				<div className="border-t border-gray-5 pt-5">
					<Text size={2} color="gray" className="mb-3">
						When you offer to help, requesters see the first name and pronouns
						below (if you add them). Your number is only shared with people you
						are matched with on a request; texting happens outside LoMo. If you
						leave it blank, matched volunteers will email you through a masked
						address so your real email stays private.
					</Text>
					{profileRow === undefined
						? (
								<Text size={2} color="gray">
									Loading…
								</Text>
							)
						: (
								<div className="flex flex-col gap-4">
									<TextField
										name="firstName"
										value={firstName}
										onChange={setFirstName}
										className="w-full"
									>
										<Label>First name (shown to requesters)</Label>
										<Group>
											<Input placeholder="e.g. Sam" />
										</Group>
									</TextField>
									<TextField
										name="pronouns"
										value={pronouns}
										onChange={setPronouns}
										className="w-full"
									>
										<Label>Pronouns (optional)</Label>
										<Group>
											<Input placeholder="e.g. they/them" />
										</Group>
									</TextField>
									<TextField
										name="phone"
										type="tel"
										autoComplete="tel"
										value={phone}
										onChange={setPhone}
										className="w-full"
									>
										<Label>Mobile number (optional)</Label>
										<Group>
											<Input placeholder="e.g. +1 519 555 0100" />
										</Group>
									</TextField>
									<Button
										variant="solid"
										color="sage"
										className="w-full"
										isDisabled={saving}
										onPress={handleSaveVolunteerFields}
									>
										{saving ? "Saving…" : "Save profile"}
									</Button>
								</div>
							)}
				</div>

				<Button
					variant="outline"
					color="gray"
					className="w-full"
					onPress={() => router.push("/app")}
				>
					Back to requests
				</Button>
			</div>
		</Card>
	);
}

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between">
			<Text size={2} color="gray">
				{label}
			</Text>
			<Text size={2}>{value}</Text>
		</div>
	);
}
