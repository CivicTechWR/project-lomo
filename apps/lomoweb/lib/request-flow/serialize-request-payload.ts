import type { RequestDraft } from "./types";

/** Snapshot stored on helpRequests.payload for backend metadata extraction. */
export function serializeRequestPayload(draft: RequestDraft): string {
	return JSON.stringify({ draft });
}
