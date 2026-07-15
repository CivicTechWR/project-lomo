"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
	readStoredHomeMode,
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
	const [mode, setModeState] = useState<HomeAppMode>("request_help");

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
		setMode(mode === "request_help" ? "offer_help" : "request_help");
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
