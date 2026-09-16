"use client";

import { Checkbox, CheckboxGroup } from "@repo/ui/checkbox";
import { Switch } from "@repo/ui/switch";
import { Text } from "@repo/ui/text";
import dynamic from "next/dynamic";
import { useId } from "react";
import {
	DEFAULT_HELP_AREA_CENTER,
	DEFAULT_HELP_AREA_RADIUS_KM,
	HELP_AREA_RADIUS_MAX_KM,
	HELP_AREA_RADIUS_MIN_KM,
} from "@/lib/help-area";
import { HELPER_PREFERENCE_GROUPS } from "@/lib/helper-preferences";

const HelpAreaMap = dynamic(
	() => import("./help-area-map").then(m => m.HelpAreaMap),
	{
		ssr: false,
		loading: () => (
			<div className="h-64 w-full animate-pulse rounded-[max(var(--radius-3),12px)] border border-gray-6 bg-gray-3" />
		),
	},
);

export interface HelperPreferencesFormValues {
	canHelpNow: boolean;
	helpPreferences: string[];
	helpAreaCenterLat: number;
	helpAreaCenterLng: number;
	helpAreaRadiusKm: number;
}

interface HelperPreferencesFieldsProps {
	values: HelperPreferencesFormValues;
	onChange: (values: HelperPreferencesFormValues) => void;
}

export function HelperPreferencesFields({ values, onChange }: HelperPreferencesFieldsProps) {
	// One base id, suffixed per group — `useId` can't be called inside the map.
	const groupLabelPrefix = useId();

	return (
		<div className="flex flex-col gap-8">
			{/*
			  The stored field stays `canHelpNow` (positive), but the copy spells out
			  the other side of the switch, because turning it off is a real state —
			  "Resting" — with a visible consequence, not just an empty preference.
			*/}
			<div className="flex flex-col gap-2">
				<Switch
					isSelected={values.canHelpNow}
					onChange={canHelpNow => onChange({ ...values, canHelpNow })}
				>
					I can offer support
				</Switch>
				<Text size={2} color="gray">
					{values.canHelpNow
						? "Turn this off to take a break. You'll show as Resting and Open Requests will be hidden until you switch it back on."
						: "You're Resting. Open Requests stays hidden and nobody will be matched to you. Turn this on whenever you're ready to help again."}
				</Text>
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
						{/*
						  The heading is pointed at with `aria-labelledby` rather than
						  duplicated into an `aria-label`, so the group's accessible name is
						  the same text sighted users read, and stays in sync with it.
						*/}
						<Text id={`${groupLabelPrefix}-${group.id}`} size={2} weight="medium">
							{group.label}
						</Text>
						<CheckboxGroup
							aria-labelledby={`${groupLabelPrefix}-${group.id}`}
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

			<div className="flex flex-col gap-3">
				<div className="flex flex-col gap-1">
					<Text size={2} weight="medium">
						Area you can help with
					</Text>
					<Text size={2} color="gray">
						Drag the map to set the centre and adjust the radius based on how far
						you are able to travel. This becomes the default area filter when you
						browse open requests.
					</Text>
				</div>

				<HelpAreaMap
					centerLat={values.helpAreaCenterLat}
					centerLng={values.helpAreaCenterLng}
					radiusKm={values.helpAreaRadiusKm}
					onCenterChange={(helpAreaCenterLat, helpAreaCenterLng) =>
						onChange({ ...values, helpAreaCenterLat, helpAreaCenterLng })}
				/>

				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between gap-3">
						<Text size={2} color="gray">
							Radius
						</Text>
						<Text size={2} weight="medium">
							{values.helpAreaRadiusKm}
							{" "}
							km
						</Text>
					</div>
					<input
						type="range"
						min={HELP_AREA_RADIUS_MIN_KM}
						max={HELP_AREA_RADIUS_MAX_KM}
						step={1}
						value={values.helpAreaRadiusKm}
						onChange={event =>
							onChange({
								...values,
								helpAreaRadiusKm: Number(event.target.value),
							})}
						className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-4 accent-sage-9"
						aria-label="Help area radius in kilometres"
					/>
					<div className="flex justify-between">
						<Text size={1} color="gray">
							{HELP_AREA_RADIUS_MIN_KM}
							{" "}
							km
						</Text>
						<Text size={1} color="gray">
							{HELP_AREA_RADIUS_MAX_KM}
							{" "}
							km
						</Text>
					</div>
				</div>
			</div>
		</div>
	);
}

export function helperPreferencesFromProfile(row: {
	canHelpNow?: boolean;
	helpPreferences?: string[];
	helpAreaCenterLat?: number;
	helpAreaCenterLng?: number;
	helpAreaRadiusKm?: number;
} | null | undefined): HelperPreferencesFormValues {
	return {
		canHelpNow: row?.canHelpNow ?? false,
		helpPreferences: row?.helpPreferences ?? [],
		helpAreaCenterLat: row?.helpAreaCenterLat ?? DEFAULT_HELP_AREA_CENTER.lat,
		helpAreaCenterLng: row?.helpAreaCenterLng ?? DEFAULT_HELP_AREA_CENTER.lng,
		helpAreaRadiusKm: row?.helpAreaRadiusKm ?? DEFAULT_HELP_AREA_RADIUS_KM,
	};
}
