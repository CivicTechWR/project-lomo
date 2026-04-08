import antfu from "@antfu/eslint-config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * @param {Parameters<typeof antfu>[0]} options
 * @returns {ReturnType<typeof antfu>} the eslint config
 */
export function GetConfig(options) {
	return antfu({
		formatters: true,
		ignores: [
			".next/**",
			"out/**",
			"build/**",
			"next-env.d.ts",
		],
		plugins: {
			nextTs,
			nextVitals,
		},
		react: {
			overrides: {
				"react/prefer-shorthand-fragment": "off",
			},
		},
		rules: {
			"react/prefer-shorthand-fragment": "off",
		},
		stylistic: {
			indent: "tab",
			overrides: {
				"unicorn/throw-new-error": ["off"],
			},
			quotes: "double",
			semi: true,
		},
		typescript: true,
		...options,
	});
}
