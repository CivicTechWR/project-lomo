/**
 * Shared types for the multi-step help request flow.
 * Category-specific steps live under `app/app/request/[category]/`.
 */

export type RequestCategoryId =
	| "food"
	| "items"
	| "ride"
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
	deliveryInstructions: string;
}

export const emptyFoodDetails = (): FoodRequestDetails => ({
	groceryNoPreference: false,
	groceryTypes: [],
	helpfulNote: "",
	allergies: "",
	dietary: "",
	peopleCount: "",
	needsDelivery: false,
	address: "",
	deliveryInstructions: "",
});

export interface ItemsRequestDetails {
	itemDescription: string;
	sizeOrStyle: string;
	needsDelivery: boolean;
	address: string;
	deliveryInstructions: string;
}

export const emptyItemsDetails = (): ItemsRequestDetails => ({
	itemDescription: "",
	sizeOrStyle: "",
	needsDelivery: false,
	address: "",
	deliveryInstructions: "",
});

export interface RideRequestDetails {
	pickupLocation: string;
	dropoffLocation: string;
	needsReturnRide: boolean;
	whenText: string;
	accessibilityNeeded: boolean;
	accessibilityAccommodation: string;
}

export const emptyRideDetails = (): RideRequestDetails => ({
	pickupLocation: "",
	dropoffLocation: "",
	needsReturnRide: false,
	whenText: "",
	accessibilityNeeded: false,
	accessibilityAccommodation: "",
});

export type PublicWalkLengthId = "10_15" | "20_30" | "45_60";
export type PublicWalkTypeId =
	| "slow_scenic"
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

export const emptyPublicWalkDetails = (): PublicWalkRequestDetails => ({
	preferredTime: "",
	walkLength: null,
	location: "",
	walkTypes: [],
});

export type MicrograntNeedId =
	| "education_career"
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

export const emptyMicrograntDetails = (): MicrograntRequestDetails => ({
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
});

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

export const emptyCeremonyDetails = (): CeremonyRequestDetails => ({
	role: null,
	whatNeed: "",
	ceremonyType: "",
	durationApprox: "",
	helperNotes: "",
	whenText: "",
	locationAddress: "",
	locationDirections: "",
});

export interface RequestDraft {
	category: RequestCategoryId | null;
	foodKind: FoodKindId | null;
	foodDetails: FoodRequestDetails;
	itemsDetails: ItemsRequestDetails;
	rideDetails: RideRequestDetails;
	publicWalkDetails: PublicWalkRequestDetails;
	micrograntDetails: MicrograntRequestDetails;
	ceremonyDetails: CeremonyRequestDetails;
	urgency: RequestUrgencyId | null;
}

export const emptyDraft = (): RequestDraft => ({
	category: null,
	foodKind: null,
	foodDetails: emptyFoodDetails(),
	itemsDetails: emptyItemsDetails(),
	rideDetails: emptyRideDetails(),
	publicWalkDetails: emptyPublicWalkDetails(),
	micrograntDetails: emptyMicrograntDetails(),
	ceremonyDetails: emptyCeremonyDetails(),
	urgency: null,
});
