/* eslint-disable node/prefer-global/process */
import { z } from "zod";

export const clientSchema = z.object({
	NEXT_PUBLIC_CONVEX_URL: z.url(),
	/** Browser origin for Better Auth client (must match Convex SITE_URL and the URL you open). */
	NEXT_PUBLIC_SITE_URL: z.url(),
});

// Each var must be a static process.env.X reference — Next.js inlines these at build time
export const clientEnv = clientSchema.parse({
	NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
	NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
