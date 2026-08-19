import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { clientEnv } from "@/lib/env-client";

/** Must match Convex `SITE_URL` and the origin in the browser (see `next dev --port 3000`). */
function getAuthBaseURL(): string {
	if (typeof window !== "undefined") {
		return window.location.origin;
	}
	return clientEnv.NEXT_PUBLIC_SITE_URL;
}

export const AUTH_CONNECTION_ERROR_MESSAGE
	= "Could not reach the sign-in service. Open LoMo at the URL in your environment (usually http://localhost:3000). If another app is using port 3000, stop it and restart `bun run dev`.";

export const authClient = createAuthClient({
	baseURL: getAuthBaseURL(),
	plugins: [convexClient()],
});
