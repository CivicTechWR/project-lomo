"use client";

import { Icon } from "@repo/ui/icons";
import { useCallback, useEffect, useId, useRef, useState } from "react";

// --- Types ---

export interface FilterOption {
	value: string;
	label: string;
}

export interface FilterPillConfig {
	/** Unique identifier for this filter */
	id: string;
	/** Display label for the pill */
	label: string;
	/** Available options in the dropdown */
	options: FilterOption[];
	/** Currently selected values */
	selected: string[];
	/** Callback when selection changes */
	onSelect: (values: string[]) => void;
}

export interface FilterPillGroupProps {
	/** Array of filter pill configurations */
	filters: FilterPillConfig[];
	/** Called when "Clear all" is tapped — resets all filters */
	onClearAll: () => void;
}

// --- FilterPillGroup Component ---

/**
 * Group of filter pills with dropdowns for admin list views.
 *
 * Features:
 * - Each pill is a button that opens a dropdown/popover on click
 * - Dropdown shows options for that filter (single-select per pill)
 * - Active pill shows selected value(s) or count
 * - "Clear all" button when any filter is active
 * - Keyboard: Enter/Space opens dropdown, Escape closes, Arrow keys navigate
 * - Design: rounded-full, border gray-6, bg-white; active state with gray-12 bg + white text
 */
export function FilterPillGroup({ filters, onClearAll }: FilterPillGroupProps) {
	const hasActiveFilters = filters.some(f => f.selected.length > 0);

	return (
		<div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filters">
			{filters.map(filter => (
				<FilterPill key={filter.id} config={filter} />
			))}

			{hasActiveFilters && (
				<button
					type="button"
					onClick={onClearAll}
					className={[
						"rounded-full px-3 py-1.5",
						"text-xs font-medium text-gray-11 underline",
						"min-h-11 min-w-11",
						"outline-none focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2",
						"hover:text-gray-12",
					].join(" ")}
				>
					Clear all
				</button>
			)}
		</div>
	);
}

// --- FilterPill Component ---

interface FilterPillInternalProps {
	config: FilterPillConfig;
}

function FilterPill({ config }: FilterPillInternalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [focusedIndex, setFocusedIndex] = useState(-1);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const listboxId = useId();

	const { id, label, options, selected, onSelect } = config;
	const isActive = selected.length > 0;

	// Close on Escape or outside click
	useEffect(() => {
		if (!isOpen)
			return;

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				setIsOpen(false);
				setFocusedIndex(-1);
				buttonRef.current?.focus();
			}
		}

		function handleClickOutside(e: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false);
				setFocusedIndex(-1);
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	// Focus management: focus listbox item when opening
	useEffect(() => {
		if (isOpen && focusedIndex >= 0 && listRef.current) {
			const items = listRef.current.querySelectorAll<HTMLLIElement>("[role=\"option\"]");
			items[focusedIndex]?.focus();
		}
	}, [isOpen, focusedIndex]);

	const toggleOpen = useCallback(() => {
		setIsOpen(prev => !prev);
		if (!isOpen) {
			// When opening, set focus to first selected item or first option
			const idx = selected.length > 0
				? options.findIndex(o => o.value === selected[0])
				: 0;
			setFocusedIndex(idx >= 0 ? idx : 0);
		}
		else {
			setFocusedIndex(-1);
		}
	}, [isOpen, options, selected]);

	const handleOptionSelect = useCallback(
		(value: string) => {
			// Toggle selection: if already selected, deselect; otherwise select (single-select per pill)
			const newSelected = selected.includes(value)
				? selected.filter(v => v !== value)
				: [value];
			onSelect(newSelected);
			setIsOpen(false);
			setFocusedIndex(-1);
			buttonRef.current?.focus();
		},
		[selected, onSelect],
	);

	const handleButtonKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLButtonElement>) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				toggleOpen();
			}
			if (e.key === "ArrowDown" && !isOpen) {
				e.preventDefault();
				setIsOpen(true);
				const idx = selected.length > 0
					? options.findIndex(o => o.value === selected[0])
					: 0;
				setFocusedIndex(idx >= 0 ? idx : 0);
			}
		},
		[toggleOpen, isOpen, options, selected],
	);

	const handleListKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLUListElement>) => {
			switch (e.key) {
				case "ArrowDown": {
					e.preventDefault();
					setFocusedIndex(prev => Math.min(prev + 1, options.length - 1));
					break;
				}
				case "ArrowUp": {
					e.preventDefault();
					setFocusedIndex(prev => Math.max(prev - 1, 0));
					break;
				}
				case "Home": {
					e.preventDefault();
					setFocusedIndex(0);
					break;
				}
				case "End": {
					e.preventDefault();
					setFocusedIndex(options.length - 1);
					break;
				}
				case "Enter":
				case " ": {
					e.preventDefault();
					if (focusedIndex >= 0 && focusedIndex < options.length) {
						handleOptionSelect(options[focusedIndex].value);
					}
					break;
				}
			}
		},
		[focusedIndex, options, handleOptionSelect],
	);

	// Build display label
	const displayLabel = isActive
		? `${label} (${selected.length})`
		: label;

	return (
		<div ref={containerRef} className="relative">
			<button
				ref={buttonRef}
				type="button"
				onClick={toggleOpen}
				onKeyDown={handleButtonKeyDown}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				aria-controls={isOpen ? listboxId : undefined}
				aria-label={`Filter by ${label}`}
				id={`filter-pill-${id}`}
				className={[
					"flex items-center gap-1 rounded-full border px-3 py-1.5",
					"text-xs font-medium",
					"min-h-11 min-w-11",
					"outline-none focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2",
					"transition-colors",
					isActive
						? "border-gray-12 bg-gray-12 text-white"
						: "border-gray-6 bg-white text-gray-12 hover:bg-gray-3",
				].join(" ")}
			>
				<span>{displayLabel}</span>
				<Icon
					name="chevronDown"
					className={`size-3.5 ${isActive ? "text-white" : "text-gray-11"}`}
				/>
			</button>

			{isOpen && (
				<ul
					ref={listRef}
					id={listboxId}
					role="listbox"
					aria-label={`${label} options`}
					aria-activedescendant={
						focusedIndex >= 0 ? `${listboxId}-option-${focusedIndex}` : undefined
					}
					onKeyDown={handleListKeyDown}
					tabIndex={0}
					className={[
						"absolute left-0 z-50 mt-1",
						"min-w-[160px] rounded-3 border border-gray-6 bg-white",
						"py-1 shadow-md",
						"outline-none focus-visible:ring-2 focus-visible:ring-gray-8",
					].join(" ")}
				>
					{options.map((option, index) => {
						const isSelected = selected.includes(option.value);
						return (
							<li
								key={option.value}
								id={`${listboxId}-option-${index}`}
								role="option"
								aria-selected={isSelected}
								tabIndex={-1}
								onClick={() => handleOptionSelect(option.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										handleOptionSelect(option.value);
									}
								}}
								className={[
									"cursor-pointer px-3 py-2 text-sm",
									"min-h-11 flex items-center",
									"outline-none",
									focusedIndex === index ? "bg-gray-3" : "",
									isSelected ? "font-medium text-gray-12" : "text-gray-11",
								].join(" ")}
							>
								{isSelected && (
									<span className="mr-2 text-gray-12" aria-hidden="true">✓</span>
								)}
								{option.label}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
