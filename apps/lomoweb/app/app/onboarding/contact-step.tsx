"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import { Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { Input, TextField } from "@repo/ui/text-field";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { OnboardingStepFooter } from "./onboarding-step-footer";

export function ContactStep() {
	const router = useRouter();
	const profileRow = useQuery(api.users.getMyProfileRow);
	const updatePublicProfile = useMutation(api.users.updatePublicProfile);
	const [phone, setPhone] = useState("");
	const [saving, setSaving] = useState(false);

	const syncedRef = useRef(profileRow);
	if (profileRow && profileRow !== syncedRef.current) {
		syncedRef.current = profileRow;
		setPhone(profileRow.phone ?? "");
	}

	async function handleContinue() {
		setSaving(true);
		try {
			await updatePublicProfile({
				phone: phone.trim() || undefined,
			});
			router.push("/app/onboarding/safety");
		}
		catch (e) {
			console.error(e);
			window.alert(e instanceof Error ? e.message : "Could not save your phone number.");
		}
		finally {
			setSaving(false);
		}
	}

	return (
		<div className="flex min-h-full flex-col gap-6">
			<div className="flex flex-col gap-2">
				<Heading level={2} size={8} className="font-display">
					Stay in touch
				</Heading>
				<Text size={2} color="gray">
					Your number is only shared with people you are matched with on a request.
					Leave it blank if you prefer email through LoMo&apos;s masked address.
				</Text>
			</div>

			<TextField
				name="phone"
				type="tel"
				autoComplete="tel"
				value={phone}
				onChange={setPhone}
			>
				<Label>Mobile number (optional)</Label>
				<Group>
					<Input placeholder="e.g. +1 519 555 0100" />
				</Group>
			</TextField>

			<OnboardingStepFooter
				onBack={() => router.push("/app/onboarding/basics")}
				onNext={handleContinue}
				nextDisabled={saving || profileRow === undefined}
				nextLabel={saving ? "Saving…" : "Continue"}
			/>
		</div>
	);
}
