import { GetConfig } from "@repo/eslint-config/react";

export default GetConfig({
	ignores: [
		".tanstack/**",
		".output/**",
		".nitro/**",
		".vinxi/**",
		"src/routeTree.gen.ts",
	],
});
