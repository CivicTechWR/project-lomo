import type { ReactNode } from "react";
import type { CheckboxProps as AriaCheckboxProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { Checkbox as AriaCheckbox, composeRenderProps } from "react-aria-components";
import { FieldContext } from "../field/index.ts";
import { checkboxIndicatorVariants } from "./checkbox-indicator.variants.ts";
import { CHECKBOX_DEFAULTS, useCheckboxGroupStyleContext } from "./checkbox.context.ts";
import { checkboxVariants } from "./checkbox.variants.ts";

export type CheckboxProps = Omit<AriaCheckboxProps, "children">
	& VariantProps<typeof checkboxVariants> & {
		children?: ReactNode;
	};

function CheckSVG() {
	return (
		<svg
			width="9"
			height="9"
			viewBox="0 0 9 9"
			fill="currentcolor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8.53547 0.62293C8.88226 0.849446 8.97976 1.3142 8.75325 1.66099L4.5083 8.1599C4.38833 8.34356 4.19397 8.4655 3.9764 8.49358C3.75883 8.52167 3.53987 8.45309 3.3772 8.30591L0.616113 5.80777C0.308959 5.52987 0.285246 5.05559 0.563148 4.74844C0.84105 4.44128 1.31533 4.41757 1.62249 4.69547L3.73256 6.60459L7.49741 0.840706C7.72393 0.493916 8.18868 0.396414 8.53547 0.62293Z"
			/>
		</svg>
	);
}

function DashSVG() {
	return (
		<svg
			width="9"
			height="9"
			viewBox="0 0 9 9"
			fill="currentcolor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0.75 4.5C0.75 4.08579 1.08579 3.75 1.5 3.75H7.5C7.91421 3.75 8.25 4.08579 8.25 4.5C8.25 4.91421 7.91421 5.25 7.5 5.25H1.5C1.08579 5.25 0.75 4.91421 0.75 4.5Z"
			/>
		</svg>
	);
}

export function Checkbox({
	variant,
	size,
	color,
	className,
	children,
	...props
}: CheckboxProps) {
	const groupCtx = useCheckboxGroupStyleContext();
	const v = variant ?? groupCtx?.variant ?? CHECKBOX_DEFAULTS.variant;
	const s = size ?? groupCtx?.size ?? CHECKBOX_DEFAULTS.size;
	const c = color ?? groupCtx?.color ?? CHECKBOX_DEFAULTS.color;

	return (
		<FieldContext value={{ variant: v, size: s, color: c }}>
			<AriaCheckbox
				{...props}
				className={composeRenderProps(className, cls =>
					checkboxVariants({ variant: v, size: s, color: c, class: cls }))}
			>
				{({ isIndeterminate, isSelected }) => (
					<>
						<span
							aria-hidden="true"
							className={checkboxIndicatorVariants({ variant: v, size: s, color: c })}
						>
							{isIndeterminate
								? <DashSVG />
								: isSelected ? <CheckSVG /> : null}
						</span>
						{children}
					</>
				)}
			</AriaCheckbox>
		</FieldContext>
	);
}
