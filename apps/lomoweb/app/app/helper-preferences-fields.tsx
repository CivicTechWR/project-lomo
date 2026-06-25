"use client";

import { Checkbox, CheckboxGroup } from "@repo/ui/checkbox";
import { Group, Label } from "@repo/ui/field";
import { Switch } from "@repo/ui/switch";
import { Text } from "@repo/ui/text";
import { Input, TextField } from "@repo/ui/text-field";
import { HELPER_PREFERENCE_GROUPS } from "@/lib/helper-preferences";

export type HelperPreferencesFormValues = {
	canHelpNow: boolean;
	helpPreferences: string[];
	helpLocation: string;
};

type HelperPreferencesFieldsProps = {
	values: HelperPreferencesFormValues;
	onChange: (values: HelperPreferencesFormValues) => void;
};

export function HelperPreferencesFields({ values, onChange }: HelperPreferencesFieldsProps) {
	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-2">
				<p className="text-[length:var(--text-2)] font-medium text-gray-12">
					Capacity &amp; Pace
					{" "}
					<span className="font-normal text-gray-11">(Optional)</span>
				</p>
				<Switch
					isSelected={values.canHelpNow}
					onChange={canHelpNow => onChange({ ...values, canHelpNow })}
				>
					I can help right now
				</Switch>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<Text size={2} weight="medium">
						How would you like to help?
					</Text>
					<Text size={2} color="gray">
						Select anything that feels doable right now. This helps coordinators
						understand what you&apos;re open to.
					</Text>
				</div>

				{HELPER_PREFERENCE_GROUPS.map(group => (
					<div key={group.id} className="flex flex-col gap-2">
						<Text size={2} weight="medium">
							{group.label}
						</Text>
						<CheckboxGroup
							value={values.helpPreferences}
							onChange={helpPreferences => onChange({ ...values, helpPreferences })}
							className="gap-2"
						>
							{group.options.map(option => (
								<Checkbox key={option.id} value={option.id}>
									{option.label}
								</Checkbox>
							))}
						</CheckboxGroup>
					</div>
				))}
			</div>

			<TextField
				name="helpLocation"
				value={values.helpLocation}
				onChange={helpLocation => onChange({ ...values, helpLocation })}
			>
				<Label>Location you can help with (optional)</Label>
				<Group>
					<Input placeholder="City / Neighborhood" />
				</Group>
			</TextField>
		</div>
	);
}

export function helperPreferencesFromProfile(row: {
	canHelpNow?: boolean;
	helpPreferences?: string[];
	helpLocation?: string;
} | null | undefined): HelperPreferencesFormValues {
	return {
		canHelpNow: row?.canHelpNow ?? false,
		helpPreferences: row?.helpPreferences ?? [],
		helpLocation: row?.helpLocation ?? "",
	};
}
