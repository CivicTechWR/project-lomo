export const HELPER_PREFERENCE_GROUPS = [
	{
		id: "food",
		label: "Food",
		options: [
			{ id: "food_cooking_preparing", label: "Cooking/Preparing" },
			{ id: "food_pickup_delivery", label: "Pick-up/Drop-off delivery" },
		],
	},
	{
		id: "items",
		label: "Items",
		options: [
			{ id: "items_delivery", label: "Delivery" },
			{ id: "items_sharing", label: "Sharing items (Coats, tools, medicine)" },
		],
	},
	{
		id: "support",
		label: "Support",
		options: [
			{ id: "support_walking_public", label: "Walking (Public)" },
			{ id: "support_ceremony", label: "Ceremony" },
		],
	},
	{
		id: "financial",
		label: "Financial",
		options: [
			{ id: "financial_microgrant", label: "Microgrant support (Small, direct help)" },
		],
	},
] as const;

export type HelperPreferenceId
	= (typeof HELPER_PREFERENCE_GROUPS)[number]["options"][number]["id"];

export const HELPER_PREFERENCE_IDS: HelperPreferenceId[] = HELPER_PREFERENCE_GROUPS.flatMap(
	group => group.options.map(option => option.id),
);

export const SAFETY_NOTICES = [
	"I understand LoMo is peer-based, not a professional or emergency service.",
	"I understand helpers are community members and participation is voluntary.",
	{
		text: "I understand in-person support happens ",
		emphasis: "only in public places",
		suffix: ".",
	},
	"I understand support is not guaranteed and \"Resting\" mode helps prevent burnout.",
	"I agree to participate respectfully and am responsible for my own boundaries.",
] as const;

export const ONBOARDING_STEP_COUNT = 4;

export const ONBOARDING_STEP_PATHS = [
	"/app/onboarding/basics",
	"/app/onboarding/contact",
	"/app/onboarding/safety",
	"/app/onboarding/preferences",
] as const;
