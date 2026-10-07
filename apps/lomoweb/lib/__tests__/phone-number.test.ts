import { describe, expect, it } from "vitest";
import {
	formatPhoneNumber,
	normalizePhoneNumber,
	validatePhoneNumber,
} from "../phone-number";

describe("phone number utilities", () => {
	it("formats a Canadian number as the user types", () => {
		expect(formatPhoneNumber("4165551234", "CA")).toBe("(416) 555-1234");
	});

	it("formats a US number as the user types", () => {
		expect(formatPhoneNumber("4155551234", "US")).toBe("(415) 555-1234");
	});

	it("normalizes valid numbers to E.164", () => {
		expect(normalizePhoneNumber("4165551234", "CA")).toBe("+14165551234");
		expect(normalizePhoneNumber("+1 415 555 1234", "US")).toBe("+14155551234");
	});

	it("strictly validates complete numbers for the selected country", () => {
		expect(validatePhoneNumber("4165551234", "CA")).toEqual({
			isValid: true,
			isPossible: true,
			e164: "+14165551234",
		});
		expect(validatePhoneNumber("4155551234", "US")).toEqual({
			isValid: true,
			isPossible: true,
			e164: "+14155551234",
		});
	});

	it("rejects incomplete, invalid, and wrong-country numbers", () => {
		expect(validatePhoneNumber("416555", "CA")).toEqual({
			isValid: false,
			isPossible: false,
			e164: null,
		});
		expect(validatePhoneNumber("416555123", "CA")).toEqual({
			isValid: false,
			isPossible: false,
			e164: null,
		});
		expect(validatePhoneNumber("not-a-number", "CA")).toEqual({
			isValid: false,
			isPossible: false,
			e164: null,
		});
		expect(validatePhoneNumber("4155551234", "CA")).toEqual({
			isValid: false,
			isPossible: true,
			e164: null,
		});
	});

	it("returns an empty result for blank input", () => {
		expect(validatePhoneNumber("", "CA")).toEqual({
			isValid: false,
			isPossible: false,
			e164: null,
		});
		expect(formatPhoneNumber("", "CA")).toBe("");
		expect(normalizePhoneNumber("", "CA")).toBeNull();
	});
});
