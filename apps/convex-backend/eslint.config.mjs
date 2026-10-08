import { GetConfig } from "@repo/eslint-config/convex";

export default GetConfig({
	typescript: {
		// Bun CLI scripts sit outside the Convex tsconfig, so lint them without type info.
		ignoresTypeAware: ["scripts/**"],
	},
});
