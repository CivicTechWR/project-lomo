import antfu from "@antfu/eslint-config";
import { convexPlugin } from "./rules/convex.js";

/**
 * @param {Parameters<typeof antfu>[0]} [options]
 * @returns {ReturnType<typeof antfu>} the eslint config
 */
export function GetConfig(options) {
	return antfu(
		{
			formatters: true,
			...options,
			ignores: [
				"**/convex/_generated/**",
				...(options?.ignores ?? []),
			],
			stylistic: {
				...options?.stylistic,
				indent: "tab",
				overrides: {
					"unicorn/throw-new-error": ["off"],
				},
				quotes: "double",
				semi: true,
			},
			typescript: {
				tsconfigPath: "convex/tsconfig.json",
				...(typeof options?.typescript === "object" ? options.typescript : {}),
				overridesTypeAware: {
					...(typeof options?.typescript === "object" ? options.typescript.overridesTypeAware : {}),
					"@typescript-eslint/no-explicit-any": "off",
					"@typescript-eslint/no-unsafe-argument": "off",
					"@typescript-eslint/no-unsafe-assignment": "off",
					"@typescript-eslint/no-unsafe-call": "off",
					"@typescript-eslint/no-unsafe-member-access": "off",
					"@typescript-eslint/no-unsafe-return": "off",
					"@typescript-eslint/require-await": "off",
				},
				overrides: {
					...(typeof options?.typescript === "object" ? options.typescript.overrides : {}),
					"@typescript-eslint/ban-ts-comment": "error",
				},
			},
		},
		{
			files: ["**/convex/**/*.ts"],
			plugins: { convex: convexPlugin },
			rules: {
				"convex/no-old-registered-function-syntax": "error",
				"convex/require-args-validator": "error",
				"convex/explicit-table-ids": "error",
			},
		},
	);
}
