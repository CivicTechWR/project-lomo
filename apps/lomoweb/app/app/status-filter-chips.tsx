"use client";

import type { HelpRequestStatusFilter } from "@/lib/help-request-status";
import { Button } from "@repo/ui/button";
import { HELP_REQUEST_FILTER_CHIPS } from "@/lib/help-request-status";

export function StatusFilterChips({
	value,
	onChange,
}: {
	value: HelpRequestStatusFilter;
	onChange: (v: HelpRequestStatusFilter) => void;
}) {
	return (
		<div className="flex flex-wrap gap-2">
			{HELP_REQUEST_FILTER_CHIPS.map((chip) => {
				const active = value === chip.value;
				return (
					<Button
						key={chip.label}
						size={1}
						variant={active ? "soft" : "outline"}
						color="gray"
						className="rounded-full"
						onPress={() => onChange(chip.value)}
					>
						{chip.label}
					</Button>
				);
			})}
		</div>
	);
}
