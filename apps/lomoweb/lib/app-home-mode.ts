export const HOME_APP_MODE_STORAGE_KEY = "lomo-home-mode";

export type HomeAppMode = "request_help" | "offer_help";

export function readStoredHomeMode(): HomeAppMode | null {
	if (typeof window === "undefined") {
		return null;
	}
	try {
		const v = sessionStorage.getItem(HOME_APP_MODE_STORAGE_KEY);
		if (v === "request_help" || v === "offer_help") {
			return v;
		}
	}
	catch {
		/* private mode */
	}
	return null;
}

export function writeStoredHomeMode(mode: HomeAppMode) {
	try {
		sessionStorage.setItem(HOME_APP_MODE_STORAGE_KEY, mode);
	}
	catch {
		/* ignore */
	}
}
