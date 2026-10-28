export const PERSON_NAME_MAX_LENGTH = 64;

/** Error code Better Auth returns when an account name fails these rules. */
export const INVALID_PERSON_NAME_CODE = "INVALID_NAME";

export const PERSON_NAME_REQUIRED_ERROR = "Name is required";
export const PERSON_NAME_CHARACTERS_ERROR
	= "Use only letters, spaces, hyphens (-), apostrophes (') and periods (.) in your name.";
export const PERSON_NAME_LETTER_ERROR = "Include at least one letter in your name.";
export const PERSON_NAME_LENGTH_ERROR = `Use ${PERSON_NAME_MAX_LENGTH} characters or fewer for your name.`;

/*
 * Letters in any script, combining marks (accents, Indic vowel signs), spaces,
 * hyphens, and periods. Apostrophes include the curly ’ that phone keyboards
 * insert. Everything else, like @, digits, emoji, and markup, is rejected.
 */
const PERSON_NAME_CHARACTERS = /^[\p{L}\p{M} .'’-]+$/u;
const LETTER = /\p{L}/u;
const WHITESPACE_RUN = /\s+/g;

export interface PersonNameValidation {
	value: string | undefined;
	error: string | null;
}

/**
 * Validates a person's name and normalizes it: NFC, trimmed, with inner
 * whitespace collapsed to single spaces. A blank name is an error only when
 * `required` is set; otherwise its value is `undefined`.
 */
export function validatePersonName(
	input: string,
	{ required = false }: { required?: boolean } = {},
): PersonNameValidation {
	const value = input.normalize("NFC").trim().replace(WHITESPACE_RUN, " ");
	if (value.length === 0) {
		return { value: undefined, error: required ? PERSON_NAME_REQUIRED_ERROR : null };
	}
	if (!PERSON_NAME_CHARACTERS.test(value)) {
		return { value: undefined, error: PERSON_NAME_CHARACTERS_ERROR };
	}
	if (!LETTER.test(value)) {
		return { value: undefined, error: PERSON_NAME_LETTER_ERROR };
	}
	// Count code points so names outside the Basic Multilingual Plane are not penalized.
	if ([...value].length > PERSON_NAME_MAX_LENGTH) {
		return { value: undefined, error: PERSON_NAME_LENGTH_ERROR };
	}
	return { value, error: null };
}
