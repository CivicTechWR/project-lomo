"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import { Description, FieldError, Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { Input, TextField } from "@repo/ui/text-field";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useReducer, useState } from "react";
import { usePublicPhoneNumberSettings } from "@/lib/hooks/use-admin";
import { formatPhoneNumber, validatePhoneNumber } from "@/lib/phone-number";
import { OnboardingStepFooter } from "./onboarding-step-footer";
import { fieldGroup, fieldHint, fieldLabel, stepBody, stepHeading } from "./styles";

interface ContactState {
	country: string;
	phone: string;
}

type ContactAction
	= | { type: "country"; country: string }
		| { type: "phone"; phone: string }
		| {
			type: "hydrate";
			storedPhone: string;
			countries: ReadonlyArray<{ country: string; label: string }>;
		};

function contactStateReducer(state: ContactState, action: ContactAction): ContactState {
	switch (action.type) {
		case "country":
			return { ...state, country: action.country };
		case "phone":
			return { ...state, phone: action.phone };
		case "hydrate": {
			if (!action.storedPhone || !action.countries.length) {
				return state;
			}

			const matchingCountry = action.countries.find(item =>
				validatePhoneNumber(action.storedPhone, item.country).isValid,
			);
			const country = matchingCountry?.country ?? action.countries[0].country;
			return {
				country,
				phone: formatPhoneNumber(action.storedPhone, country),
			};
		}
	}
}

export function ContactStep() {
	const router = useRouter();
	const profileRow = useQuery(api.users.getMyProfileRow);
	const countrySettings = usePublicPhoneNumberSettings();
	const updatePublicProfile = useMutation(api.users.updatePublicProfile);
	const [state, dispatch] = useReducer(contactStateReducer, {
		country: "",
		phone: "",
	});
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const countries = useMemo(() => countrySettings ?? [], [countrySettings]);
	const selectedCountry = state.country || (countries[0]?.country ?? "");
	const validation = useMemo(
		() => validatePhoneNumber(state.phone, selectedCountry),
		[state.phone, selectedCountry],
	);
	const normalizedPhone = validation.e164 ?? null;
	const hasPhone = state.phone.trim().length > 0;
	const isValid = !hasPhone || validation.isValid;
	const status = hasPhone
		? validation.isValid
			? `Valid ${countries.find(item => item.country === selectedCountry)?.label ?? selectedCountry} number`
			: "Invalid number"
		: null;

	useEffect(() => {
		if (!profileRow) {
			return;
		}

		dispatch({
			type: "hydrate",
			storedPhone: String(profileRow.phone ?? "").trim(),
			countries,
		});
	}, [countries, dispatch, profileRow]);

	function handlePhoneChange(value: string) {
		setError(null);
		dispatch({ type: "phone", phone: formatPhoneNumber(value, selectedCountry) });
	}

	async function handleContinue() {
		if (!isValid || saving) {
			return;
		}

		setSaving(true);
		setError(null);
		try {
			await updatePublicProfile({
				phone: normalizedPhone ?? undefined,
			});
			router.push("/app/onboarding/safety");
		}
		catch (e) {
			setError(e instanceof Error ? e.message : "Could not save your phone number.");
		}
		finally {
			setSaving(false);
		}
	}

	return (
		<div className="flex min-h-full flex-col gap-6">
			<div className="flex flex-col gap-3">
				<Heading level={2} size={8} className={stepHeading}>
					Stay in touch
				</Heading>
				<Text size={3} className={stepBody}>
					Your number is only shared with people you are matched with on a request.
					Leave it blank if you prefer email through LoMo&apos;s masked address.
				</Text>
			</div>

			<div className="flex w-full flex-col gap-1">
				<label className={fieldLabel} htmlFor="phone-country">Country</label>
				<Group className={fieldGroup}>
					<select
						id="phone-country"
						aria-label="Country"
						value={selectedCountry}
						onChange={event => dispatch({ type: "country", country: event.target.value })}
						className="w-full bg-transparent text-inherit outline-none"
					>
						{countries.map(item => (
							<option key={item.country} value={item.country}>
								{item.label}
								{" "}
								(
								{item.country}
								)
							</option>
						))}
					</select>
				</Group>
			</div>

			<TextField
				name="phone"
				type="tel"
				autoComplete="tel"
				value={state.phone}
				onChange={handlePhoneChange}
				isInvalid={hasPhone && !isValid}
			>
				<Label className={fieldLabel}>Mobile number</Label>
				<Description className={fieldHint}>Optional</Description>
				<Group className={fieldGroup}>
					<Input placeholder="e.g. +1 519 555 0100" />
				</Group>
				<FieldError>{hasPhone && !isValid ? "Enter a valid number for this country." : null}</FieldError>
			</TextField>

			{status && (
				<Text
					role="status"
					className={isValid ? "text-green-11" : "text-red-11"}
				>
					{isValid ? "✓ " : "✕ "}
					{status}
				</Text>
			)}
			{error && <Text role="alert" className="text-red-11">{error}</Text>}

			<OnboardingStepFooter
				onBack={() => router.push("/app/onboarding/basics")}
				onNext={handleContinue}
				nextDisabled={saving || profileRow === undefined || countrySettings === undefined || !isValid}
				nextLabel={saving ? "Saving…" : "Continue"}
			/>
		</div>
	);
}
