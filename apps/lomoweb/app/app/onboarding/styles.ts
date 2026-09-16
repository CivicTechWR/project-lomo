import { tw } from "@repo/ui/utils";

/**
 * Shared styles for the onboarding wizard.
 *
 * Colours are taken from the Figma prototype ("LOMO — Prototype", `Onboarding-*`
 * frames) and mapped onto the tokens the homepage already uses:
 *
 * | Figma             | Token           | Note              |
 * | ----------------- | --------------- | ----------------- |
 * | `#F5EFE8` page    | `surface-warm`  | exact             |
 * | `#4A352F` ink     | `terracotta-9`  | exact             |
 * | `#F3C600` primary | `yellow-10`     | `#f2c500`         |
 * | `#FFFFFF` input   | `white`         | exact             |
 * | `#000000` text    | `black`         | exact             |
 *
 * The root layout sets `data-radius="full"` for the whole document, which
 * resolves `--radius-2` to 10px and `max(--radius-3, --radius-full)` to a pill.
 * That reproduces Figma's 10px inputs and 90px buttons through tokens instead
 * of hardcoded radii.
 */

/** Ink outline used on every onboarding control (Figma stroke `#4A352F`). */
export const inkBorder = tw("border-terracotta-9");

/** Step heading — centred, 32px (`--text-8`), matching the Figma frames. */
export const stepHeading = tw("text-center font-display text-black");

/** Body copy under a step heading. */
export const stepBody = tw("text-black/80");

/** Field label — 16px semibold ink, heavier than the design-system default. */
export const fieldLabel = tw("text-base font-semibold text-black");

/** Helper line between a field label and its input (Figma "Optional"). */
export const fieldHint = tw("text-black/70");

/**
 * Input shell — white fill with a 1px ink outline at 10px radius.
 *
 * Rendered as an inset shadow rather than a border so the design system's
 * invalid/error shadow states still layer on top.
 */
export const fieldGroup = tw(
	"min-h-11 bg-white",
	"shadow-[inset_0_0_0_1px_var(--color-terracotta-9)]",
	"data-hovered:shadow-[inset_0_0_0_1px_var(--color-terracotta-9)]",
);

/** Progress segment — 16px pill with a 4px ink outline. */
export const progressSegment = tw(
	"h-4 min-h-4 flex-1 rounded-full border-4 border-terracotta-9",
	"shadow-brand-strong",
);

/** Progress segment, completed. */
export const progressSegmentFilled = tw("bg-yellow-10");

/** Progress segment, still ahead. */
export const progressSegmentEmpty = tw("bg-terracotta-9");

/** Shared geometry for both footer actions — 52px tall, full-width pill. */
const stepButton = tw(
	"h-13 min-w-0 flex-1 text-xl text-black",
	"shadow-brand",
);

/** Footer "Back" action — warm fill. */
export const stepButtonSecondary = tw(
	stepButton,
	"bg-surface-warm data-hovered:bg-terracotta-3 data-pressed:bg-terracotta-4",
);

/** Footer "Continue"/"Finish" action — yellow fill. */
export const stepButtonPrimary = tw(
	stepButton,
	"bg-yellow-10 data-hovered:bg-yellow-9 data-pressed:bg-yellow-9",
);
