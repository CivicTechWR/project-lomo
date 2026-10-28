import { describe, expect, it } from "bun:test";
import {
	PERSON_NAME_CHARACTERS_ERROR,
	PERSON_NAME_LENGTH_ERROR,
	PERSON_NAME_LETTER_ERROR,
	PERSON_NAME_MAX_LENGTH,
	PERSON_NAME_REQUIRED_ERROR,
	validatePersonName,
} from "./personName";

describe("person_name", () => {
	it("accepts real-world names across scripts and punctuation", () => {
		for (const name of [
			"Sam",
			"Mary-Jane O'Brien",
			"D’Angelo",
			"J.R.R. Tolkien",
			"Zoë Saldaña",
			"José María",
			"Nguyễn Văn Anh",
			"Ólafur Arnalds",
			"Łukasz",
			"Αλέξανδρος",
			"Владимир",
			"محمد",
			"שרה",
			"王秀英",
			"さくら",
			"김민준",
			"अनुष्का",
			"'Abdu'l-Bahá",
		]) {
			expect(validatePersonName(name)).toEqual({ value: name, error: null });
		}
	});

	it("trims, collapses inner whitespace, and normalizes to NFC", () => {
		expect(validatePersonName("  Mary   Jane  ")).toEqual({ value: "Mary Jane", error: null });
		expect(validatePersonName("Ana\tLuisa")).toEqual({ value: "Ana Luisa", error: null });
		expect(validatePersonName("Zoë")).toEqual({ value: "Zoë", error: null });
	});

	it("rejects @ and other characters that do not belong in a name", () => {
		for (const name of [
			"sam@example.com",
			"@sam",
			"Sam2",
			"Sam_Lee",
			"Sam!",
			"<script>",
			"Sam & Alex",
			"Sam (they)",
			"Sam/Alex",
			"Sam 🙂",
			"Sam\u0000",
		]) {
			expect(validatePersonName(name).error).toBe(PERSON_NAME_CHARACTERS_ERROR);
		}
	});

	it("requires at least one letter", () => {
		for (const name of ["-", "...", "' - '"]) {
			expect(validatePersonName(name).error).toBe(PERSON_NAME_LETTER_ERROR);
		}
	});

	it("enforces the length limit after trimming, counting code points", () => {
		expect(validatePersonName(` ${"a".repeat(PERSON_NAME_MAX_LENGTH)} `).error).toBeNull();
		expect(validatePersonName("a".repeat(PERSON_NAME_MAX_LENGTH + 1)).error).toBe(PERSON_NAME_LENGTH_ERROR);
		// U+20000 is one code point but two UTF-16 code units.
		expect(validatePersonName("\u{20000}".repeat(PERSON_NAME_MAX_LENGTH)).error).toBeNull();
	});

	it("treats blank input as missing, and an error only when required", () => {
		expect(validatePersonName("   ")).toEqual({ value: undefined, error: null });
		expect(validatePersonName("   ", { required: true })).toEqual({
			value: undefined,
			error: PERSON_NAME_REQUIRED_ERROR,
		});
	});
});
