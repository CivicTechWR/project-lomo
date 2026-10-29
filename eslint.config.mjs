import sharedConfig from "./packages/eslint-config/eslint.config.js";

export default [
	...(await sharedConfig),
	{
		ignores: [
			".agents/**",
			"apps/**",
			"packages/**",
			"playwright-report/**",
			"test-results/**",
		],
	},
];
