import type { Path, UseFormSetError } from "react-hook-form";

interface ErrorMapEntry<TFields extends string = string> {
	field?: TFields;
	message: string;
}

export const SIGN_IN_ERROR_MAP: Record<string, ErrorMapEntry<"email" | "password">> = {
	INVALID_EMAIL: { field: "email", message: "Please enter a valid email address" },
	INVALID_EMAIL_OR_PASSWORD: { message: "Invalid email or password" },
	EMAIL_NOT_VERIFIED: { message: "Please verify your email before signing in" },
};

export const SIGN_UP_ERROR_MAP: Record<string, ErrorMapEntry<"name" | "email" | "password">> = {
	INVALID_EMAIL: { field: "email", message: "Please enter a valid email address" },
	INVALID_PASSWORD: { field: "password", message: "Invalid password" },
	PASSWORD_TOO_SHORT: { field: "password", message: "Password must be at least 8 characters" },
	PASSWORD_TOO_LONG: { field: "password", message: "Password is too long" },
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: { field: "email", message: "An account with this email already exists" },
};

/**
 * Maps a Better Auth error to either a field-level error (via setError) or a form-level message.
 * Returns `null` if the error was dispatched to a field, or a string for form-level display.
 */
export function handleAuthError<T extends Record<string, unknown>>(
	error: { code?: string; message?: string },
	map: Record<string, ErrorMapEntry>,
	setError: UseFormSetError<T>,
): string | null {
	const mapped = map[error.code ?? ""];

	if (mapped?.field) {
		setError(mapped.field as Path<T>, { message: mapped.message });
		return null;
	}

	if (mapped) {
		return mapped.message;
	}

	return error.message ?? "Something went wrong. Please try again.";
}
