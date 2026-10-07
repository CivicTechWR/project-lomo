import type { CountryCode } from "libphonenumber-js";
import {

	isPossiblePhoneNumber,
	isSupportedCountry as isSupportedCountryLibrary,
	parsePhoneNumberWithError,
} from "libphonenumber-js";

export interface PhoneNumberValidation {
	isValid: boolean;
	e164: string | null;
}

export function normalizePhoneNumber(value: string, country: string): string | null {
	const validation = validatePhoneNumber(value, [country]);
	return validation.isValid ? validation.e164 : null;
}

export function validatePhoneNumber(
	value: string,
	allowedCountries: readonly string[],
): PhoneNumberValidation {
	const trimmed = value.trim();
	const supportedCountries = allowedCountries.filter(
		(country): country is CountryCode => isSupportedCountryLibrary(country),
	);
	if (trimmed.length === 0 || supportedCountries.length === 0) {
		return { isValid: false, e164: null };
	}

	for (const country of supportedCountries) {
		if (!isPossiblePhoneNumber(trimmed, country)) {
			continue;
		}

		try {
			const parsed = parsePhoneNumberWithError(trimmed, country);
			if (
				parsed.country
				&& parsed.number
				&& isPhoneNumberAllowed(parsed.country, supportedCountries)
			) {
				return { isValid: true, e164: parsed.number };
			}
		}
		catch {
			// Try the next configured country before rejecting the input.
		}
	}

	return { isValid: false, e164: null };
}

export function isPhoneNumberAllowed(
	country: string,
	allowedCountries: readonly string[],
): boolean {
	return allowedCountries.includes(country);
}
