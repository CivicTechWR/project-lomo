"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import {
	writeStoredHomeMode,
	type HomeAppMode,
} from "@/lib/app-home-mode";

type HomeModeContextValue = {
	mode: HomeAppMode;
	setMode: (mode: HomeAppMode) => void;
	toggleMode: () => void;
};

const HomeModeContext = createContext<HomeModeContextValue | null>(null);

export function HomeModeProvider({ children }: { children: ReactNode }) {
	const [mode, setModeState] = useState<HomeAppMode>("home");

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
	const value = useContext(HomeModeContext);
	if (!value) {
		throw new Error("useHomeMode must be used within HomeModeProvider");
	}
	return value;
}
