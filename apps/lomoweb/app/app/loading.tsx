import { RouteSkeleton } from "../route-state";

/**
 * Shown while any `/app` segment streams in.
 *
 * Previously each page hand-rolled its own inline skeleton, which meant the
 * placeholder only appeared once the page component had already begun rendering.
 */
export default function Loading() {
	return <RouteSkeleton />;
}
