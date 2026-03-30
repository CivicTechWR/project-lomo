import type { CheckboxGroupProps as AriaCheckboxGroupProps } from "react-aria-components";
import type { Colors } from "../theme/types.ts";
import { CheckboxGroup as AriaCheckboxGroup } from "react-aria-components";
import { FieldContext } from "../field/index.ts";
import { CHECKBOX_DEFAULTS, CheckboxGroupStyleContext } from "./checkbox.context.ts";

export type CheckboxCardGroupProps = AriaCheckboxGroupProps & {
	variant?: "surface" | "classic";
	size?: 1 | 2 | 3;
	color?: Colors;
};

export function CheckboxCardGroup({
	variant = CHECKBOX_DEFAULTS.variant,
	size = CHECKBOX_DEFAULTS.size,
	color = CHECKBOX_DEFAULTS.color,
	className,
	...props
}: CheckboxCardGroupProps) {
	return (
		<CheckboxGroupStyleContext value={{ variant, size, color }}>
			<FieldContext value={{ variant: "surface", size, color }}>
				<AriaCheckboxGroup {...props} className={className} />
			</FieldContext>
		</CheckboxGroupStyleContext>
	);
}
