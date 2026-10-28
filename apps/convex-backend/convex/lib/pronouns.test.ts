import { describe, expect, it } from "bun:test";
import { validatePronouns } from "./pronouns";

describe("pronouns", () => {
	it("keeps pronouns optional and trims surrounding spaces", () => {
		expect(validatePronouns("   ")).toEqual({ value: undefined, error: null });
		expect(validatePronouns("  they/them  ")).toEqual({ value: "they/them", error: null });
	});

	it("accepts inclusive free text and Unicode", () => {
		for (const value of ["she/her, they/them", "xe/xem", "ask me", "il/lui · elle", "any pronouns (they preferred)"]) {
			expect(validatePronouns(value)).toEqual({ value, error: null });
		}
	});

	it("enforces the length boundary after trimming", () => {
		expect(validatePronouns(` ${"a".repeat(64)} `).error).toBeNull();
		expect(validatePronouns("a".repeat(65)).error).toBe("Use 64 characters or fewer for pronouns.");
	});

	it("rejects control characters and markup", () => {
		for (const value of ["they\nthem", "she\ther", "he\u0000him", "they\u007Fthem", "they\u0085them", "<script>"]) {
			expect(validatePronouns(value).error).toBe("Use plain text without control characters or angle brackets for pronouns.");
		}
	});
});
