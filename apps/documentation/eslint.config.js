import { GetConfig } from "@repo/eslint-config/react";

export default GetConfig({
	ignores: ["dist", "**/routeTree.gen.ts"],
});
