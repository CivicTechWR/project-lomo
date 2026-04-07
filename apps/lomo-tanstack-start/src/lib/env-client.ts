import { z } from "zod";

export const clientSchema = z.object({
	VITE_CONVEX_URL: z.url(),
});

export const clientEnv = clientSchema.parse(import.meta.env);
