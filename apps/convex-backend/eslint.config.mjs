import { fileURLToPath } from "node:url";
import { GetConfig } from "@repo/eslint-config/convex";

const convexTsconfigPath = fileURLToPath(
	new URL("./convex/tsconfig.json", import.meta.url),
);

export default GetConfig({
	typescript: {
		tsconfigPath: convexTsconfigPath,
		// Bun CLI scripts sit outside the Convex tsconfig, so lint them without type info.
		ignoresTypeAware: ["scripts/**"],
	},
});
