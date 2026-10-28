"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import { validatePronouns } from "@repo/convex-backend/convex/lib/pronouns";
import { Description, FieldError, Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { Input, TextField } from "@repo/ui/text-field";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { OnboardingStepFooter } from "./onboarding-step-footer";
import { fieldGroup, fieldHint, fieldLabel, stepBody, stepHeading } from "./styles";

export function BasicsStep() {
	const router = useRouter();
	const profileRow = useQuery(api.users.getMyProfileRow);
	const updatePublicProfile = useMutation(api.users.updatePublicProfile);
	const [firstName, setFirstName] = useState("");
	const [pronouns, setPronouns] = useState("");
	const [saving, setSaving] = useState(false);

	const syncedRef = useRef(profileRow);
	if (profileRow && profileRow !== syncedRef.current) {
		syncedRef.current = profileRow;
		setFirstName(profileRow.firstName ?? "");
		setPronouns(profileRow.pronouns ?? "");
	}

	const pronounsValidation = validatePronouns(pronouns);

	async function handleContinue() {
		if (pronounsValidation.error) {
			return;
		}
		setSaving(true);
		try {
			await updatePublicProfile({
				firstName: firstName.trim() || undefined,
				pronouns: pronounsValidation.value ?? "",
			});
			router.push("/app/onboarding/contact");
		}
		catch (e) {
			console.error(e);
			window.alert(e instanceof Error ? e.message : "Could not save your details.");
		}
		finally {
			setSaving(false);
		}
	}

	return (
		<div className="flex min-h-full flex-col gap-6">
			<div className="flex flex-col gap-3">
				<Heading level={2} size={8} className={stepHeading}>
					About you
				</Heading>
				<Text size={3} className={stepBody}>
					When you offer to help, requesters see this information.
				</Text>
			</div>

			<div className="flex flex-col gap-5">
				<TextField
					name="firstName"
					autoComplete="given-name"
					value={firstName}
					onChange={setFirstName}
				>
					<Label className={fieldLabel}>First name</Label>
					<Group className={fieldGroup}>
						<Input placeholder="e.g. Sam" />
					</Group>
				</TextField>
				<TextField
					name="pronouns"
					value={pronouns}
					onChange={setPronouns}
					isInvalid={!!pronounsValidation.error}
				>
					<Label className={fieldLabel}>Pronouns</Label>
					<Description className={fieldHint}>Optional</Description>
					<Group className={fieldGroup}>
						<Input placeholder="e.g. they/them" />
					</Group>
					<FieldError>{pronounsValidation.error}</FieldError>
				</TextField>
			</div>

			<OnboardingStepFooter
				onBack={() => router.push("/signin")}
				onNext={handleContinue}
				nextDisabled={saving || profileRow === undefined || !!pronounsValidation.error}
				nextLabel={saving ? "Saving…" : "Continue"}
			/>
		</div>
	);
}
