"use client";

import type { ReactNode } from "react";
import type {
	CeremonyRequestDetails,
	FoodKindId,
	FoodRequestDetails,
	ItemsRequestDetails,
	MicrograntRequestDetails,
	NeededBy,
	OtherRequestDetails,
	PublicWalkRequestDetails,
	RequestCategoryId,
	RequestDraft,
	RequestUrgencyId,
} from "@/lib/request-flow/types";
import {
	createContext,
	use,
	useCallback,
	useMemo,
	useReducer,
} from "react";
import { emptyDraft } from "@/lib/request-flow/types";

export type RequestDraftAction
	= | { type: "setCategory"; id: RequestCategoryId | null }
		| { type: "setFoodKind"; kind: FoodKindId | null }
		| { type: "setFoodDetails"; patch: Partial<FoodRequestDetails> }
		| { type: "setFoodDetailsAll"; details: FoodRequestDetails }
		| { type: "setItemsDetails"; patch: Partial<ItemsRequestDetails> }
		| { type: "setItemsDetailsAll"; details: ItemsRequestDetails }
		| { type: "setOtherDetails"; patch: Partial<OtherRequestDetails> }
		| { type: "setOtherDetailsAll"; details: OtherRequestDetails }
		| { type: "setPublicWalkDetails"; patch: Partial<PublicWalkRequestDetails> }
		| { type: "setPublicWalkDetailsAll"; details: PublicWalkRequestDetails }
		| { type: "setMicrograntDetails"; patch: Partial<MicrograntRequestDetails> }
		| { type: "setMicrograntDetailsAll"; details: MicrograntRequestDetails }
		| { type: "setCeremonyDetails"; patch: Partial<CeremonyRequestDetails> }
		| { type: "setCeremonyDetailsAll"; details: CeremonyRequestDetails }
		| { type: "setUrgency"; urgency: RequestUrgencyId | null }
		| { type: "setNeededBy"; neededBy: NeededBy | null }
		| { type: "reset" };

export function requestDraftReducer(
	draft: RequestDraft,
	action: RequestDraftAction,
): RequestDraft {
	switch (action.type) {
		case "setCategory":
			return { ...draft, category: action.id };
		case "setFoodKind":
			return { ...draft, foodKind: action.kind };
		case "setFoodDetails":
			return {
				...draft,
				foodDetails: { ...draft.foodDetails, ...action.patch },
			};
		case "setFoodDetailsAll":
			return { ...draft, foodDetails: { ...action.details } };
		case "setItemsDetails":
			return {
				...draft,
				itemsDetails: { ...draft.itemsDetails, ...action.patch },
			};
		case "setItemsDetailsAll":
			return { ...draft, itemsDetails: { ...action.details } };
		case "setOtherDetails":
			return {
				...draft,
				otherDetails: { ...draft.otherDetails, ...action.patch },
			};
		case "setOtherDetailsAll":
			return { ...draft, otherDetails: { ...action.details } };
		case "setPublicWalkDetails":
			return {
				...draft,
				publicWalkDetails: { ...draft.publicWalkDetails, ...action.patch },
			};
		case "setPublicWalkDetailsAll":
			return { ...draft, publicWalkDetails: { ...action.details } };
		case "setMicrograntDetails":
			return {
				...draft,
				micrograntDetails: { ...draft.micrograntDetails, ...action.patch },
			};
		case "setMicrograntDetailsAll":
			return { ...draft, micrograntDetails: { ...action.details } };
		case "setCeremonyDetails":
			return {
				...draft,
				ceremonyDetails: { ...draft.ceremonyDetails, ...action.patch },
			};
		case "setCeremonyDetailsAll":
			return { ...draft, ceremonyDetails: { ...action.details } };
		case "setUrgency":
			return { ...draft, urgency: action.urgency };
		case "setNeededBy":
			return { ...draft, neededBy: action.neededBy };
		case "reset":
			return emptyDraft();
		default:
			return draft;
	}
}

interface RequestDraftContextValue {
	draft: RequestDraft;
	setCategory: (id: RequestCategoryId | null) => void;
	setFoodKind: (kind: FoodKindId | null) => void;
	setFoodDetails: (patch: Partial<FoodRequestDetails>) => void;
	setFoodDetailsAll: (details: FoodRequestDetails) => void;
	setItemsDetails: (patch: Partial<ItemsRequestDetails>) => void;
	setItemsDetailsAll: (details: ItemsRequestDetails) => void;
	setOtherDetails: (patch: Partial<OtherRequestDetails>) => void;
	setOtherDetailsAll: (details: OtherRequestDetails) => void;
	setPublicWalkDetails: (patch: Partial<PublicWalkRequestDetails>) => void;
	setPublicWalkDetailsAll: (details: PublicWalkRequestDetails) => void;
	setMicrograntDetails: (patch: Partial<MicrograntRequestDetails>) => void;
	setMicrograntDetailsAll: (details: MicrograntRequestDetails) => void;
	setCeremonyDetails: (patch: Partial<CeremonyRequestDetails>) => void;
	setCeremonyDetailsAll: (details: CeremonyRequestDetails) => void;
	setUrgency: (urgency: RequestUrgencyId | null) => void;
	/** `null` records "no fixed date", which is a valid answer. */
	setNeededBy: (neededBy: NeededBy | null) => void;
	resetDraft: () => void;
}

const RequestDraftContext = createContext<RequestDraftContextValue | null>(
	null,
);

export function RequestDraftProvider({ children }: { children: ReactNode }) {
	const [draft, dispatch] = useReducer(requestDraftReducer, emptyDraft());

	const setCategory = useCallback((id: RequestCategoryId | null) => {
		dispatch({ type: "setCategory", id });
	}, []);

	const setFoodKind = useCallback((kind: FoodKindId | null) => {
		dispatch({ type: "setFoodKind", kind });
	}, []);

	const setFoodDetails = useCallback((patch: Partial<FoodRequestDetails>) => {
		dispatch({ type: "setFoodDetails", patch });
	}, []);

	const setFoodDetailsAll = useCallback((details: FoodRequestDetails) => {
		dispatch({ type: "setFoodDetailsAll", details });
	}, []);

	const setItemsDetails = useCallback((patch: Partial<ItemsRequestDetails>) => {
		dispatch({ type: "setItemsDetails", patch });
	}, []);

	const setItemsDetailsAll = useCallback((details: ItemsRequestDetails) => {
		dispatch({ type: "setItemsDetailsAll", details });
	}, []);

	const setOtherDetails = useCallback((patch: Partial<OtherRequestDetails>) => {
		dispatch({ type: "setOtherDetails", patch });
	}, []);

	const setOtherDetailsAll = useCallback((details: OtherRequestDetails) => {
		dispatch({ type: "setOtherDetailsAll", details });
	}, []);

	const setPublicWalkDetails = useCallback((patch: Partial<PublicWalkRequestDetails>) => {
		dispatch({ type: "setPublicWalkDetails", patch });
	}, []);

	const setPublicWalkDetailsAll = useCallback((details: PublicWalkRequestDetails) => {
		dispatch({ type: "setPublicWalkDetailsAll", details });
	}, []);

	const setMicrograntDetails = useCallback((patch: Partial<MicrograntRequestDetails>) => {
		dispatch({ type: "setMicrograntDetails", patch });
	}, []);

	const setMicrograntDetailsAll = useCallback((details: MicrograntRequestDetails) => {
		dispatch({ type: "setMicrograntDetailsAll", details });
	}, []);

	const setCeremonyDetails = useCallback((patch: Partial<CeremonyRequestDetails>) => {
		dispatch({ type: "setCeremonyDetails", patch });
	}, []);

	const setCeremonyDetailsAll = useCallback((details: CeremonyRequestDetails) => {
		dispatch({ type: "setCeremonyDetailsAll", details });
	}, []);

	const setUrgency = useCallback((urgency: RequestUrgencyId | null) => {
		dispatch({ type: "setUrgency", urgency });
	}, []);

	const setNeededBy = useCallback((neededBy: NeededBy | null) => {
		dispatch({ type: "setNeededBy", neededBy });
	}, []);

	const resetDraft = useCallback(() => {
		dispatch({ type: "reset" });
	}, []);

	const value = useMemo(
		() =>
			({
				draft,
				setCategory,
				setFoodKind,
				setFoodDetails,
				setFoodDetailsAll,
				setItemsDetails,
				setItemsDetailsAll,
				setOtherDetails,
				setOtherDetailsAll,
				setPublicWalkDetails,
				setPublicWalkDetailsAll,
				setMicrograntDetails,
				setMicrograntDetailsAll,
				setCeremonyDetails,
				setCeremonyDetailsAll,
				setUrgency,
				setNeededBy,
				resetDraft,
			}) satisfies RequestDraftContextValue,
		[
			draft,
			setCategory,
			setFoodKind,
			setFoodDetails,
			setFoodDetailsAll,
			setItemsDetails,
			setItemsDetailsAll,
			setOtherDetails,
			setOtherDetailsAll,
			setPublicWalkDetails,
			setPublicWalkDetailsAll,
			setMicrograntDetails,
			setMicrograntDetailsAll,
			setCeremonyDetails,
			setCeremonyDetailsAll,
			setUrgency,
			setNeededBy,
			resetDraft,
		],
	);

	return (
		<RequestDraftContext value={value}>
			{children}
		</RequestDraftContext>
	);
}

export function useRequestDraft(): RequestDraftContextValue {
	const ctx = use(RequestDraftContext);
	if (!ctx) {
		throw new Error("useRequestDraft must be used within RequestDraftProvider");
	}
	return ctx;
}
