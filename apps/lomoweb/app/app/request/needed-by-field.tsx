"use client";

import type { PlainDate } from "@repo/ui/date-picker";
import type { NeededBy } from "@/lib/request-flow/types";
import { DatePicker } from "@repo/ui/date-picker";
import { Label } from "@repo/ui/field";
import { Text } from "@repo/ui/text";
import { useId, useState } from "react";
import {
	NEEDED_BY_PRESETS,
	neededByFromDate,
	neededByFromPreset,
	neededByToPlainDate,
} from "@/lib/request-flow/needed-by";

/**
 * Captures when help stops being useful.
 *
 * Presets come first because they answer the common cases in one tap, which
 * matters far more on a phone than a calendar does. The calendar is revealed
 * only when someone needs a specific day.
 *
 * "No fixed date" is a real option, not an escape hatch we tolerate: a requester
 * who genuinely has no deadline should not have to invent one, and a request with
 * no deadline simply never becomes deadline-urgent.
 */
export function NeededByField({
	value,
	onChange,
	label = "When do you need this by?",
	description = "This helps us notice if a request is running out of time. Choose whatever fits — there's no wrong answer.",
}: {
	value: NeededBy | null;
	onChange: (neededBy: NeededBy | null) => void;
	label?: string;
	description?: string;
}) {
	const groupId = useId();
	const descriptionId = `${groupId}-description`;

	// Revealing the calendar is view state, not draft state: someone can open it,
	// change their mind, and pick a chip instead without that being recorded.
	const [showCalendar, setShowCalendar] = useState(value?.preset === "exact");

	const selected = value?.preset ?? "none";

	function choosePreset(preset: typeof NEEDED_BY_PRESETS[number]["id"]) {
		setShowCalendar(false);
		onChange(neededByFromPreset(preset));
	}

	function chooseNoFixedDate() {
		setShowCalendar(false);
		onChange(null);
	}

	function chooseExactDate(date: PlainDate | null) {
		onChange(date == null ? null : neededByFromDate(date));
	}

	return (
		<div
			role="group"
			aria-labelledby={groupId}
			aria-describedby={descriptionId}
			className="flex flex-col gap-2"
		>
			<Text id={groupId} size={3} weight="medium" className="text-gray-12">
				{label}
			</Text>
			<Text id={descriptionId} size={1} className="text-gray-11">
				{description}
			</Text>

			{/*
			  Radio semantics rather than toggle buttons: exactly one deadline applies,
			  and aria-pressed on several buttons would suggest a multi-select.
			*/}
			<div role="radiogroup" aria-labelledby={groupId} className="flex flex-wrap gap-2">
				{NEEDED_BY_PRESETS.map(preset => (
					<DeadlineChip
						key={preset.id}
						isSelected={selected === preset.id && !showCalendar}
						onSelect={() => choosePreset(preset.id)}
					>
						{preset.label}
					</DeadlineChip>
				))}

				<DeadlineChip
					isSelected={showCalendar || selected === "exact"}
					onSelect={() => setShowCalendar(true)}
				>
					Pick a date
				</DeadlineChip>

				<DeadlineChip
					isSelected={selected === "none" && !showCalendar}
					onSelect={chooseNoFixedDate}
				>
					No fixed date
				</DeadlineChip>
			</div>

			{showCalendar && (
				<DatePicker
					aria-label="Exact date needed by"
					value={value?.preset === "exact" ? neededByToPlainDate(value) : null}
					onChange={chooseExactDate}
					className="max-w-64"
				>
					<Label>Exact date</Label>
				</DatePicker>
			)}
		</div>
	);
}

function DeadlineChip({
	isSelected,
	onSelect,
	children,
}: {
	isSelected: boolean;
	onSelect: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			role="radio"
			aria-checked={isSelected}
			onClick={onSelect}
			className={[
				"min-h-11 rounded-full border px-4 text-[length:var(--text-2)]",
				"outline-none transition-colors",
				"focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2",
				isSelected
					? "border-terracotta-9 bg-terracotta-9 text-white"
					: "border-gray-6 bg-gray-1 text-gray-12 hover:border-gray-7 hover:bg-gray-2",
			].join(" ")}
		>
			{children}
		</button>
	);
}
