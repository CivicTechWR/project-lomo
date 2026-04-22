"use client";

import type { ReactNode } from "react";
import type {
	CeremonyRequestDetails,
	FoodKindId,
	FoodRequestDetails,
	ItemsRequestDetails,
	MicrograntRequestDetails,
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
	useState,
} from "react";
import { emptyDraft } from "@/lib/request-flow/types";

type RequestDraftContextValue = {
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
	resetDraft: () => void;
};

const RequestDraftContext = createContext<RequestDraftContextValue | null>(
	null,
);

export function RequestDraftProvider({ children }: { children: ReactNode }) {
	const [draft, setDraft] = useState<RequestDraft>(emptyDraft);

	const setCategory = useCallback((id: RequestCategoryId | null) => {
		setDraft(prev => ({ ...prev, category: id }));
	}, []);

	const setFoodKind = useCallback((kind: FoodKindId | null) => {
		setDraft(prev => ({ ...prev, foodKind: kind }));
	}, []);

	const setFoodDetails = useCallback((patch: Partial<FoodRequestDetails>) => {
		setDraft(prev => ({
			...prev,
			foodDetails: { ...prev.foodDetails, ...patch },
		}));
	}, []);

	const setFoodDetailsAll = useCallback((details: FoodRequestDetails) => {
		setDraft(prev => ({ ...prev, foodDetails: { ...details } }));
	}, []);

	const setItemsDetails = useCallback((patch: Partial<ItemsRequestDetails>) => {
		setDraft(prev => ({
			...prev,
			itemsDetails: { ...prev.itemsDetails, ...patch },
		}));
	}, []);

	const setItemsDetailsAll = useCallback((details: ItemsRequestDetails) => {
		setDraft(prev => ({ ...prev, itemsDetails: { ...details } }));
	}, []);

	const setOtherDetails = useCallback((patch: Partial<OtherRequestDetails>) => {
		setDraft(prev => ({
			...prev,
			otherDetails: { ...prev.otherDetails, ...patch },
		}));
	}, []);

	const setOtherDetailsAll = useCallback((details: OtherRequestDetails) => {
		setDraft(prev => ({ ...prev, otherDetails: { ...details } }));
	}, []);

	const setPublicWalkDetails = useCallback((patch: Partial<PublicWalkRequestDetails>) => {
		setDraft(prev => ({
			...prev,
			publicWalkDetails: { ...prev.publicWalkDetails, ...patch },
		}));
	}, []);

	const setPublicWalkDetailsAll = useCallback((details: PublicWalkRequestDetails) => {
		setDraft(prev => ({ ...prev, publicWalkDetails: { ...details } }));
	}, []);

	const setMicrograntDetails = useCallback((patch: Partial<MicrograntRequestDetails>) => {
		setDraft(prev => ({
			...prev,
			micrograntDetails: { ...prev.micrograntDetails, ...patch },
		}));
	}, []);

	const setMicrograntDetailsAll = useCallback((details: MicrograntRequestDetails) => {
		setDraft(prev => ({ ...prev, micrograntDetails: { ...details } }));
	}, []);

	const setCeremonyDetails = useCallback((patch: Partial<CeremonyRequestDetails>) => {
		setDraft(prev => ({
			...prev,
			ceremonyDetails: { ...prev.ceremonyDetails, ...patch },
		}));
	}, []);

	const setCeremonyDetailsAll = useCallback((details: CeremonyRequestDetails) => {
		setDraft(prev => ({ ...prev, ceremonyDetails: { ...details } }));
	}, []);

	const setUrgency = useCallback((urgency: RequestUrgencyId | null) => {
		setDraft(prev => ({ ...prev, urgency }));
	}, []);

	const resetDraft = useCallback(() => {
		setDraft(emptyDraft());
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
			resetDraft,
		],
	);

	return (
		<RequestDraftContext.Provider value={value}>
			{children}
		</RequestDraftContext.Provider>
	);
}

export function useRequestDraft(): RequestDraftContextValue {
	const ctx = use(RequestDraftContext);
	if (!ctx) {
		throw new Error("useRequestDraft must be used within RequestDraftProvider");
	}
	return ctx;
}
