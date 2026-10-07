import type { CountryCode } from "libphonenumber-js";
import {
	AsYouType,

	isPossiblePhoneNumber,
	isSupportedCountry,
	parsePhoneNumberWithError,
} from "libphonenumber-js";

export interface PhoneNumberValidation {
	isValid: boolean;
	isPossible: boolean;
	e164: string | null;
}

export function formatPhoneNumber(value: string, country: string): string {
	const countryCode = getCountryCode(country);
	return countryCode ? new AsYouType(countryCode).input(value) : "";
}

export function normalizePhoneNumber(value: string, country: string): string | null {
	const validation = validatePhoneNumber(value, country);
	return validation.isValid ? validation.e164 : null;
}

export function validatePhoneNumber(value: string, country: string): PhoneNumberValidation {
	const countryCode = getCountryCode(country);
	if (!countryCode) {
		return { isValid: false, isPossible: false, e164: null };
	}

	const trimmed = value.trim();
	const isPossible = trimmed.length > 0 && isPossiblePhoneNumber(trimmed, countryCode);

	if (!isPossible) {
		return { isValid: false, isPossible: false, e164: null };
	}

	try {
		const parsed = parsePhoneNumberWithError(trimmed, countryCode);
		if (parsed.country !== countryCode) {
			return { isValid: false, isPossible: true, e164: null };
		}

		return { isValid: true, isPossible: true, e164: parsed.number };
	}
	catch {
		return { isValid: false, isPossible: true, e164: null };
	}
}

function getCountryCode(country: string): CountryCode | null {
	return isSupportedCountry(country) ? country : null;
}
