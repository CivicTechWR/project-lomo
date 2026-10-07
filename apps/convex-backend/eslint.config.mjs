import { fileURLToPath } from "node:url";
import { GetConfig } from "@repo/eslint-config/convex";

const convexTsconfigPath = fileURLToPath(
	new URL("./convex/tsconfig.json", import.meta.url),
);

export default GetConfig({
	typescript: {
		tsconfigPath: convexTsconfigPath,
	},
});
