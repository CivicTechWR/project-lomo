import antfu from "@antfu/eslint-config";

/**
 * @param {Parameters<typeof antfu>[0]} options
 * @returns {ReturnType<typeof antfu>} the eslint config
 */
export function GetConfig(options) {
	return antfu({
		formatters: true,
		...options,
		react: {
			overrides: {
				...options.react?.overrides,
				"react/prefer-shorthand-fragment": "off",
				"react-refresh/only-export-components": "off",
			},
		},
		rules: {
			...options.rules,
			"react/prefer-shorthand-fragment": "off",
			"react-refresh/only-export-components": "off",
		},
		stylistic: {
			...options.stylistic,
			indent: "tab",
			overrides: {
				"unicorn/throw-new-error": ["off"],
			},
			quotes: "double",
			semi: true,
		},
		typescript: true,
	});
}
