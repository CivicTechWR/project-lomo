import type { Id } from "@repo/convex-backend/convex/_generated/dataModel";
import type { HelpRequestStatus } from "@/lib/help-request-status";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export function useAdminStats() {
	return useQuery(api.adminDashboard.adminStats);
}

export function useAdminAttentionList() {
	return useQuery(api.adminDashboard.adminAttentionList);
}

export function useAdminSettings() {
	return useQuery(api.adminSettings.getSettings);
}

export function useUpdateAdminSettings() {
	return useMutation(api.adminSettings.updateSettings);
}

export function useAdminAllRequests(statusFilter?: HelpRequestStatus) {
	return useQuery(api.helpRequests.listAllForAdmin, { statusFilter });
}

export function useAdminGetRequest(requestId: Id<"helpRequests">) {
	return useQuery(api.helpRequests.adminGetRequest, { requestId });
}

export function useAdminVolunteers() {
	return useQuery(api.helpRequests.listVolunteersForAdmin);
}

export function useAdminAssignVolunteer() {
	return useMutation(api.helpRequests.assignVolunteer);
}

export function useAdminUpdateRequest() {
	return useMutation(api.helpRequests.adminUpdateRequest);
}

export function useAdminDeleteRequest() {
	return useMutation(api.helpRequests.adminDeleteRequest);
}

export function useAdminMarkComplete() {
	return useMutation(api.helpRequests.adminMarkComplete);
}

export function useAdminCancelRequest() {
	return useMutation(api.helpRequests.adminCancelRequest);
}

export function useAdminAddNote() {
	return useMutation(api.helpRequests.adminAddNote);
}

export function useAdminToggleUrgent() {
	return useMutation(api.helpRequests.adminToggleUrgent);
}

export function useAdminAllUsers() {
	return useQuery(api.users.listAllForAdmin);
}

export function useAdminGetUser(userId: Id<"users">) {
	return useQuery(api.users.adminGetUser, { userId });
}

export function useAdminBlockUser() {
	return useMutation(api.users.adminBlockUser);
}

export function useAdminUnblockUser() {
	return useMutation(api.users.adminUnblockUser);
}
