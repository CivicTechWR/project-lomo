import { useRef } from "react";

/**
 * Sentinel for "nothing has been synced yet".
 *
 * A unique symbol, because the ref has to start at a value the query can never
 * return. `undefined` and `null` are both real states of a Convex query (loading
 * and "no row"), so neither can be used to mean "not yet synced".
 */
const UNSYNCED = Symbol("unsynced");

/**
 * Whether a form should (re)load its fields from a server row on this render.
 *
 * Returns `true` on the first render where `row` is non-nullish, and again
 * whenever `row`'s identity changes — which for a Convex query means the
 * underlying document actually changed. Returns `false` on every other render, so
 * edits the user has typed but not yet saved are left alone.
 *
 * Why this exists rather than `useRef(row)` inline: initialising the ref *with*
 * the row is only correct when the component mounts before the query resolves.
 * When it mounts while the query is already warm — the normal case here, since
 * the `/app` layout and sidebar subscribe to `getMyProfileRow` before any page
 * does — the ref starts out equal to the row, the identity check is false
 * immediately, and the form silently keeps its empty defaults. That made the
 * profile show "I can offer support" as off no matter what was stored, and made
 * saving write those defaults back over the user's real preferences.
 *
 * Mutating a ref during render is safe here because the value is only ever
 * advanced, so the render stays idempotent: a repeated render with the same row
 * takes the `false` path instead of re-syncing.
 */
export function useServerRowSync<T>(row: T | null | undefined): boolean {
	const lastSyncedRef = useRef<T | null | undefined | typeof UNSYNCED>(UNSYNCED);

	if (row != null && row !== lastSyncedRef.current) {
		lastSyncedRef.current = row;
		return true;
	}
	return false;
}
