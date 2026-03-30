import type { Colors } from "../theme/types.ts";
import { createContext, use } from "react";

export interface CheckboxGroupStyleContextValue {
	variant: "surface" | "classic";
	size: 1 | 2 | 3;
	color: Colors;
}

export const CheckboxGroupStyleContext
	= createContext<CheckboxGroupStyleContextValue | null>(null);

export const CHECKBOX_DEFAULTS = {
	variant: "surface",
	size: 2,
	color: "terracotta",
} as const satisfies CheckboxGroupStyleContextValue;

export function useCheckboxGroupStyleContext(): CheckboxGroupStyleContextValue | null {
	return use(CheckboxGroupStyleContext);
}
