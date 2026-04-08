import * as React from "react";

interface CardProps {
	variant?: "ghost" | "surface";
	size?: number;
	color?: string;
	children: React.ReactNode;
	className?: string;
}

export function Card({ variant = "surface", size = 3, color = "default", children, className = "" }: CardProps) {
	const baseClasses = "card";
	const variantClasses = variant === "ghost" ? "card-ghost" : "card-surface";
	const sizeClasses = `card-size-${size}`;
	const colorClasses = color !== "default" ? `card-color-${color}` : "";

	return (
		<div className={`${baseClasses} ${variantClasses} ${sizeClasses} ${colorClasses} ${className}`}>
			{children}
		</div>
	);
}
