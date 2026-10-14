import path from "node:path";
import { fileURLToPath } from "node:url";
import { GetConfig } from "@repo/eslint-config/convex";

const packageRoot = path.dirname(fileURLToPath(import.meta.url));

export default GetConfig({
	typescript: {
		// Absolute path so lefthook/`bunx eslint` from the monorepo root still
		// finds the Convex project (relative "convex/tsconfig.json" is CWD-based).
		tsconfigPath: path.join(packageRoot, "convex/tsconfig.json"),
	},
});
