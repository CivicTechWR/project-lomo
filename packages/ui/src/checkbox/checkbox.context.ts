import type { Colors } from "../theme/types.ts";
import { createContext, use } from "react";

export interface CheckboxGroupContextValue {
	variant: "surface" | "classic" | "soft";
	size: 1 | 2 | 3;
	color: Colors;
}

export const CheckboxGroupContext
	= createContext<CheckboxGroupContextValue | null>(null);

export function useCheckboxGroupContext(): CheckboxGroupContextValue | null {
	return use(CheckboxGroupContext);
}

export interface CheckboxCardsContextValue {
	variant: "ghost" | "surface" | "classic";
	size: 1 | 2 | 3;
	color: Colors;
}

export const CheckboxCardsContext
	= createContext<CheckboxCardsContextValue | null>(null);

export function useCheckboxCardsContext(): CheckboxCardsContextValue | null {
	return use(CheckboxCardsContext);
}
