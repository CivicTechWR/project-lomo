import { tw } from "@repo/ui/utils";

/** Section eyebrow label (e.g., "🤝 Mutual Aid In Action") */
export const sectionLabel = tw(
	"text-terracotta-11 font-display font-black text-sm tracking-widest uppercase select-none",
);

/** Default card/image container shadow + border */
export const cardSurface = tw(
	"border-2 border-black rounded-5 shadow-brand",
);

/** Responsive section spacing — consistent padding across all homepage sections */
export const sectionPadding = tw(
	"px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-24",
);

/** Touch target minimum size — ensures 44px hit area for mobile accessibility */
export const touchTarget = tw("min-h-11 min-w-11");

/** CTA button — terracotta solid pill */
export const ctaButton = tw(
	"bg-terracotta-9 hover:bg-terracotta-10 text-white border-2 border-black rounded-full px-8 py-3.5 min-h-11 font-display font-black text-base shadow-brand hover:shadow-brand-hover active:shadow-brand-active transition-shadow duration-150",
);

/** Secondary/outline button style */
export const secondaryButton = tw(
	"bg-white hover:bg-gray-2 text-black border-2 border-black rounded-full px-8 py-3.5 font-display font-black text-base shadow-brand hover:shadow-brand-hover active:shadow-brand-active transition-shadow duration-150",
);

/** Responsive H1 override — use in className to scale the Heading component's fixed size prop */
export const headingH1 = tw("text-3xl sm:text-4xl lg:text-5xl");

/** Responsive H2 override — use in className to scale the Heading component's fixed size prop */
export const headingH2 = tw("text-2xl sm:text-3xl lg:text-4xl");

/** Info badge — white pill with black border, used for feature callouts in content sections */
export const infoBadge = tw(
	"px-3.5 py-1.5 rounded-full border-2 border-black font-display font-bold text-xs bg-white text-black select-none",
);

/** Grayscale-to-color image effect — applies to next/image className */
export const grayscaleImage = tw(
	"object-cover object-center grayscale hover:grayscale-0 transition-all duration-500",
);

/** Warm tint overlay — sits absolutely over an image container */
export const warmOverlay = tw(
	"absolute inset-0 bg-terracotta-9/5 mix-blend-multiply pointer-events-none",
);
