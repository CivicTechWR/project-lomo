"use client";

export interface SegmentedTab {
	/** Stable identifier for the tab. */
	key: string;
	/** Visible label. */
	label: string;
}

export interface SegmentedTabsProps {
	tabs: SegmentedTab[];
	activeKey: string;
	onSelect: (key: string) => void;
	/** Accessible label for the tab group. */
	label: string;
	className?: string;
}

/**
 * A top-of-content segmented control. Presentational only — the caller owns the
 * active state. Generic so it can host any section split (e.g. Requests / Users).
 */
export function SegmentedTabs({ tabs, activeKey, onSelect, label, className }: SegmentedTabsProps) {
	return (
		<div
			role="tablist"
			aria-label={label}
			className={
				`inline-flex items-stretch gap-1 rounded-[max(var(--radius-3),var(--radius-full))] `
				+ `border border-gray-6 bg-gray-2 p-1 ${className ?? ""}`
			}
		>
			{tabs.map((tab) => {
				const isActive = tab.key === activeKey;
				return (
					<button
						key={tab.key}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={() => onSelect(tab.key)}
						className={
							`rounded-[max(var(--radius-2),var(--radius-full))] px-4 py-1.5 `
							+ `text-[length:var(--text-2)] font-medium outline-none transition-colors `
							+ `ring-gray-8 focus-visible:ring-2 focus-visible:ring-offset-1 ${
								isActive
									? `bg-gray-1 text-gray-12 shadow-sm `
									: `text-gray-10 hover:text-gray-12 `}`
						}
					>
						{tab.label}
					</button>
				);
			})}
		</div>
	);
}
