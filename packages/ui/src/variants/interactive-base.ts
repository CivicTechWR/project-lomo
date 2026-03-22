import { tw } from "../utils/tw.ts";

export const interactiveBase = tw(
	"inline-flex items-center justify-center",
	"font-medium cursor-default select-none",
	"transition-colors duration-150 outline-none",
	"data-disabled:opacity-50 data-disabled:cursor-not-allowed",
);
