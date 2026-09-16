"use client";

import { RouteError } from "../route-state";

/**
 * Keeps a failure inside one `/app` view instead of taking down the shell, so the
 * sidebar stays usable and the person can navigate away rather than reload.
 */
export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<RouteError
			reset={reset}
			description="This isn't your fault. Trying again usually sorts it out, and your request wasn't lost."
		/>
	);
}
