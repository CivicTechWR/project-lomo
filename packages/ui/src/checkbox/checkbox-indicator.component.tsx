import type { VariantProps } from "tailwind-variants";
import { useFieldContext } from "../field/index.ts";
import { checkboxIndicatorVariants } from "./checkbox-indicator.variants.ts";
import { CHECKBOX_DEFAULTS } from "./checkbox.context.ts";

export interface CheckboxIndicatorProps {
	variant?: VariantProps<typeof checkboxIndicatorVariants>["variant"];
	size?: VariantProps<typeof checkboxIndicatorVariants>["size"];
	color?: VariantProps<typeof checkboxIndicatorVariants>["color"];
	className?: string;
}

export function CheckboxIndicator({
	variant,
	size,
	color,
	className,
}: CheckboxIndicatorProps) {
	const ctx = useFieldContext();
	const ctxVariant = ctx.variant === "surface" || ctx.variant === "classic" ? ctx.variant : "surface";
	const v = variant ?? ctxVariant;
	const s = size ?? ctx.size ?? CHECKBOX_DEFAULTS.size;
	const c = color ?? ctx.color ?? CHECKBOX_DEFAULTS.color;

	return (
		<span
			aria-hidden="true"
			className={checkboxIndicatorVariants({
				variant: v,
				size: s,
				color: c,
				class: className,
			})}
		>
			<svg
				className="hidden group-data-selected:block group-data-indeterminate:block"
				width="9"
				height="9"
				viewBox="0 0 9 9"
				fill="currentcolor"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					className="group-data-indeterminate:hidden"
					fillRule="evenodd"
					clipRule="evenodd"
					d="M8.53547 0.62293C8.88226 0.849446 8.97976 1.3142 8.75325 1.66099L4.5083 8.1599C4.38833 8.34356 4.19397 8.4655 3.9764 8.49358C3.75883 8.52167 3.53987 8.45309 3.3772 8.30591L0.616113 5.80777C0.308959 5.52987 0.285246 5.05559 0.563148 4.74844C0.84105 4.44128 1.31533 4.41757 1.62249 4.69547L3.73256 6.60459L7.49741 0.840706C7.72393 0.493916 8.18868 0.396414 8.53547 0.62293Z"
				/>
				<path
					className="hidden group-data-indeterminate:block"
					fillRule="evenodd"
					clipRule="evenodd"
					d="M0.75 4.5C0.75 4.08579 1.08579 3.75 1.5 3.75H7.5C7.91421 3.75 8.25 4.08579 8.25 4.5C8.25 4.91421 7.91421 5.25 7.5 5.25H1.5C1.08579 5.25 0.75 4.91421 0.75 4.5Z"
				/>
			</svg>
		</span>
	);
}
