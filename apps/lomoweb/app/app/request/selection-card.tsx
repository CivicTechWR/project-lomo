"use client";

import type { ReactNode } from "react";

export function SelectionCard(props: {
	selected: boolean;
	onClick: () => void;
	title: string;
	description: string;
	disabled?: boolean;
	leading?: ReactNode;
}) {
	const { selected, onClick, title, description, disabled, leading } = props;

	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onClick}
			className={
				disabled
					? "flex w-full cursor-not-allowed flex-col gap-2 rounded-lg border border-gray-5 bg-gray-2 p-4 text-left opacity-60"
					: selected
						? "flex w-full flex-col gap-2 rounded-lg border border-gray-8 bg-gray-3 p-4 text-left shadow-sm transition-colors"
						: "flex w-full flex-col gap-2 rounded-lg border border-gray-6 bg-gray-1 p-4 text-left transition-colors hover:border-gray-7 hover:bg-gray-2"
			}
		>
			<div className="flex items-start gap-3">
				{leading ?? (
					<span
						className="mt-0.5 size-10 shrink-0 rounded-full bg-gray-4"
						aria-hidden
					/>
				)}
				<div className="min-w-0 flex-1">
					<div className="text-[length:var(--text-2)] font-semibold text-gray-12">
						{title}
					</div>
					<div className="mt-1 text-[length:var(--text-1)] leading-[var(--text-1--line-height)] text-gray-11">
						{description}
					</div>
				</div>
			</div>
		</button>
	);
}
