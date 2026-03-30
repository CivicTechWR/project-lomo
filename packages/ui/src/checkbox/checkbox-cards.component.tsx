import type { CheckboxGroupProps as AriaCheckboxGroupProps } from "react-aria-components";
import type { Colors } from "../theme/types.ts";
import { CheckboxGroup as AriaCheckboxGroup, composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";
import { FieldContext } from "../field/index.ts";
import { tw } from "../utils/tw.ts";
import { fieldGaps } from "../variants/index.ts";
import { CheckboxCardsContext } from "./checkbox.context.ts";

const checkboxCardsVariants = tv({
	base: tw("grid"),
	variants: {
		size: fieldGaps,
	},
	defaultVariants: {
		size: 2,
	},
});

export type CheckboxCardsProps = AriaCheckboxGroupProps & {
	variant?: "ghost" | "surface" | "classic";
	size?: 1 | 2 | 3;
	color?: Colors;
	columns?: string;
};

export function CheckboxCards({
	variant = "surface",
	size = 2,
	color = "terracotta",
	columns,
	className,
	style,
	...props
}: CheckboxCardsProps) {
	return (
		<CheckboxCardsContext value={{ variant, size, color }}>
			<FieldContext value={{ variant: "surface", size, color }}>
				<AriaCheckboxGroup
					{...props}
					style={{
						gridTemplateColumns:
							columns ?? "repeat(auto-fit, minmax(200px, 1fr))",
						...style,
					}}
					className={composeRenderProps(className, cls =>
						checkboxCardsVariants({ size, class: cls }))}
				/>
			</FieldContext>
		</CheckboxCardsContext>
	);
}
