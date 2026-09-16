"use client";

import type { ReactNode } from "react";
import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Icon } from "@repo/ui/icons";
import { Text } from "@repo/ui/text";

/**
 * Shared presentation for route-level error, empty, and not-found states.
 *
 * Centralised so every boundary reads the same way. Copy is deliberately calm and
 * non-blaming — a person hitting an error is often already having a bad day, and
 * this is a mutual-aid app, not a build tool.
 *
 * Note the raw technical error is never rendered: it can carry backend details,
 * and it is not actionable for the person reading it.
 */
export function RouteState({
	title,
	description,
	action,
	tone = "neutral",
}: {
	title: string;
	description: string;
	/** Primary recovery affordance, e.g. a retry button or a link home. */
	action?: ReactNode;
	tone?: "neutral" | "error";
}) {
	return (
		<div className="flex min-h-60 flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
			<Icon
				name={tone === "error" ? "alert" : "mapPin"}
				className={`size-6 ${tone === "error" ? "text-red-9" : "text-gray-9"}`}
			/>
			<Heading level={1} size={6} className="text-gray-12">
				{title}
			</Heading>
			<Text size={2} className="max-w-prose text-gray-11">
				{description}
			</Text>
			{action != null && <div className="mt-2">{action}</div>}
		</div>
	);
}

/**
 * Error boundary body shared by the route `error.tsx` files.
 *
 * `reset` re-renders the segment rather than reloading the document, so an
 * intermittent failure recovers without losing the rest of the app's state.
 */
export function RouteError({
	reset,
	title = "Something went wrong on our end",
	description = "This isn't your fault. Trying again usually sorts it out.",
}: {
	reset: () => void;
	title?: string;
	description?: string;
}) {
	return (
		<RouteState
			tone="error"
			title={title}
			description={description}
			action={(
				<Button variant="solid" color="terracotta" size={2} onPress={reset}>
					Try again
				</Button>
			)}
		/>
	);
}

/**
 * Skeleton placeholder for route `loading.tsx` files.
 *
 * `aria-hidden` with an accompanying live-region status: the shapes are
 * meaningless to a screen reader, but the fact that something is loading is not.
 */
export function RouteSkeleton({ rows = 3 }: { rows?: number }) {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
			<p role="status" className="sr-only">
				Loading
			</p>
			<div aria-hidden className="flex flex-col gap-4">
				<div className="h-8 w-48 animate-pulse rounded-2 bg-gray-3" />
				{Array.from({ length: rows }, (_, i) => (
					<div key={i} className="flex flex-col gap-2">
						<div className="h-24 w-full animate-pulse rounded-3 bg-gray-3" />
					</div>
				))}
			</div>
		</div>
	);
}
