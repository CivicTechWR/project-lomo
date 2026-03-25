import type { Colors } from "../theme/types.ts";
import { createContext, use } from "react";

export type FieldVariant = "surface" | "classic" | "soft";
export type FieldSize = 1 | 2 | 3;
export type FieldColor = Colors;

export interface FieldContextValue {
	variant: FieldVariant;
	size: FieldSize;
	color: FieldColor;
}

export const FieldContext = createContext<FieldContextValue>({
	variant: "surface",
	size: 2,
	color: "gray",
});

export function useFieldContext(): FieldContextValue {
	return use(FieldContext);
}
