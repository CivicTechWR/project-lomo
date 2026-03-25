import type { GroupProps as AriaGroupProps } from "react-aria-components";
import { Group as AriaGroup, composeRenderProps } from "react-aria-components";
import { useFieldContext } from "./field.context.ts";
import { groupVariants } from "./group.variants.ts";

export interface GroupProps extends AriaGroupProps {}

export function Group({ className, ...props }: GroupProps) {
	const { variant, size, color } = useFieldContext();
	return (
		<AriaGroup
			{...props}
			className={composeRenderProps(className, cls =>
				groupVariants({ variant, size, color, class: cls }))}
		/>
	);
}
