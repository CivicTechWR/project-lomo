import type { CheckboxProps as AriaCheckboxProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import type { Colors } from "../theme/types.ts";
import { Checkbox as AriaCheckbox, composeRenderProps, TextContext } from "react-aria-components";
import { FieldContext } from "../field/index.ts";
import { checkboxCardVariants } from "./checkbox-card.variants.ts";
import { useCheckboxGroupStyleContext } from "./checkbox.context.ts";

export type CheckboxCardProps = AriaCheckboxProps
	& Partial<VariantProps<typeof checkboxCardVariants>> & {
		color?: Colors;
	};

export function CheckboxCard({
	variant,
	size,
	color,
	className,
	...props
}: CheckboxCardProps) {
	const groupCtx = useCheckboxGroupStyleContext();
	const v = variant ?? groupCtx?.variant ?? "surface";
	const s = size ?? groupCtx?.size ?? 2;
	const c = color ?? groupCtx?.color ?? "terracotta";

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
