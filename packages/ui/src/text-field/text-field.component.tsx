import type { TextFieldProps as AriaTextFieldProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import type { FieldColor, FieldVariant } from "../field/index.ts";
import { TextField as AriaTextField, composeRenderProps } from "react-aria-components";
import { FieldContext } from "../field/index.ts";
import { textFieldVariants } from "./text-field.variants.ts";

export type TextFieldProps = AriaTextFieldProps & VariantProps<typeof textFieldVariants> & {
	variant?: FieldVariant;
	color?: FieldColor;
};

export function TextField({
	variant = "surface",
	size = 2,
	color = "gray",
	orientation = "vertical",
	className,
	...props
}: TextFieldProps) {
	return (
		<FieldContext value={{ variant, size, color }}>
			<AriaTextField
				{...props}
				className={composeRenderProps(className, cls =>
					textFieldVariants({ orientation, size, class: cls }))}
			/>
		</FieldContext>
	);
}
