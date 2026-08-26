"use client";

import type { Doc } from "@repo/convex-backend/convex/_generated/dataModel";
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
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
	HelperPreferencesFields,
	helperPreferencesFromProfile,
} from "./helper-preferences-fields";
import { SafetyAcknowledgment } from "./onboarding/safety-acknowledgment";

type ProfileRow = Doc<"users">;

function ProfileForm({ profileRow }: { profileRow: ProfileRow }) {
	const [firstName, setFirstName] = useState(() => profileRow.firstName ?? "");
	const [pronouns, setPronouns] = useState(() => profileRow.pronouns ?? "");
	const [phone, setPhone] = useState(() => profileRow.phone ?? "");
	const [savingProfile, setSavingProfile] = useState(false);
	const updatePublicProfile = useMutation(api.users.updatePublicProfile);

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

	return (
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
				isDisabled={savingProfile}
				onPress={handleSaveVolunteerFields}
			>
				{savingProfile ? "Saving…" : "Save profile"}
			</Button>
		</div>
	);
}

function HelperPreferencesForm({ profileRow }: { profileRow: ProfileRow }) {
	const [preferenceValues, setPreferenceValues] = useState(() =>
		helperPreferencesFromProfile(profileRow),
	);
	const [savingPreferences, setSavingPreferences] = useState(false);
	const updateHelperPreferences = useMutation(api.users.updateHelperPreferences);

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

	return (
		<div className="flex flex-col gap-4">
			<HelperPreferencesFields
				values={preferenceValues}
				onChange={setPreferenceValues}
			/>
			<Button
				variant="solid"
				color="sage"
				className="w-full"
				isDisabled={savingPreferences}
				onPress={handleSavePreferences}
			>
				{savingPreferences ? "Saving…" : "Save preferences"}
			</Button>
		</div>
	);
}

function SafetyForm({ profileRow }: { profileRow: ProfileRow }) {
	const [safetyAcknowledged, setSafetyAcknowledged] = useState(() =>
		Boolean(profileRow.safetyAcknowledgedAt),
	);
	const [savingSafety, setSavingSafety] = useState(false);
	const acknowledgeSafety = useMutation(api.users.acknowledgeSafety);

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
		<div className="flex flex-col gap-4">
			{profileRow.safetyAcknowledgedAt
				? (
						<Badge variant="soft" size={1} color="sage">
							Acknowledged
						</Badge>
					)
				: null}
			<SafetyAcknowledgment
				acknowledged={safetyAcknowledged}
				onAcknowledgedChange={setSafetyAcknowledged}
			/>
			<Button
				variant="outline"
				color="gray"
				className="w-full"
				isDisabled={
					!safetyAcknowledged
					|| savingSafety
					|| !!profileRow.safetyAcknowledgedAt
				}
				onPress={handleSaveSafety}
			>
				{profileRow.safetyAcknowledgedAt
					? "Safety notices on file"
					: savingSafety
						? "Saving…"
						: "Confirm acknowledgment"}
			</Button>
		</div>
	);
}

export function UserProfile({
	preloadedUser,
}: {
	preloadedUser: Preloaded<typeof api.auth.getCurrentUser>;
}) {
	const router = useRouter();
	const user = usePreloadedAuthQuery(preloadedUser);
	const profileRow = useQuery(api.users.getMyProfileRow, user ? {} : "skip");
	const deleteMyAccount = useMutation(api.users.deleteMyAccount);

	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const [deletePassword, setDeletePassword] = useState("");
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [deletingAccount, setDeletingAccount] = useState(false);

	if (!user) {
		return null;
	}

	async function handleDeleteAccount() {
		if (deletePassword.trim().length === 0) {
			setDeleteError("Enter your password to confirm.");
			return;
		}
		setDeletingAccount(true);
		setDeleteError(null);
		try {
			await deleteMyAccount({ password: deletePassword });
			try {
				await authClient.signOut();
			}
			catch {
				// Session may already be cleared by account deletion.
			}
			router.push("/");
		}
		catch (e) {
			console.error(e);
			setDeleteError(
				e instanceof Error ? e.message : "Could not delete your account.",
			);
			setDeletingAccount(false);
		}
	}

	return (
		<Card size={3} variant="surface" className="w-full">
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
					{profileRow == null
						? (
								<Text size={2} color="gray">
									Loading…
								</Text>
							)
						: (
								<ProfileForm key={profileRow._id} profileRow={profileRow} />
							)}
				</div>

				<div className="border-t border-gray-5 pt-5">
					<Heading level={3} size={4} className="mb-3">
						Helper preferences
					</Heading>
					{profileRow == null
						? (
								<Text size={2} color="gray">
									Loading…
								</Text>
							)
						: (
								<HelperPreferencesForm
									key={profileRow._id}
									profileRow={profileRow}
								/>
							)}
				</div>

				<div className="border-t border-gray-5 pt-5">
					<Heading level={3} size={4} className="mb-3">
						Safety &amp; Boundaries
					</Heading>
					{profileRow == null
						? (
								<Text size={2} color="gray">
									Loading…
								</Text>
							)
						: (
								<SafetyForm key={profileRow._id} profileRow={profileRow} />
							)}
				</div>

				<div className="border-t border-gray-5 pt-5">
					<Heading level={3} size={4} className="mb-2">
						Delete account
					</Heading>
					<Text size={2} color="gray" className="mb-4">
						Permanently delete your account, profile, requests you created,
						messages, and notifications. This cannot be undone.
					</Text>
					{confirmingDelete
						? (
								<div className="flex flex-col gap-3">
									<TextField
										name="deletePassword"
										type="password"
										autoComplete="current-password"
										value={deletePassword}
										onChange={setDeletePassword}
										isInvalid={!!deleteError}
										className="w-full"
									>
										<Label>Confirm with your password</Label>
										<Group>
											<Input placeholder="Your password" />
										</Group>
									</TextField>
									{deleteError
										? (
												<div className="rounded-[var(--radius-2)] border border-red-6 bg-red-2 px-4 py-3">
													<Text size={2} color="red">
														{deleteError}
													</Text>
												</div>
											)
										: null}
									<div className="flex flex-wrap gap-2">
										<Button
											variant="solid"
											color="red"
											isDisabled={deletingAccount}
											onPress={handleDeleteAccount}
										>
											{deletingAccount ? "Deleting…" : "Delete permanently"}
										</Button>
										<Button
											variant="soft"
											color="gray"
											isDisabled={deletingAccount}
											onPress={() => {
												setConfirmingDelete(false);
												setDeletePassword("");
												setDeleteError(null);
											}}
										>
											Cancel
										</Button>
									</div>
								</div>
							)
						: (
								<Button
									variant="soft"
									color="red"
									className="w-full"
									onPress={() => setConfirmingDelete(true)}
								>
									Delete account
								</Button>
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
