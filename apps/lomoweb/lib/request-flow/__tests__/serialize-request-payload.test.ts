import { describe, expect, it } from "vitest";
import { serializeRequestPayload } from "../serialize-request-payload";
import { emptyDraft } from "../types";

describe("serializeRequestPayload", () => {
	it("includes urgency in the draft snapshot", () => {
		const draft = { ...emptyDraft(), category: "food" as const, urgency: "urgent" as const };
		const payload = serializeRequestPayload(draft);
		const parsed = JSON.parse(payload) as { draft: { urgency: string } };
		expect(parsed.draft.urgency).toBe("urgent");
	});

	it("includes delivery details for location filtering", () => {
		const draft = emptyDraft();
		draft.foodDetails = {
			...draft.foodDetails,
			needsDelivery: true,
			address: "123 Main St",
			addressLat: 43.45,
			addressLng: -80.49,
		};
		const payload = serializeRequestPayload(draft);
		const parsed = JSON.parse(payload) as {
			draft: { foodDetails: { needsDelivery: boolean; addressLat: number } };
		};
		expect(parsed.draft.foodDetails.needsDelivery).toBe(true);
		expect(parsed.draft.foodDetails.addressLat).toBe(43.45);
	});
});
