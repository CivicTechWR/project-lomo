import { describe, expect, it } from "bun:test";
import {
	isPhoneNumberAllowed,
	normalizePhoneNumber,
	validatePhoneNumber,
} from "./phoneNumber";

describe("phone_number", () => {
	it("normalizes valid Canadian and US numbers to E.164", () => {
		expect(normalizePhoneNumber("4165551234", "CA")).toBe("+14165551234");
		expect(normalizePhoneNumber("+1 415 555 1234", "US")).toBe("+14155551234");
	});

	it("rejects incomplete or invalid numbers", () => {
		expect(normalizePhoneNumber("416555", "CA")).toBeNull();
		expect(normalizePhoneNumber("416555123", "CA")).toBeNull();
		expect(normalizePhoneNumber("not-a-number", "CA")).toBeNull();
	});

	it("validates a number against the configured country allowlist", () => {
		expect(validatePhoneNumber("4165551234", ["CA", "US"])).toEqual({
			isValid: true,
			e164: "+14165551234",
		});
		expect(validatePhoneNumber("4155551234", ["CA"])).toEqual({
			isValid: false,
			e164: null,
		});
	});

	it("rejects empty and malformed country allowlists", () => {
		expect(isPhoneNumberAllowed("CA", [])).toBe(false);
		expect(isPhoneNumberAllowed("CA", ["CA", "CA"])).toBe(true);
	});
});
