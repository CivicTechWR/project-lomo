import type { CheckboxProps as AriaCheckboxProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { Checkbox as AriaCheckbox, composeRenderProps, TextContext } from "react-aria-components";
import { FieldContext } from "../field/index.ts";
import { checkboxCardVariants } from "./checkbox-card.variants.ts";
import { CHECKBOX_DEFAULTS, useCheckboxGroupStyleContext } from "./checkbox.context.ts";

export type CheckboxCardProps = AriaCheckboxProps
	& VariantProps<typeof checkboxCardVariants>;

export function CheckboxCard({
	variant,
	size,
	color,
	className,
	...props
}: CheckboxCardProps) {
	const groupCtx = useCheckboxGroupStyleContext();
	const v = variant ?? groupCtx?.variant ?? CHECKBOX_DEFAULTS.variant;
	const s = size ?? groupCtx?.size ?? CHECKBOX_DEFAULTS.size;
	const c = color ?? groupCtx?.color ?? CHECKBOX_DEFAULTS.color;

	return (
		<FieldContext
			value={{
				variant: "surface",
				size: s,
				color: c,
			}}
		>
			<TextContext value={null}>
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
			</TextContext>
		</FieldContext>
	);
}
