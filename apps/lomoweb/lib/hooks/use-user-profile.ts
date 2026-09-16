import { api } from "@repo/convex-backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export function useMyProfileRow(user?: unknown) {
	return useQuery(api.users.getMyProfileRow, user ? {} : "skip");
}

export function useUpdatePublicProfile() {
	return useMutation(api.users.updatePublicProfile);
}

export function useUpdateHelperPreferences() {
	return useMutation(api.users.updateHelperPreferences);
}

export function useAcknowledgeSafety() {
	return useMutation(api.users.acknowledgeSafety);
}

export function useCompleteOnboarding() {
	return useMutation(api.users.completeOnboarding);
}

export function useDeleteMyAccount() {
	return useMutation(api.users.deleteMyAccount);
}
