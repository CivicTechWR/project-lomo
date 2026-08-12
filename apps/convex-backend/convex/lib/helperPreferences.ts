const HELPER_PREFERENCE_IDS = [
	"food_cooking_preparing",
	"food_pickup_delivery",
	"items_delivery",
	"items_sharing",
	"support_walking_public",
	"support_ceremony",
	"financial_microgrant",
] as const;

const allowed = new Set<string>(HELPER_PREFERENCE_IDS);

export function normalizeHelpPreferences(values: string[] | undefined): string[] | undefined {
	if (values === undefined) {
		return undefined;
	}
	const unique = [...new Set(values.map(v => v.trim()).filter(Boolean))];
	for (const value of unique) {
		if (!allowed.has(value)) {
			throw new Error(`Invalid help preference: ${value}`);
		}
	}
	return unique;
}
