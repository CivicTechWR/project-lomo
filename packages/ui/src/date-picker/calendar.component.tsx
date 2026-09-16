"use client";

import type { CalendarProps as AriaCalendarProps, DateValue } from "react-aria-components";
import {
	Calendar as AriaCalendar,
	Button,
	CalendarCell,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeaderCell,
	composeRenderProps,
	Heading,
} from "react-aria-components";
import { Icon } from "../icons/index.ts";
import { cn } from "../utils/cn.ts";
import {
	calendarCellVariants,
	calendarNavButtonVariants,
} from "./date-picker.variants.ts";

export interface CalendarProps<T extends DateValue> extends AriaCalendarProps<T> {}

/**
 * Month grid used inside `DatePicker`, and usable standalone for an always-open
 * calendar.
 *
 * `Heading` is rendered by react-aria with a localised month/year label, and the
 * nav buttons carry `slot` values it wires up — so keyboard paging and the
 * announced month name come from the library rather than being reimplemented.
 */
export function Calendar<T extends DateValue>({ className, ...props }: CalendarProps<T>) {
	return (
		<AriaCalendar
			{...props}
			className={composeRenderProps(className, cls => cn("w-fit", cls))}
		>
			<header className="mb-2 flex items-center justify-between gap-2">
				<Button slot="previous" className={calendarNavButtonVariants()}>
					<Icon name="chevronLeft" className="size-3.5" />
				</Button>
				<Heading className="text-[length:var(--text-2)] font-medium text-gray-12" />
				<Button slot="next" className={calendarNavButtonVariants()}>
					<Icon name="chevronRight" className="size-3.5" />
				</Button>
			</header>

			<CalendarGrid className="border-collapse">
				<CalendarGridHeader>
					{day => (
						<CalendarHeaderCell className="size-9 text-[length:var(--text-1)] font-normal text-gray-11">
							{day}
						</CalendarHeaderCell>
					)}
				</CalendarGridHeader>
				<CalendarGridBody>
					{date => <CalendarCell date={date} className={calendarCellVariants()} />}
				</CalendarGridBody>
			</CalendarGrid>
		</AriaCalendar>
	);
}
