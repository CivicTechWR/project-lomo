import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
	faArrowLeft,
	faArrowRightFromBracket,
	faBell,
	faCalendarDays,
	faChevronDown,
	faChevronLeft,
	faChevronRight,
	faCircleExclamation,
	faClipboardList,
	faFileLines,
	faFilter,
	faGear,
	faHandshakeAngle,
	faHouse,
	faLocationDot,
	faMagnifyingGlass,
	faShieldHalved,
	faTableCellsLarge,
	faUser,
	faUsers,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Maps LoMo's semantic icon names onto Font Awesome glyphs.
 *
 * Call sites name the *meaning* ("openRequests") rather than the glyph
 * ("faHandshakeAngle"), so re-picking an icon — or moving off Font Awesome
 * entirely — is a change to this file alone. It also stops the same concept
 * being drawn two different ways in two different screens, which is what
 * happened when every component hand-rolled its own inline SVG.
 */
export const iconRegistry = {
	// ── Primary navigation ──
	home: faHouse,
	myRequests: faClipboardList,
	openRequests: faHandshakeAngle,
	notifications: faBell,
	profile: faUser,
	signOut: faArrowRightFromBracket,

	// ── Admin navigation ──
	admin: faShieldHalved,
	dashboard: faTableCellsLarge,
	adminRequests: faFileLines,
	users: faUsers,
	settings: faGear,

	// ── Controls ──
	back: faArrowLeft,
	close: faXmark,
	search: faMagnifyingGlass,
	filter: faFilter,
	calendar: faCalendarDays,
	chevronDown: faChevronDown,
	chevronLeft: faChevronLeft,
	chevronRight: faChevronRight,

	// ── Status ──
	alert: faCircleExclamation,
	mapPin: faLocationDot,
} as const satisfies Record<string, IconDefinition>;

/** Every icon the design system exposes. */
export type IconName = keyof typeof iconRegistry;
