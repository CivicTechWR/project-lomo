import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { clientEnv } from "@/lib/env-client";

export const authClient = createAuthClient({
	baseURL: clientEnv.NEXT_PUBLIC_SITE_URL,
	plugins: [convexClient()],
});
