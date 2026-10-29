import type { CountryCode } from "libphonenumber-js";
import {
	isSupportedCountry as isSupportedCountryLibrary,
	parsePhoneNumberWithError,
} from "libphonenumber-js";
import { isValidPhoneNumber } from "libphonenumber-js/max";

export interface PhoneNumberValidation {
	isValid: boolean;
	e164: string | null;
}

export const DEFAULT_PHONE_NUMBER_ALLOWED_COUNTRIES = ["CA", "US"] as const;

export const PHONE_NUMBER_COUNTRY_LABELS: Readonly<Record<string, string>> = {
	CA: "Canada",
	US: "United States",
	GB: "United Kingdom",
	AU: "Australia",
	DE: "Germany",
	FR: "France",
	IN: "India",
	JP: "Japan",
	ZA: "South Africa",
};

const NON_DIGITS = /\D/g;

export function normalizeAllowedCountries(
	allowedCountries: readonly string[],
): CountryCode[] | null {
	const normalized = allowedCountries.map(country => country.trim().toUpperCase());
	if (
		normalized.length === 0
		|| new Set(normalized).size !== normalized.length
		|| normalized.some(country => !isSupportedCountryLibrary(country))
	) {
		return null;
	}

	return normalized as CountryCode[];
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

	const digits = trimmed.replace(NON_DIGITS, "");
	for (const country of supportedCountries) {
		if (!isValidPhoneNumber(digits, country)) {
			continue;
		}

		try {
			const parsed = parsePhoneNumberWithError(digits, country);
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
