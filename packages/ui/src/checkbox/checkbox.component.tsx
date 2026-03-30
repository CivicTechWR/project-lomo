import type { CheckboxProps as AriaCheckboxProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import type { Colors } from "../theme/types.ts";
import { Checkbox as AriaCheckbox, composeRenderProps } from "react-aria-components";
import { FieldContext } from "../field/index.ts";
import { cn } from "../utils/cn.ts";
import { focusRings } from "../variants/index.ts";
import { useCheckboxGroupContext } from "./checkbox.context.ts";
import { checkboxVariants } from "./checkbox.variants.ts";

export type CheckboxProps = AriaCheckboxProps
	& VariantProps<typeof checkboxVariants> & {
		variant?: "surface" | "classic" | "soft";
		color?: Colors;
	};

export function Checkbox({
	variant,
	size,
	color,
	className,
	...props
}: CheckboxProps) {
	const groupCtx = useCheckboxGroupContext();
	const v = variant ?? groupCtx?.variant ?? "surface";
	const s = size ?? groupCtx?.size ?? 2;
	const c = color ?? groupCtx?.color ?? "terracotta";

	return (
		<FieldContext value={{ variant: v, size: s, color: c }}>
			<AriaCheckbox
				{...props}
				className={composeRenderProps(className, cls =>
					cn(checkboxVariants({ size: s, class: cls }), focusRings[c]))}
			/>
		</FieldContext>
	);
}
