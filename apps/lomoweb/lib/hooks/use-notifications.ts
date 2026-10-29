import { api } from "@repo/convex-backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export function useMyNotifications(unreadOnly?: boolean) {
	return useQuery(api.notifications.listMine, { unreadOnly });
}

export function useMarkNotificationRead() {
	return useMutation(api.notifications.markRead);
}

export function useMarkAllNotificationsRead() {
	return useMutation(api.notifications.markAllRead);
}

export function useClearStaleNotifications() {
	return useMutation(api.notifications.clearStaleMine);
}

export function useMarkRequestThreadRead() {
	return useMutation(api.notifications.markRequestThreadRead);
}

export function useAdminNotifications(unreadOnly?: boolean) {
	return useQuery(api.notifications.listForAdmin, unreadOnly ? { unreadOnly: true } : {});
}
