import { tw } from "@repo/ui/utils";

/** Section eyebrow label (e.g., "🤝 Mutual Aid In Action") */
export const sectionLabel = tw(
	"text-terracotta-11 font-display font-black text-sm tracking-widest uppercase select-none",
);

/** Default card/image container shadow + border */
export const cardSurface = tw(
	"border-2 border-black rounded-5 shadow-[0px_2px_8px_rgba(0,0,0,0.10)]",
);

/** CTA button — terracotta solid pill */
export const ctaButton = tw(
	"bg-terracotta-9 hover:bg-terracotta-10 text-white border-2 border-black rounded-full px-8 py-3.5 font-display font-black text-base shadow-[0px_2px_8px_rgba(0,0,0,0.10)] hover:shadow-[0px_4px_12px_rgba(0,0,0,0.15)] active:shadow-[0px_1px_4px_rgba(0,0,0,0.10)] transition-shadow duration-150",
);

/** Secondary/outline button style */
export const secondaryButton = tw(
	"bg-white hover:bg-gray-2 text-black border-2 border-black rounded-full px-8 py-3.5 font-display font-black text-base shadow-[0px_2px_8px_rgba(0,0,0,0.10)] hover:shadow-[0px_4px_12px_rgba(0,0,0,0.15)] active:shadow-[0px_1px_4px_rgba(0,0,0,0.10)] transition-shadow duration-150",
);
