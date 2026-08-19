"use client";

import { Checkbox } from "@repo/ui/checkbox";
import { Text } from "@repo/ui/text";
import { SAFETY_NOTICES } from "@/lib/helper-preferences";

interface SafetyAcknowledgmentProps {
	acknowledged: boolean;
	onAcknowledgedChange: (value: boolean) => void;
}

export function SafetyAcknowledgment({
	acknowledged,
	onAcknowledgedChange,
}: SafetyAcknowledgmentProps) {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<Text size={2} weight="medium">
					Safety &amp; Boundaries
				</Text>
			</div>

			<ul className="flex list-disc flex-col gap-3 pl-5">
				{SAFETY_NOTICES.map((notice) => {
					if (typeof notice === "string") {
						return (
							<li key={notice}>
								<Text size={2}>{notice}</Text>
							</li>
						);
					}
					return (
						<li key={notice.emphasis}>
							<Text size={2}>
								{notice.text}
								<span className="underline">{notice.emphasis}</span>
								{notice.suffix}
							</Text>
						</li>
					);
				})}
			</ul>

			<div className="rounded-[var(--radius-2)] border border-gray-7 px-4 py-3">
				<Checkbox
					isSelected={acknowledged}
					onChange={onAcknowledgedChange}
				>
					I have read and understand all the safety notices
				</Checkbox>
			</div>
		</div>
	);
}
