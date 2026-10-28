export const PRONOUNS_MAX_LENGTH = 64;
const INVALID_PRONOUNS_CHARACTERS = /[\p{Cc}<>]/u;

/** Optional free text: allow diverse pronouns without prescribing a fixed list. */
export function validatePronouns(input: string): { value: string | undefined; error: string | null } {
	const value = input.trim() || undefined;
	if (INVALID_PRONOUNS_CHARACTERS.test(input)) {
		return { value: undefined, error: "Use plain text without control characters or angle brackets for pronouns." };
	}
	if (value && value.length > PRONOUNS_MAX_LENGTH) {
		return { value: undefined, error: "Use 64 characters or fewer for pronouns." };
	}
	return { value, error: null };
}
