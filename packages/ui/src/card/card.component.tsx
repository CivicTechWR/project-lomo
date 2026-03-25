import type { ComponentPropsWithRef } from "react";
import type { CardColor, CardSize, CardVariant } from "./card.variants.ts";
import { cardVariants } from "./card.variants.ts";

export interface CardProps extends ComponentPropsWithRef<"div"> {
	variant?: CardVariant;
	size?: CardSize;
	color?: CardColor;
}

export function Card({ variant, size, color, className, ...props }: CardProps) {
	return (
		<div
			{...props}
			className={cardVariants({ variant, size, color, class: className })}
		/>
	);
}
