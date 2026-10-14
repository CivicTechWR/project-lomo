import { describe, expect, it } from "vitest";
import { validatePhoneNumber } from "../phone-number";

describe("validatePhoneNumber", () => {
	it("validates a Canadian number with the real parser", () => {
		expect(validatePhoneNumber("4165550100", "CA")).toEqual({
			isValid: true,
			isPossible: true,
			e164: "+14165550100",
		});
	});
});
