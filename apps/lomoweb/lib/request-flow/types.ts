/**
 * Shared types for the multi-step help request flow.
 * Category-specific steps live under `app/app/request/[category]/`.
 *
 * ## The two kinds of "when"
 *
 * Timing is captured twice, on purpose, and the two are not redundant:
 *
 * 1. `RequestDraft.neededBy` — a machine-readable deadline shared by every
 *    category. Indexed on the backend so requests can be sorted, filtered, and
 *    checked by the admin deadline alert.
 *
 * 2. `whenText` / `needByText` / `preferredTime` — free prose, per category.
 *    These are intentionally NOT date inputs. Their placeholders invite answers a
 *    date value cannot hold: "flexible this week" is an availability window, and
 *    "Saturday at dawn" is a shifting reference point that pinning to a clock
 *    time would misrepresent. Replacing them with a picker would force people
 *    with no fixed time to invent one, producing data that looks structured but
 *    is fabricated.
 *
 * So: automate against `neededBy`, show `*Text` to the human reading the
 * request. Please don't "fix" the prose fields by turning them into pickers.
 */

export type RequestCategoryId
	= | "food"
		| "items"
		| "other"
		| "support"
		| "paperwork"
		| "ceremony";

export type FoodKindId = "meal" | "groceries";

/** Grocery sub-types (groceries flow only). */
export type GroceryTypeId = "fresh" | "frozen" | "shelf_stable" | "snacks";

export type RequestUrgencyId = "when_possible" | "few_days" | "urgent";

export interface FoodRequestDetails {
	/** When true, specific `groceryTypes` are ignored for intent ("any"). */
	groceryNoPreference: boolean;
	groceryTypes: GroceryTypeId[];
	helpfulNote: string;
	allergies: string;
	dietary: string;
	peopleCount: string;
	needsDelivery: boolean;
	address: string;
	/** Set when the requester picks an address from autocomplete. */
	addressLat?: number;
	addressLng?: number;
	deliveryInstructions: string;
}

export function emptyFoodDetails(): FoodRequestDetails {
	return {
		groceryNoPreference: false,
		groceryTypes: [],
		helpfulNote: "",
		allergies: "",
		dietary: "",
		peopleCount: "",
		needsDelivery: false,
		address: "",
		addressLat: undefined,
		addressLng: undefined,
		deliveryInstructions: "",
	};
}

export interface ItemsRequestDetails {
	itemDescription: string;
	sizeOrStyle: string;
	needsDelivery: boolean;
	address: string;
	/** Set when the requester picks an address from autocomplete. */
	addressLat?: number;
	addressLng?: number;
	deliveryInstructions: string;
}

export function emptyItemsDetails(): ItemsRequestDetails {
	return {
		itemDescription: "",
		sizeOrStyle: "",
		needsDelivery: false,
		address: "",
		addressLat: undefined,
		addressLng: undefined,
		deliveryInstructions: "",
	};
}

/** Custom / miscellaneous help (replaces deprecated ride flow in the UI). */
export interface OtherRequestDetails {
	whatNeed: string;
	whenText: string;
	location: string;
}

export function emptyOtherDetails(): OtherRequestDetails {
	return {
		whatNeed: "",
		whenText: "",
		location: "",
	};
}

export type PublicWalkLengthId = "10_15" | "20_30" | "45_60";
export type PublicWalkTypeId
	= | "slow_scenic"
		| "conversational"
		| "quiet_presence"
		| "grounding"
		| "not_sure_yet";

export interface PublicWalkRequestDetails {
	preferredTime: string;
	walkLength: PublicWalkLengthId | null;
	location: string;
	walkTypes: PublicWalkTypeId[];
}

export function emptyPublicWalkDetails(): PublicWalkRequestDetails {
	return {
		preferredTime: "",
		walkLength: null,
		location: "",
		walkTypes: [],
	};
}

export type MicrograntNeedId
	= | "education_career"
		| "food_groceries"
		| "transportation"
		| "medication_health"
		| "phone_internet"
		| "utilities_bills"
		| "clothing_essentials"
		| "something_else";
export type MicrograntAmountId = "under_25" | "25_50" | "50_100" | "100_plus";

export interface MicrograntRequestDetails {
	needType: MicrograntNeedId | null;
	needOtherText: string;
	amountRange: MicrograntAmountId | null;
	amountOver100Text: string;
	needByText: string;
	optionalDetails: string;
	methods: Array<"e_transfer" | "gift_card" | "other">;
	otherMethodText: string;
	etransferContact: string;
	etransferPassword: string;
	giftCardEmail: string;
	giftCardType: string;
	otherTransferDetails: string;
}

export function emptyMicrograntDetails(): MicrograntRequestDetails {
	return {
		needType: null,
		needOtherText: "",
		amountRange: null,
		amountOver100Text: "",
		needByText: "",
		optionalDetails: "",
		methods: [],
		otherMethodText: "",
		etransferContact: "",
		etransferPassword: "",
		giftCardEmail: "",
		giftCardType: "",
		otherTransferDetails: "",
	};
}

export type CeremonyRoleId = "firekeeping" | "ceremony_support";

export interface CeremonyRequestDetails {
	role: CeremonyRoleId | null;
	whatNeed: string;
	ceremonyType: string;
	durationApprox: string;
	helperNotes: string;
	whenText: string;
	locationAddress: string;
	locationDirections: string;
}

export function emptyCeremonyDetails(): CeremonyRequestDetails {
	return {
		role: null,
		whatNeed: "",
		ceremonyType: "",
		durationApprox: "",
		helperNotes: "",
		whenText: "",
		locationAddress: "",
		locationDirections: "",
	};
}

/**
 * Which control produced a deadline, kept so the picker can restore its own
 * selection when the requester navigates back to the step.
 */
export type NeededByPresetId
	= | "today"
		| "tomorrow"
		| "this_week"
		| "next_week"
		| "exact";

/**
 * When help stops being useful.
 *
 * Deliberately a *deadline* rather than a preferred appointment. A requester who
 * answers "sometime this week" has no fixed time but does have a last useful
 * moment, so a window can be recorded without forcing them to invent a precise
 * slot. This is the value the admin deadline alert compares against, and it is
 * denormalized onto `helpRequests.neededBy` so it can be indexed.
 *
 * Separate from the free-text "when" fields, which stay prose — see the note on
 * those fields below.
 */
export interface NeededBy {
	/** Milliseconds since epoch — the latest moment the help still helps. */
	at: number;
	/** True when `at` came from a window ("this week"), not an exact date. */
	flexible: boolean;
	/** The control that produced `at`. */
	preset: NeededByPresetId;
}

export interface RequestDraft {
	category: RequestCategoryId | null;
	foodKind: FoodKindId | null;
	foodDetails: FoodRequestDetails;
	itemsDetails: ItemsRequestDetails;
	otherDetails: OtherRequestDetails;
	publicWalkDetails: PublicWalkRequestDetails;
	micrograntDetails: MicrograntRequestDetails;
	ceremonyDetails: CeremonyRequestDetails;
	urgency: RequestUrgencyId | null;
	/**
	 * Shared across every category. `null` means the requester chose "no fixed
	 * date", which is a valid answer — those requests are never deadline-urgent.
	 */
	neededBy: NeededBy | null;
}

export function emptyDraft(): RequestDraft {
	return {
		category: null,
		foodKind: null,
		foodDetails: emptyFoodDetails(),
		itemsDetails: emptyItemsDetails(),
		otherDetails: emptyOtherDetails(),
		publicWalkDetails: emptyPublicWalkDetails(),
		micrograntDetails: emptyMicrograntDetails(),
		ceremonyDetails: emptyCeremonyDetails(),
		urgency: null,
		neededBy: null,
	};
}
