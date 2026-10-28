import { describe, expect, it } from "bun:test";
import { extractPayloadCoordinates } from "./requestLocation";

function payload(draft: Record<string, unknown>): string {
	return JSON.stringify({ draft });
}

describe("extractPayloadCoordinates", () => {
	it("reads delivery coordinates when food or items need delivery", () => {
		const coords = { lat: 43.45, lng: -80.49 };
		expect(extractPayloadCoordinates("food", payload({
			foodDetails: { needsDelivery: true, addressLat: coords.lat, addressLng: coords.lng },
		}))).toEqual(coords);
		expect(extractPayloadCoordinates("items", payload({
			itemsDetails: { needsDelivery: true, addressLat: coords.lat, addressLng: coords.lng },
		}))).toEqual(coords);
	});

	it("ignores delivery coordinates when delivery was not requested", () => {
		expect(extractPayloadCoordinates("food", payload({
			foodDetails: { needsDelivery: false, addressLat: 43.45, addressLng: -80.49 },
		}))).toBeNull();
	});

	it("reads a location chosen from suggestions for other, walk, and ceremony requests", () => {
		const coords = { lat: 43.451, lng: -80.492 };
		expect(extractPayloadCoordinates("other", payload({
			otherDetails: { location: "Victoria Park", locationLat: coords.lat, locationLng: coords.lng },
		}))).toEqual(coords);
		expect(extractPayloadCoordinates("support", payload({
			publicWalkDetails: { location: "Victoria Park", locationLat: coords.lat, locationLng: coords.lng },
		}))).toEqual(coords);
		expect(extractPayloadCoordinates("ceremony", payload({
			ceremonyDetails: {
				locationAddress: "Victoria Park, Kitchener",
				locationLat: coords.lat,
				locationLng: coords.lng,
			},
		}))).toEqual(coords);
	});

	it("does not treat free-text location as coordinates", () => {
		expect(extractPayloadCoordinates("other", payload({
			otherDetails: { location: "Central park" },
		}))).toBeNull();
		expect(extractPayloadCoordinates("support", payload({
			publicWalkDetails: { location: "the park" },
		}))).toBeNull();
		expect(extractPayloadCoordinates("ceremony", payload({
			ceremonyDetails: { locationAddress: "somewhere nearby" },
		}))).toBeNull();
	});

	it("rejects coordinates outside the valid range", () => {
		expect(extractPayloadCoordinates("other", payload({
			otherDetails: { locationLat: 120, locationLng: -80.49 },
		}))).toBeNull();
	});
});
