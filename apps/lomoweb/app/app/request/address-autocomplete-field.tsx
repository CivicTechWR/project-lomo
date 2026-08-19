"use client";

import type { KeyboardEvent } from "react";
import type { AddressSearchResult } from "@/lib/address-search";
import { Description, Group, Label } from "@repo/ui/field";
import { Text } from "@repo/ui/text";
import { Input, TextField } from "@repo/ui/text-field";
import { useEffect, useId, useRef, useState } from "react";

export interface AddressSelection {
	label: string;
	lat: number;
	lng: number;
}

interface AddressAutocompleteFieldProps {
	name?: string;
	label?: string;
	description?: string;
	placeholder?: string;
	value: string;
	/** Set when the current value was chosen from suggestions. */
	selectedLat: number | undefined;
	selectedLng: number | undefined;
	onChange: (value: string) => void;
	onSelect: (selection: AddressSelection) => void;
	onClearSelection: () => void;
}

export function AddressAutocompleteField({
	name = "address",
	label = "Address",
	description,
	placeholder = "Start typing a street address…",
	value,
	selectedLat,
	selectedLng,
	onChange,
	onSelect,
	onClearSelection,
}: AddressAutocompleteFieldProps) {
	const listId = useId();
	const wrapRef = useRef<HTMLDivElement>(null);
	const [query, setQuery] = useState(value);
	const [results, setResults] = useState<AddressSearchResult[]>([]);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [searchError, setSearchError] = useState(false);

	const isVerified = selectedLat != null && selectedLng != null && value.trim().length > 0;

	useEffect(() => {
		setQuery(value);
	}, [value]);

	useEffect(() => {
		const trimmed = query.trim();
		if (trimmed.length < 3) {
			setResults([]);
			setLoading(false);
			setSearchError(false);
			return;
		}

		// Don't re-search after a verified selection that matches the field.
		if (
			isVerified
			&& trimmed === value.trim()
		) {
			setResults([]);
			setLoading(false);
			return;
		}

		const controller = new AbortController();
		const timer = window.setTimeout(async () => {
			setLoading(true);
			setSearchError(false);
			try {
				const res = await fetch(
					`/api/address-search?q=${encodeURIComponent(trimmed)}`,
					{ signal: controller.signal },
				);
				if (!res.ok) {
					setResults([]);
					setSearchError(true);
					return;
				}
				const data = (await res.json()) as { results?: AddressSearchResult[] };
				setResults(data.results ?? []);
				setOpen(true);
				setActiveIndex(-1);
			}
			catch (e) {
				if ((e as Error).name === "AbortError") {
					return;
				}
				setResults([]);
				setSearchError(true);
			}
			finally {
				setLoading(false);
			}
		}, 350);

		return () => {
			controller.abort();
			window.clearTimeout(timer);
		};
	}, [query, isVerified, value]);

	useEffect(() => {
		function onPointerDown(e: PointerEvent) {
			if (!wrapRef.current?.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, []);

	function handleInputChange(next: string) {
		setQuery(next);
		onChange(next);
		if (isVerified) {
			onClearSelection();
		}
		setOpen(true);
	}

	function pick(result: AddressSearchResult) {
		onChange(result.label);
		onSelect({ label: result.label, lat: result.lat, lng: result.lng });
		setQuery(result.label);
		setResults([]);
		setOpen(false);
		setActiveIndex(-1);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (!open || results.length === 0) {
			return;
		}
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActiveIndex(i => (i + 1) % results.length);
		}
		else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActiveIndex(i => (i <= 0 ? results.length - 1 : i - 1));
		}
		else if (e.key === "Enter" && activeIndex >= 0) {
			e.preventDefault();
			const hit = results[activeIndex];
			if (hit) {
				pick(hit);
			}
		}
		else if (e.key === "Escape") {
			setOpen(false);
		}
	}

	const showList = open && (loading || results.length > 0 || searchError || query.trim().length >= 3);

	return (
		<div ref={wrapRef} className="relative flex flex-col gap-1">
			<TextField
				name={name}
				value={query}
				onChange={handleInputChange}
				autoComplete="street-address"
			>
				<Label>{label}</Label>
				{description
					? <Description>{description}</Description>
					: null}
				<Group>
					<Input
						placeholder={placeholder}
						role="combobox"
						aria-expanded={showList}
						aria-controls={listId}
						aria-autocomplete="list"
						aria-activedescendant={
							activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
						}
						onKeyDown={handleKeyDown}
						onFocus={() => {
							if (query.trim().length >= 3 && !isVerified) {
								setOpen(true);
							}
						}}
					/>
				</Group>
			</TextField>

			{isVerified
				? (
						<Text size={1} className="text-sage-11">
							Address verified — ready for delivery matching.
						</Text>
					)
				: query.trim().length > 0
					? (
							<Text size={1} color="gray">
								Pick a match from the list so we can place this request on the map.
							</Text>
						)
					: null}

			{showList
				? (
						<ul
							id={listId}
							role="listbox"
							aria-label="Address suggestions"
							className={
								"absolute top-full z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-[var(--radius-3)] "
								+ "border border-gray-6 bg-gray-1 py-1 shadow-lg"
							}
						>
							{loading && results.length === 0
								? (
										<li className="px-3 py-2">
											<Text size={2} color="gray">Searching…</Text>
										</li>
									)
								: null}
							{searchError && !loading
								? (
										<li className="px-3 py-2">
											<Text size={2} color="gray">
												Couldn&apos;t search addresses. Try again in a moment.
											</Text>
										</li>
									)
								: null}
							{!loading && !searchError && results.length === 0 && query.trim().length >= 3
								? (
										<li className="px-3 py-2">
											<Text size={2} color="gray">
												No matches. Try a fuller street address and city.
											</Text>
										</li>
									)
								: null}
							{results.map((result, index) => {
								const active = index === activeIndex;
								return (
									<li
										key={result.id}
										id={`${listId}-option-${index}`}
										role="option"
										aria-selected={active}
									>
										<button
											type="button"
											className={
												active
													? "w-full px-3 py-2 text-left text-[length:var(--text-2)] text-gray-12 bg-sage-3"
													: "w-full px-3 py-2 text-left text-[length:var(--text-2)] text-gray-12 hover:bg-gray-3"
											}
											onMouseEnter={() => setActiveIndex(index)}
											onClick={() => pick(result)}
										>
											{result.label}
										</button>
									</li>
								);
							})}
						</ul>
					)
				: null}
		</div>
	);
}
