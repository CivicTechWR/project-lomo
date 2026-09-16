import type { Id } from "@repo/convex-backend/convex/_generated/dataModel";
import type { HelpRequestStatus } from "@/lib/help-request-status";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export function useHomeDashboard() {
	return useQuery(api.helpRequests.homeDashboard, {});
}

export function useMyRequests(statusFilter?: HelpRequestStatus) {
	return useQuery(api.helpRequests.listMine, { statusFilter });
}

export function usePendingRequestsFromOthers(filterArea?: {
	filterCenterLat?: number;
	filterCenterLng?: number;
	filterRadiusKm?: number;
}) {
	return useQuery(api.helpRequests.listPendingFromOthers, filterArea ?? {});
}

export function useRequestDetail(requestId: Id<"helpRequests">) {
	return useQuery(api.helpRequests.get, { requestId });
}

export function useRequestDetailAsHelper(requestId: Id<"helpRequests">) {
	return useQuery(api.helpRequests.getAsHelper, { requestId });
}

export function useOfferHelperPreview(requestId: Id<"helpRequests">) {
	return useQuery(api.helpRequests.getOfferHelperPreview, { requestId });
}

export function useIsAdmin() {
	return useQuery(api.helpRequests.isAdmin, {});
}

export function useCreateRequest() {
	return useMutation(api.helpRequests.create);
}

export function useAcceptAssignedRequest() {
	return useMutation(api.helpRequests.accept);
}

export function useVolunteerOfferHelp() {
	return useMutation(api.helpRequests.volunteerOfferHelp);
}

export function useDeclineAssignedRequest() {
	return useMutation(api.helpRequests.declineAssigned);
}

export function useRequesterAcceptMatch() {
	return useMutation(api.helpRequests.requesterAcceptMatch);
}

export function useRequesterDeclineMatch() {
	return useMutation(api.helpRequests.requesterDeclineMatch);
}

export function useWithdrawOffer() {
	return useMutation(api.helpRequests.withdrawOffer);
}

export function useCancelRequest() {
	return useMutation(api.helpRequests.cancel);
}

export function useMarkRequestComplete() {
	return useMutation(api.helpRequests.markComplete);
}
