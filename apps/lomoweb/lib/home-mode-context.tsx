"use client";

import type { ReactNode } from "react";
import type { HomeAppMode } from "@/lib/app-home-mode";
import { createContext, use, useRef, useState } from "react";
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
	// Restore the last mode from sessionStorage after mount via ref-based sync.
	const [modeState, setModeState] = useState<HomeAppMode>("home");

	const restoredRef = useRef(false);
	if (!restoredRef.current && typeof window !== "undefined") {
		restoredRef.current = true;
		const stored = readStoredHomeMode();
		if (stored != null) {
			setModeState(stored);
		}
	}

	function setMode(next: HomeAppMode) {
		setModeState(next);
		writeStoredHomeMode(next);
	}

	function toggleMode() {
		if (modeState === "home" || modeState === "offer_help") {
			setMode("request_help");
			return;
		}
		setMode("offer_help");
	}

	return (
		<HomeModeContext value={{ mode: modeState, setMode, toggleMode }}>
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
