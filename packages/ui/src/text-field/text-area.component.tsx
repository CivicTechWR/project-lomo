import type { TextAreaProps as AriaTextAreaProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { TextArea as AriaTextArea, composeRenderProps } from "react-aria-components";
import { textAreaVariants } from "./text-area.variants.ts";

export type TextAreaProps = AriaTextAreaProps & VariantProps<typeof textAreaVariants>;

export function TextArea({ resize, className, ...props }: TextAreaProps) {
	return (
		<AriaTextArea
			{...props}
			className={composeRenderProps(className, cls =>
				textAreaVariants({ resize, class: cls }))}
		/>
	);
}
