import type { CheckboxProps as AriaCheckboxProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import type { Colors } from "../theme/types.ts";
import { Checkbox as AriaCheckbox, composeRenderProps } from "react-aria-components";
import { FieldContext } from "../field/index.ts";
import { checkboxCardVariants } from "./checkbox-card.variants.ts";
import { useCheckboxCardsContext } from "./checkbox.context.ts";

export type CheckboxCardProps = AriaCheckboxProps
	& Partial<VariantProps<typeof checkboxCardVariants>> & {
		color?: Colors;
	};

const CARD_TO_INDICATOR_VARIANT = {
	ghost: "soft",
	surface: "surface",
	classic: "surface",
} as const;

export function CheckboxCard({
	variant,
	size,
	color,
	className,
	...props
}: CheckboxCardProps) {
	const cardsCtx = useCheckboxCardsContext();
	const v = variant ?? cardsCtx?.variant ?? "surface";
	const s = size ?? cardsCtx?.size ?? 2;
	const c = color ?? cardsCtx?.color ?? "terracotta";

	return (
		<FieldContext
			value={{
				variant: CARD_TO_INDICATOR_VARIANT[v],
				size: s,
				color: c,
			}}
		>
			<AriaCheckbox
				{...props}
				className={composeRenderProps(className, cls =>
					checkboxCardVariants({
						variant: v,
						size: s,
						color: c,
						class: cls,
					}))}
			/>
		</FieldContext>
	);
}
