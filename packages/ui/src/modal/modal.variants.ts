import { tv } from "tailwind-variants";
import { tw } from "../utils/tw.ts";

export const modalVariants = tv({
	base: tw(
		"relative w-full max-w-lg",
		"max-h-[90vh] overflow-y-auto outline-none",
		"bg-gray-1 shadow-xl",
		"motion-safe:transition-[opacity,transform] motion-safe:duration-200",
		"data-entering:opacity-0 data-entering:scale-[0.97] data-entering:translate-y-1.25",
		"data-exiting:opacity-0 data-exiting:scale-[0.99] data-exiting:translate-y-1.25",
		"data-exiting:motion-safe:duration-100",
	),
	variants: {
		size: {
			1: "p-3 rounded-[var(--radius-4)]",
			2: "p-4 rounded-[var(--radius-4)]",
			3: "p-5 rounded-[var(--radius-5)]",
			4: "p-6 rounded-[var(--radius-5)]",
		},
	},
	defaultVariants: { size: 3 },
});
