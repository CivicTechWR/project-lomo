import type { CheckboxGroupProps as AriaCheckboxGroupProps } from "react-aria-components";
import type { Colors } from "../theme/types.ts";
import { CheckboxGroup as AriaCheckboxGroup, composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";
import { FieldContext } from "../field/index.ts";
import { tw } from "../utils/tw.ts";
import { fieldGaps } from "../variants/index.ts";
import { CHECKBOX_DEFAULTS, CheckboxGroupStyleContext } from "./checkbox.context.ts";

const checkboxGroupVariants = tv({
	base: tw("flex flex-col"),
	variants: {
		size: fieldGaps,
	},
	defaultVariants: {
		size: CHECKBOX_DEFAULTS.size,
	},
});

export type CheckboxGroupProps = AriaCheckboxGroupProps & {
	variant?: "surface" | "classic";
	size?: 1 | 2 | 3;
	color?: Colors;
};

export function CheckboxGroup({
	variant = CHECKBOX_DEFAULTS.variant,
	size = CHECKBOX_DEFAULTS.size,
	color = CHECKBOX_DEFAULTS.color,
	className,
	...props
}: CheckboxGroupProps) {
	return (
		<CheckboxGroupStyleContext value={{ variant, size, color }}>
			<FieldContext value={{ variant, size, color }}>
				<AriaCheckboxGroup
					{...props}
					className={composeRenderProps(className, cls =>
						checkboxGroupVariants({ size, class: cls }))}
				/>
			</FieldContext>
		</CheckboxGroupStyleContext>
	);
}
