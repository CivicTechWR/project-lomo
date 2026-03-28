import { tv } from "tailwind-variants";
import { tw } from "../utils/tw.ts";

export const modalOverlayVariants = tv({
	base: tw(
		"fixed inset-0 z-50 grid place-items-center overflow-y-auto",
		"p-4 pt-6 pb-[max(1.5rem,6vh)]",
		"bg-[var(--color-overlay)]",
		"motion-safe:transition-opacity motion-safe:duration-200",
		"data-entering:opacity-0",
		"data-exiting:opacity-0 data-exiting:motion-safe:duration-150",
	),
});
