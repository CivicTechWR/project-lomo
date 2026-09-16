"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Description, FieldError, Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { Input, TextField } from "@repo/ui/text-field";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAdminSettings, useUpdateAdminSettings } from "@/lib/hooks/use-admin";
import { AdminErrorBoundary } from "../components/AdminErrorBoundary";

/* -------------------------------------------------------------------------- */
/*                             SettingsSkeleton                                 */
/* -------------------------------------------------------------------------- */

function SettingsSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			{["section-prefs", "section-notifs", "section-magic"].map(key => (
				<Card key={key} size={2} className="rounded-4 border border-gray-6">
					<div className="h-5 w-40 animate-pulse rounded bg-gray-3" />
					<div className="mt-4 h-10 w-full animate-pulse rounded bg-gray-3" />
					<div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-gray-3" />
				</Card>
			))}
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                               ToggleSwitch                                  */
/* -------------------------------------------------------------------------- */

interface ToggleSwitchProps {
	id: string;
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}

function ToggleSwitch({ id, label, checked, onChange }: ToggleSwitchProps) {
	return (
		<div className="flex items-center justify-between gap-3 py-2">
			<label htmlFor={id} className="text-sm font-medium text-gray-12">
				{label}
			</label>
			<button
				id={id}
				type="button"
				role="switch"
				aria-checked={checked}
				onClick={() => onChange(!checked)}
				className={`
					relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full
					border-2 border-transparent transition-colors
					focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2
					${checked ? "bg-sage-9" : "bg-gray-4"}
				`}
			>
				<span
					aria-hidden="true"
					className={`
						pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm
						transition-transform
						${checked ? "translate-x-5" : "translate-x-0.5"}
					`}
				/>
			</button>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                         SettingsForm (loaded state)                          */
/* -------------------------------------------------------------------------- */

interface SettingsData {
	attentionThresholdDays: number;
	notifyOnNewPending: boolean;
	notifyOnConcernReport: boolean;
	notifyOnCancellation: boolean;
}

function SettingsForm({ initialSettings }: { initialSettings: SettingsData }) {
	const updateSettings = useUpdateAdminSettings();

	const [threshold, setThreshold] = useState<number>(initialSettings.attentionThresholdDays);
	const [notifyOnNewPending, setNotifyOnNewPending] = useState(initialSettings.notifyOnNewPending);
	const [notifyOnConcernReport, setNotifyOnConcernReport] = useState(initialSettings.notifyOnConcernReport);
	const [notifyOnCancellation, setNotifyOnCancellation] = useState(initialSettings.notifyOnCancellation);

	const [thresholdError, setThresholdError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (successTimerRef.current) {
				clearTimeout(successTimerRef.current);
			}
		};
	}, []);

	const validateThreshold = useCallback((value: number): string | null => {
		if (!Number.isInteger(value)) {
			return "Threshold must be a whole number.";
		}
		if (value < 1 || value > 30) {
			return "Threshold must be between 1 and 30 days.";
		}
		return null;
	}, []);

	const handleThresholdChange = useCallback((raw: string) => {
		const num = Number.parseInt(raw, 10);
		if (Number.isNaN(num)) {
			setThreshold(0);
			setThresholdError("Please enter a valid number.");
		}
		else {
			setThreshold(num);
			setThresholdError(validateThreshold(num));
		}
	}, [validateThreshold]);

	const handleSave = useCallback(async () => {
		const error = validateThreshold(threshold);
		if (error) {
			setThresholdError(error);
			return;
		}

		setIsSaving(true);
		setSuccessMessage(null);

		try {
			await updateSettings({
				attentionThresholdDays: threshold,
				notifyOnNewPending,
				notifyOnConcernReport,
				notifyOnCancellation,
			});
			setSuccessMessage("Settings saved");

			if (successTimerRef.current) {
				clearTimeout(successTimerRef.current);
			}
			successTimerRef.current = setTimeout(() => {
				setSuccessMessage(null);
			}, 3000);
		}
		catch {
			setThresholdError("Failed to save settings. Please try again.");
		}
		finally {
			setIsSaving(false);
		}
	}, [threshold, notifyOnNewPending, notifyOnConcernReport, notifyOnCancellation, updateSettings, validateThreshold]);

	const hasValidationError = thresholdError !== null;

	return (
		<div className="flex flex-col gap-6">
			<Card size={2} className="rounded-4 border border-gray-6">
				<Heading level={2} size={5} weight="medium" className="mb-4">
					Admin Preferences
				</Heading>
				<TextField
					name="attentionThreshold"
					value={String(threshold)}
					isInvalid={!!thresholdError}
					onChange={handleThresholdChange}
				>
					<Label>Attention threshold (days)</Label>
					<Description>
						Requests pending longer than this are flagged for attention (1-30 days).
					</Description>
					<Group>
						<Input type="number" inputMode="numeric" min={1} max={30} step={1} />
					</Group>
					<FieldError>{thresholdError}</FieldError>
				</TextField>
			</Card>

			<Card size={2} className="rounded-4 border border-gray-6">
				<Heading level={2} size={5} weight="medium" className="mb-4">
					Notification Settings
				</Heading>
				<div className="flex flex-col divide-y divide-gray-4">
					<ToggleSwitch
						id="notify-new-pending"
						label="New pending request alerts"
						checked={notifyOnNewPending}
						onChange={setNotifyOnNewPending}
					/>
					<ToggleSwitch
						id="notify-concern-report"
						label="Concern reports"
						checked={notifyOnConcernReport}
						onChange={setNotifyOnConcernReport}
					/>
					<ToggleSwitch
						id="notify-cancellation"
						label="Cancellation alerts"
						checked={notifyOnCancellation}
						onChange={setNotifyOnCancellation}
					/>
				</div>
			</Card>

			<Card size={2} className="rounded-4 border border-gray-6">
				<Heading level={2} size={5} weight="medium" className="mb-4">
					Magic Link Management
				</Heading>
				<Text size={2} color="gray" className="mb-3">
					Generate single-use magic links to invite new users to the platform.
				</Text>
				<Button
					variant="outline"
					color="gray"
					size={2}
					isDisabled
				>
					Generate Magic Link
				</Button>
				<Text size={1} color="gray" className="mt-2 italic">
					Coming soon
				</Text>
			</Card>

			<div className="flex flex-col items-start gap-3">
				<Button
					variant="solid"
					color="sage"
					size={3}
					isDisabled={hasValidationError || isSaving}
					onPress={handleSave}
					className="rounded-full"
				>
					{isSaving ? "Saving..." : "Save Settings"}
				</Button>
				{successMessage && (
					<Text size={2} className="font-medium text-sage-9" aria-live="polite">
						{successMessage}
					</Text>
				)}
			</div>
		</div>
	);
}

export default function AdminSettingsPage() {
	const settings = useAdminSettings();
	const isLoading = settings === undefined;

	return (
		<AdminErrorBoundary level="section">
			<div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 lg:py-10">
				<Heading level={1} size={6} weight="bold" className="mb-6">
					Settings
				</Heading>

				<div aria-live="polite" aria-atomic="true" className="sr-only">
					{isLoading ? "Loading settings" : "Settings loaded"}
				</div>

				{isLoading
					? <SettingsSkeleton />
					: <SettingsForm initialSettings={settings} />}
			</div>
		</AdminErrorBoundary>
	);
}
