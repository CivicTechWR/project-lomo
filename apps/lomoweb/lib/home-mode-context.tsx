"use client";

import type { ReactNode } from "react";
import type { HomeAppMode } from "@/lib/app-home-mode";
import { createContext, use, useCallback, useMemo, useSyncExternalStore } from "react";
import {
	getServerHomeMode,
	readStoredHomeMode,
	subscribeToHomeMode,
	writeStoredHomeMode,
} from "@/lib/app-home-mode";

interface HomeModeContextValue {
	mode: HomeAppMode;
	setMode: (mode: HomeAppMode) => void;
	toggleMode: () => void;
}

const HomeModeContext = createContext<HomeModeContextValue | null>(null);

export function HomeModeProvider({ children }: { children: ReactNode }) {
	/*
	 * The store in `app-home-mode.ts` is the single source of truth — there is no
	 * local mirror of the mode here, so the two cannot drift apart.
	 *
	 * The third argument is what makes this hydration-safe: SSR and the hydration
	 * render both use `getServerHomeMode()`, matching the server HTML, and React
	 * then re-reads the persisted value right after hydrating.
	 */
	const mode = useSyncExternalStore(
		subscribeToHomeMode,
		readStoredHomeMode,
		getServerHomeMode,
	);

	const setMode = useCallback((next: HomeAppMode) => {
		// Writing to the store notifies subscribers, which re-renders consumers.
		writeStoredHomeMode(next);
	}, []);

	const toggleMode = useCallback(() => {
		setMode(mode === "home" || mode === "offer_help" ? "request_help" : "offer_help");
	}, [mode, setMode]);

	const value = useMemo<HomeModeContextValue>(
		() => ({ mode, setMode, toggleMode }),
		[mode, setMode, toggleMode],
	);

	return (
		<HomeModeContext value={value}>
			{children}
		</HomeModeContext>
	);
}

export function useHomeMode(): HomeModeContextValue {
	const value = use(HomeModeContext);
	if (!value) {
		throw new Error("useHomeMode must be used within HomeModeProvider");
	}
	return value;
}
