"use client";

import { useCallback, useId, useRef } from "react";

// --- Icon Components ---

function SearchIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={20}
			height={20}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
		</svg>
	);
}

function ClearIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={16}
			height={16}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</svg>
	);
}

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
					<SearchIcon className="text-gray-9" />
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
						"min-h-[44px]",
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
						<ClearIcon />
					</button>
				)}
			</div>
		</div>
	);
}
