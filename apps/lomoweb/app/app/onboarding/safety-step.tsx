"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import { Heading } from "@repo/ui/heading";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingStepFooter } from "./onboarding-step-footer";
import { SafetyAcknowledgment } from "./safety-acknowledgment";
import { stepHeading } from "./styles";

export function SafetyStep() {
	const router = useRouter();
	const acknowledgeSafety = useMutation(api.users.acknowledgeSafety);
	const [acknowledged, setAcknowledged] = useState(false);
	const [saving, setSaving] = useState(false);

	async function handleContinue() {
		setSaving(true);
		try {
			await acknowledgeSafety({});
			router.push("/app/onboarding/preferences");
		}
		catch (e) {
			console.error(e);
			window.alert(e instanceof Error ? e.message : "Could not save your acknowledgment.");
		}
		finally {
			setSaving(false);
		}
	}

	return (
		<div className="flex min-h-full flex-col gap-6">
			<Heading level={2} size={8} className={stepHeading}>
				Safety &amp; Boundaries
			</Heading>

			<SafetyAcknowledgment
				acknowledged={acknowledged}
				onAcknowledgedChange={setAcknowledged}
			/>

			<OnboardingStepFooter
				onBack={() => router.push("/app/onboarding/contact")}
				onNext={handleContinue}
				nextDisabled={!acknowledged || saving}
				nextLabel={saving ? "Saving…" : "Continue"}
			/>
		</div>
	);
}
