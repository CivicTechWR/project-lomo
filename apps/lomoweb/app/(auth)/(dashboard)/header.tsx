"use client";

import type { api } from "@repo/convex-backend/convex/_generated/api";
import type { Preloaded } from "convex/react";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";

export function Header({
	preloadedUserQuery,
}: {
	preloadedUserQuery: Preloaded<typeof api.auth.getCurrentUser>;
}) {
	const user = usePreloadedAuthQuery(preloadedUserQuery);
	return (
		<div>
			<h1>{user?.name}</h1>
		</div>
	);
}

export default Header;
