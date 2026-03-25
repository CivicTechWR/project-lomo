import type { GroupProps as AriaGroupProps } from "react-aria-components";
import * as React from "react";
import { mergeProps } from "react-aria";
import { Group as AriaGroup, composeRenderProps, InputContext, Provider, TextAreaContext, useContextProps } from "react-aria-components";
import { useFieldContext } from "./field.context.ts";
import { groupVariants } from "./group.variants.ts";

export interface GroupProps extends AriaGroupProps {}

export function Group({ className, ...props }: GroupProps) {
	const { variant, size, color } = useFieldContext();

	const inputRef = React.useRef(null);

	const [inputProps, finalInputRef] = useContextProps({}, inputRef, InputContext);

	const [textAreaProps, finalTextAreaRef] = useContextProps({}, inputRef, TextAreaContext);

	const onClick = () => {
		const current = finalInputRef.current ?? finalTextAreaRef.current;

		current?.focus();
	};

	const { ...rest } = mergeProps({ variant, size, color }, { onClick }, props);

	return (
		<Provider values={[
			[InputContext, { ...inputProps, ref: finalInputRef }],
			[TextAreaContext, { ...textAreaProps, ref: finalTextAreaRef }],
		]}
		>
			<AriaGroup
				{...rest}
				className={composeRenderProps(className, cls =>
					groupVariants({ variant, size, color, class: cls }))}
			/>

		</Provider>
	);
}
