"use client";

import { RouteError } from "./route-state";

/**
 * Catches render errors anywhere below the root layout.
 *
 * Next.js requires this to be a client component and passes `reset` to re-render
 * the failed segment. Errors in the root *layout* itself escape this boundary and
 * are handled by `global-error.tsx` instead.
 */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return <RouteError reset={reset} />;
}
