import type { IconName } from "./icon-registry.ts";
import { config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "../utils/cn.ts";
import { tw } from "../utils/tw.ts";
import { iconRegistry } from "./icon-registry.ts";

/*
 * Font Awesome injects its own <style> block the first time an icon renders.
 * Under the App Router that stylesheet is not part of the CSS pipeline, so the
 * first paint shows oversized icons until the tag lands. We opt out and instead
 * reproduce the handful of rules that matter (`FA_LAYOUT`) as Tailwind classes,
 * which also means the app never has to import CSS out of node_modules.
 */
config.autoAddCss = false;

/**
 * The layout rules `.svg-inline--fa` would otherwise supply. `overflow-visible`
 * keeps glyphs that bleed past the viewBox from clipping, and the negative
 * baseline shift centres an icon against adjacent text.
 */
const FA_LAYOUT = tw("inline-block shrink-0 overflow-visible align-[-0.125em]");

export interface IconProps {
	/** Semantic name from the design system's registry. */
	name: IconName;
	/**
	 * Sizing and colour. Defaults to `size-4`; pass a `size-*` class to override.
	 * Colour is inherited from the parent via `currentColor`.
	 */
	className?: string;
	/**
	 * Accessible name. Omit for decorative icons that sit beside a text label —
	 * the icon is then hidden from assistive tech so the label isn't read twice.
	 */
	label?: string;
}

/**
 * Renders a registry icon at a fixed size, inheriting colour from its parent.
 *
 * Decorative by default. Supply `label` only when the icon is the sole carrier
 * of meaning, such as an icon-only button.
 */
export function Icon({ name, className, label }: IconProps) {
	return (
		<FontAwesomeIcon
			icon={iconRegistry[name]}
			className={cn(FA_LAYOUT, "size-4", className)}
			/*
			 * The name is applied via `aria-label` rather than react-fontawesome's
			 * `title` prop: as of v3 that prop renders no <title> element, which would
			 * leave the icon with `role="img"` and no accessible name at all.
			 */
			aria-label={label}
			// Omitted rather than set to "false" when labelled: `aria-hidden="false"`
			// is redundant and some screen readers treat it inconsistently.
			aria-hidden={label === undefined ? true : undefined}
		/>
	);
}
