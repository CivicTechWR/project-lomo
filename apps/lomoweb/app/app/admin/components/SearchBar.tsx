"use client";

import { Icon } from "@repo/ui/icons";
import { useCallback, useId, useRef } from "react";

// --- SearchBar Component ---

export interface SearchBarProps {
	/** Current search value (controlled) */
	value: string;
	/** Called when the search value changes */
	onChange: (value: string) => void;
	/** Placeholder text shown when input is empty */
	placeholder?: string;
}

/**
 * Reusable search input for admin list views (Requests and Users).
 *
 * Features:
 * - Controlled text input with 100-char max
 * - Visible label (sr-only) with aria-label as fallback
 * - Magnifying glass icon on the left
 * - Clear button (X) when text is present
 * - Design: rounded-full border border-gray-6, bg-white, focus ring
 */
export function SearchBar({
	value,
	onChange,
	placeholder = "Search...",
}: SearchBarProps) {
	const inputId = useId();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChange(e.target.value);
		},
		[onChange],
	);

	const handleClear = useCallback(() => {
		onChange("");
		inputRef.current?.focus();
	}, [onChange]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLButtonElement>) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				handleClear();
			}
		},
		[handleClear],
	);

	return (
		<div className="w-full">
			<label htmlFor={inputId} className="sr-only">
				Search requests
			</label>
			<div className="relative flex items-center">
				{/* Magnifying glass icon */}
				<div className="pointer-events-none absolute left-3 flex items-center">
					<Icon name="search" className="size-5 text-gray-9" />
				</div>

				<input
					ref={inputRef}
					id={inputId}
					type="search"
					role="searchbox"
					value={value}
					onChange={handleChange}
					placeholder={placeholder}
					maxLength={100}
					aria-label="Search requests"
					className={[
						"w-full rounded-full border border-gray-6 bg-white",
						"py-2.5 pl-10 pr-10",
						"text-sm text-gray-12 placeholder:text-gray-9",
						"outline-none focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2",
						"min-h-11",
					].join(" ")}
				/>

				{/* Clear button — visible only when value is non-empty */}
				{value.length > 0 && (
					<button
						type="button"
						onClick={handleClear}
						onKeyDown={handleKeyDown}
						aria-label="Clear search"
						className={[
							"absolute right-3 flex items-center justify-center",
							"size-6 rounded-full",
							"text-gray-11 hover:bg-gray-3",
							"outline-none focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2",
						].join(" ")}
					>
						<Icon name="close" className="size-4" />
					</button>
				)}
			</div>
		</div>
	);
}
