"use client";

import type { ReactNode } from "react";
import type { DatePickerProps as AriaDatePickerProps, DateValue } from "react-aria-components";
import type { FieldColor, FieldSize, FieldVariant } from "../field/index.ts";
import { CalendarDate } from "@internationalized/date";
import {
	DatePicker as AriaDatePicker,
	Button,
	composeRenderProps,
	DateInput,
	DateSegment,
	Dialog,
	Group,
	Popover,
} from "react-aria-components";
import { groupVariants } from "../field/group.variants.ts";
import { FieldContext } from "../field/index.ts";
import { Icon } from "../icons/index.ts";
import { cn } from "../utils/cn.ts";
import { fieldGaps } from "../variants/index.ts";
import { Calendar } from "./calendar.component.tsx";
import {
	calendarPopoverVariants,
	calendarTriggerVariants,
	dateSegmentVariants,
} from "./date-picker.variants.ts";

/**
 * A calendar day, with no time and no zone.
 *
 * The public API deliberately speaks in plain objects rather than
 * `@internationalized/date` values, so consuming apps don't need that package as
 * a dependency and can't accidentally leak a zone-bearing `Date` into a field
 * that only means "a day". `month` is 1-based.
 */
export interface PlainDate {
	year: number;
	/** 1-based, so January is 1. */
	month: number;
	day: number;
}

export type DatePickerProps = Omit<
	AriaDatePickerProps<DateValue>,
	"value" | "defaultValue" | "onChange" | "children"
> & {
	variant?: FieldVariant;
	size?: FieldSize;
	color?: FieldColor;
	value?: PlainDate | null;
	onChange?: (value: PlainDate | null) => void;
	/** Rendered above the field — typically a `Label`. */
	children?: ReactNode;
};

function toCalendarDate(value: PlainDate | null | undefined): CalendarDate | null {
	return value == null ? null : new CalendarDate(value.year, value.month, value.day);
}

function toPlainDate(value: DateValue | null): PlainDate | null {
	return value == null ? null : { year: value.year, month: value.month, day: value.day };
}

/**
 * Date field with a calendar popover.
 *
 * Built on react-aria's `DatePicker`, so per-segment keyboard editing, localised
 * segment order and separators, and screen-reader announcements come from the
 * library rather than being hand-rolled.
 *
 * Provides `FieldContext`, so `Label`, `Description`, and `FieldError` size
 * themselves exactly as they do inside `TextField`.
 */
export function DatePicker({
	variant = "surface",
	size = 2,
	color = "gray",
	className,
	children,
	value,
	onChange,
	...props
}: DatePickerProps) {
	return (
		<FieldContext value={{ variant, size, color }}>
			<AriaDatePicker
				{...props}
				value={toCalendarDate(value) as DateValue | null}
				onChange={next => onChange?.(toPlainDate(next))}
				className={composeRenderProps(className, cls =>
					cn("flex w-full flex-col", fieldGaps[size], cls))}
			>
				{children}

				<Group className={groupVariants({ variant, size, color })}>
					<DateInput className="flex flex-1 items-center">
						{segment => <DateSegment segment={segment} className={dateSegmentVariants()} />}
					</DateInput>
					{/*
					  react-aria names this trigger and wires it to the popover, so it
					  needs no explicit accessible name here.
					*/}
					<Button className={calendarTriggerVariants()}>
						<Icon name="calendar" className="size-4" />
					</Button>
				</Group>

				{/*
				  The Dialog needs an explicit name: react-aria only derives one from a
				  `<Heading slot="title">`, and Calendar's heading is the month label, not
				  a dialog title.
				*/}
				<Popover className={calendarPopoverVariants()}>
					<Dialog aria-label="Choose a date" className="outline-none">
						<Calendar />
					</Dialog>
				</Popover>
			</AriaDatePicker>
		</FieldContext>
	);
}
