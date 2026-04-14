"use client";

/**
 * Three-segment progress (matches meal-request mockups).
 * filledCount 0–3: how many segments use the active (dark) fill.
 */
export function RequestProgress({ filledCount }: { filledCount: number }) {
	const n = Math.min(3, Math.max(0, filledCount));

	return (
		<div
			aria-hidden
			className="flex w-full max-w-[min(100%,320px)] gap-1"
		>
			{[0, 1, 2].map(i => (
				<div
					key={i}
					className={
						i < n
							? "h-2 min-h-2 flex-1 rounded-sm bg-gray-11"
							: "h-2 min-h-2 flex-1 rounded-sm bg-gray-5"
					}
				/>
			))}
		</div>
	);
}
