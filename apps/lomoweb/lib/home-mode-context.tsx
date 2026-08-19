"use client";

import type { ReactNode } from "react";
import type { HomeAppMode } from "@/lib/app-home-mode";
import { createContext, use, useEffect, useState } from "react";
import {

	readStoredHomeMode,
	writeStoredHomeMode,
} from "@/lib/app-home-mode";

interface HomeModeContextValue {
	mode: HomeAppMode;
	setMode: (mode: HomeAppMode) => void;
	toggleMode: () => void;
}

const HomeModeContext = createContext<HomeModeContextValue | null>(null);

export function HomeModeProvider({ children }: { children: ReactNode }) {
	// Always start with "home" so SSR and the first client render match.
	// Restore the last mode from sessionStorage after mount.
	const [mode, setModeState] = useState<HomeAppMode>("home");

	useEffect(() => {
		const stored = readStoredHomeMode();
		if (stored) {
			setModeState(stored);
		}
	}, []);

	function setMode(next: HomeAppMode) {
		setModeState(next);
		writeStoredHomeMode(next);
	}

	function toggleMode() {
		if (mode === "home" || mode === "offer_help") {
			setMode("request_help");
			return;
		}
		setMode("offer_help");
	}

	return (
		<HomeModeContext value={{ mode, setMode, toggleMode }}>
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
