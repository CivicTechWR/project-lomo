import type { RequestDraft } from "./types";
import { URGENCY_OPTIONS } from "./food";

export function summarizeRideDraftBody(draft: RequestDraft): string {
	const lines: string[] = [];
	const r = draft.rideDetails;
	if (r.pickupLocation.trim()) {
		lines.push(`Pickup: ${r.pickupLocation.trim()}`);
	}
	if (r.dropoffLocation.trim()) {
		lines.push(`Drop-off: ${r.dropoffLocation.trim()}`);
	}
	if (r.needsReturnRide) {
		lines.push("Return ride needed");
	}
	if (r.whenText.trim()) {
		lines.push(`When: ${r.whenText.trim()}`);
	}
	if (r.accessibilityNeeded) {
		lines.push("Accessibility or mobility needs");
		if (r.accessibilityAccommodation.trim()) {
			lines.push(`Accommodation: ${r.accessibilityAccommodation.trim()}`);
		}
	}
	const u = URGENCY_OPTIONS.find(o => o.id === draft.urgency);
	if (u) {
		lines.push(`Urgency: ${u.title}`);
	}
	return lines.length > 0
		? lines.join("\n")
		: "No extra details yet — you can go back to add more.";
}

export function rideRequestTitle(draft: RequestDraft): string {
	const p = draft.rideDetails.pickupLocation.trim();
	const d = draft.rideDetails.dropoffLocation.trim();
	if (p && d) {
		const short = `${p} → ${d}`;
		return short.length > 52 ? `${short.slice(0, 49)}…` : short;
	}
	if (p) {
		return p.length > 48 ? `${p.slice(0, 45)}…` : p;
	}
	return "Ride request";
}

export function rideRequestListSummary(draft: RequestDraft): string {
	const body = summarizeRideDraftBody(draft);
	const first = body.split("\n")[0] ?? body;
	return first.length > 140 ? `${first.slice(0, 137)}…` : first;
}
