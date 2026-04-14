/* eslint-disable node/prefer-global/process */
import { z } from "zod";

/**
 * Better Auth `baseURL` — public origin of the Next.js app (e.g. http://localhost:3000).
 * Set `SITE_URL` in `apps/convex-backend/.env.local` for `convex dev`, or in the Convex
 * dashboard → Deployment → Environment Variables.
 *
 * Kept under `lib/` and validated lazily so Convex does not run Zod at module load during
 * `push` / analysis (when `process.env.SITE_URL` can be unset).
 */
const schema = z.object({
	SITE_URL: z.string().url(),
});

let cache: z.infer<typeof schema> | undefined;

export function getSiteEnv(): z.infer<typeof schema> {
	if (cache) {
		return cache;
	}
	const out = schema.safeParse(process.env);
	if (!out.success) {
		throw new Error(
			"SITE_URL is missing or invalid. Add SITE_URL=http://localhost:3000 to apps/convex-backend/.env.local, or set SITE_URL in the Convex dashboard (Deployment → Environment Variables).",
		);
	}
	cache = out.data;
	return cache;
}
