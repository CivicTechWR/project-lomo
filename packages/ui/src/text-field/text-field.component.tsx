import type { TextFieldProps as AriaTextFieldProps } from "react-aria-components";
import type { FieldColor, FieldSize, FieldVariant } from "../field/index.ts";
import type { TextFieldOrientation } from "./text-field.variants.ts";
import { TextField as AriaTextField, composeRenderProps } from "react-aria-components";
import { FieldContext } from "../field/index.ts";
import { textFieldVariants } from "./text-field.variants.ts";

export interface TextFieldProps extends AriaTextFieldProps {
	variant?: FieldVariant;
	size?: FieldSize;
	color?: FieldColor;
	orientation?: TextFieldOrientation;
}

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
