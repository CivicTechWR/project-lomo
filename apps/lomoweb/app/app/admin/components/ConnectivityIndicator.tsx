"use client";

import { Icon } from "@repo/ui/icons";
import { useCallback, useEffect, useRef, useState } from "react";

type ConnectionStatus = "connected" | "disconnected" | "reconnected";

/**
 * Monitors browser online/offline status as a proxy for Convex subscription
 * connectivity. Displays a dismissible banner when disconnected and a brief
 * success banner when reconnected (auto-dismisses after 3 seconds).
 *
 * Uses `aria-live="assertive"` so screen readers announce connectivity changes
 * immediately (Req 9.4, 9.5).
 */
export function ConnectivityIndicator() {
	const [status, setStatus] = useState<ConnectionStatus>(() =>
		typeof navigator !== "undefined" && !navigator.onLine
			? "disconnected"
			: "connected",
	);
	const [dismissed, setDismissed] = useState(false);
	const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const wasDisconnectedRef = useRef(
		typeof navigator !== "undefined" && !navigator.onLine,
	);

	useEffect(() => {
		function handleOffline() {
			wasDisconnectedRef.current = true;
			setDismissed(false);
			setStatus("disconnected");
		}

		function handleOnline() {
			if (wasDisconnectedRef.current) {
				wasDisconnectedRef.current = false;
				setDismissed(false);
				setStatus("reconnected");

				// Auto-dismiss reconnected banner after 3 seconds
				reconnectTimerRef.current = setTimeout(() => {
					setStatus("connected");
				}, 3000);
			}
		}

		window.addEventListener("offline", handleOffline);
		window.addEventListener("online", handleOnline);

		return () => {
			window.removeEventListener("offline", handleOffline);
			window.removeEventListener("online", handleOnline);
			if (reconnectTimerRef.current) {
				clearTimeout(reconnectTimerRef.current);
			}
		};
	}, []);

	const handleDismiss = useCallback(() => {
		setDismissed(true);
	}, []);

	// Nothing to show
	if (status === "connected" || dismissed) {
		return (
			<div aria-live="assertive" aria-atomic="true" className="sr-only">
				{/* Empty — screen readers will announce when content appears */}
			</div>
		);
	}

	if (status === "disconnected") {
		return (
			<div
				role="alert"
				aria-live="assertive"
				aria-atomic="true"
				className="mx-auto w-full max-w-4xl px-4 pt-3 sm:px-6"
			>
				<div className="flex items-center justify-between gap-3 rounded-2 border border-yellow-8 bg-yellow-3 px-4 py-3 text-sm text-gray-12">
					<span>
						<strong className="font-semibold">Connection lost.</strong>
						{" "}
						Reconnecting&hellip;
					</span>
					<button
						type="button"
						onClick={handleDismiss}
						className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded text-gray-12 hover:bg-yellow-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-8"
						aria-label="Dismiss connectivity warning"
					>
						<Icon name="close" className="size-3.5" />
					</button>
				</div>
			</div>
		);
	}

	// reconnected
	return (
		<div
			role="status"
			aria-live="assertive"
			aria-atomic="true"
			className="mx-auto w-full max-w-4xl px-4 pt-3 sm:px-6"
		>
			<div className="flex items-center justify-between gap-3 rounded-2 border border-sage-7 bg-sage-3 px-4 py-3 text-sm text-gray-12">
				<span>
					<strong className="font-semibold">Connected.</strong>
					{" "}
					Data synced.
				</span>
				<button
					type="button"
					onClick={handleDismiss}
					className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded text-gray-12 hover:bg-sage-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-8"
					aria-label="Dismiss connectivity status"
				>
					<Icon name="close" className="size-3.5" />
				</button>
			</div>
		</div>
	);
}
