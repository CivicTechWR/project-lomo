import { z } from "zod";
import { clientSchema } from "./env-client";

if (!import.meta.env.SSR) {
	throw new Error("env-server.ts must not be imported in client code");
}

const serverSchema = clientSchema.extend({
	VITE_CONVEX_SITE_URL: z.url(),
	VITE_SITE_URL: z.url(),
});

export const serverEnv = serverSchema.parse(import.meta.env);
