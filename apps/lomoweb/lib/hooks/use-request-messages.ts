import type { Id } from "@repo/convex-backend/convex/_generated/dataModel";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export function useRequestMessages(requestId: Id<"helpRequests">) {
	return useQuery(api.requestMessages.listForRequest, { requestId });
}

export function useRequestRelayAddress(requestId: Id<"helpRequests">) {
	return useQuery(api.requestMessages.getRelayAddressForRequest, { requestId });
}

export function usePostRequestMessage() {
	return useMutation(api.requestMessages.post);
}
