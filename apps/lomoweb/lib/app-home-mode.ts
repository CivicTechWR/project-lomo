export const HOME_APP_MODE_STORAGE_KEY = "lomo-home-mode";

export type HomeAppMode = "home" | "request_help" | "offer_help";

/**
 * What the server renders, and what the client must also render on its first
 * pass so hydration matches.
 */
export const DEFAULT_HOME_MODE: HomeAppMode = "home";

/**
 * Home mode as an external store, so React can read it through
 * `useSyncExternalStore`.
 *
 * It has to be a store rather than component state because the value lives in
 * `sessionStorage`, which does not exist during SSR. Reading it while rendering
 * makes the server and client disagree, and the previous implementation did
 * exactly that — it called `setState` mid-render behind a `typeof window` check,
 * so the hydration pass already had the restored mode while the server HTML had
 * the default. That surfaced as a hydration mismatch on whichever attribute
 * happened to depend on the active tab.
 *
 * `useSyncExternalStore` fixes it properly: `getServerHomeMode` is used for SSR
 * and hydration, then React re-reads the real value immediately afterwards.
 *
 * Note this is deliberately NOT wired to the `storage` event. `sessionStorage`
 * is scoped to a single tab, so there is no cross-tab change to listen for.
 */

const listeners = new Set<() => void>();

/**
 * Authoritative value for the life of the tab.
 *
 * Also acts as the fallback when storage is unavailable (private browsing, or a
 * blocked-cookies setting), so switching modes still works even when nothing can
 * be persisted.
 */
let currentMode: HomeAppMode | null = null;

function isHomeAppMode(value: unknown): value is HomeAppMode {
	return value === "home" || value === "request_help" || value === "offer_help";
}

function readFromStorage(): HomeAppMode {
	try {
		const stored = sessionStorage.getItem(HOME_APP_MODE_STORAGE_KEY);
		return isHomeAppMode(stored) ? stored : DEFAULT_HOME_MODE;
	}
	catch {
		return DEFAULT_HOME_MODE;
	}
}

/**
 * Current mode. Safe to call on every render: the value is cached after the
 * first read, so `useSyncExternalStore` sees a stable snapshot.
 */
export function readStoredHomeMode(): HomeAppMode {
	if (typeof window === "undefined") {
		return DEFAULT_HOME_MODE;
	}
	currentMode ??= readFromStorage();
	return currentMode;
}

/** The snapshot used for SSR and for the hydration render. */
export function getServerHomeMode(): HomeAppMode {
	return DEFAULT_HOME_MODE;
}

export function writeStoredHomeMode(mode: HomeAppMode) {
	currentMode = mode;
	try {
		sessionStorage.setItem(HOME_APP_MODE_STORAGE_KEY, mode);
	}
	catch {
		/* Not persistable; `currentMode` still carries it for this tab. */
	}
	for (const listener of listeners) {
		listener();
	}
}

export function subscribeToHomeMode(onStoreChange: () => void): () => void {
	listeners.add(onStoreChange);
	return () => {
		listeners.delete(onStoreChange);
	};
}
