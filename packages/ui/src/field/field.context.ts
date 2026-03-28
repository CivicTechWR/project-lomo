import type { VariantProps } from "tailwind-variants";
import type { groupVariants } from "./group.variants.ts";
import { createContext, use } from "react";

type GroupVP = VariantProps<typeof groupVariants>;
export type FieldVariant = NonNullable<GroupVP["variant"]>;
export type FieldSize = NonNullable<GroupVP["size"]>;
export type FieldColor = NonNullable<GroupVP["color"]>;

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
