"use client";

import type { ReactNode } from "react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { clientEnv } from "@/lib/env-client";

const convex = new ConvexReactClient(clientEnv.NEXT_PUBLIC_CONVEX_URL);

export function ConvexClientProvider({
	children,
	initialToken,
}: {
	children: ReactNode;
	initialToken?: string | null;
}) {
	return (
		<ConvexBetterAuthProvider
			client={convex}
			authClient={authClient}
			initialToken={initialToken}
		>
			{children}
		</ConvexBetterAuthProvider>
	);
}
