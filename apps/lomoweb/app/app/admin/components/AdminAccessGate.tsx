"use client";

import type { ReactNode } from "react";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";

interface AdminAccessGateProps {
	children: ReactNode;
}

/**
 * Checks the `isAdmin` query before rendering admin content.
 * - Shows a loading indicator while verifying
 * - Redirects unauthenticated users to /signin
 * - Shows access denied if the user is not admin
 *
 * Note: The parent server layout at /app/layout.tsx already redirects
 * unauthenticated users to /signin. This gate handles the admin-specific
 * authorization check on top of that.
 */
export function AdminAccessGate({ children }: AdminAccessGateProps) {
	const router = useRouter();
	const isAdmin = useQuery(api.helpRequests.isAdmin);

	// Loading state — query not yet resolved
	if (isAdmin === undefined) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-surface-warm">
				<div className="flex flex-col items-center gap-4" role="status">
					<div className="size-8 animate-spin rounded-full border-4 border-terracotta-6 border-t-terracotta-9" />
					<Text className="text-terracotta-9">Verifying access...</Text>
					<span className="sr-only" aria-live="polite">
						Verifying admin access, please wait.
					</span>
				</div>
			</div>
		);
	}

	// Access denied — not an admin
	if (!isAdmin) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-surface-warm">
				<div className="mx-4 flex max-w-md flex-col items-center gap-4 rounded-4 border-2 border-terracotta-6 bg-white p-8 text-center shadow-sm">
					<Heading level={1} className="text-terracotta-9">
						Access Denied
					</Heading>
					<Text className="text-terracotta-9">
						You do not have permission to access the admin area. Please contact a
						coordinator if you believe this is an error.
					</Text>
					<Button
						variant="solid"
						onPress={() => router.push("/app")}
					>
						Return to Home
					</Button>
				</div>
			</div>
		);
	}

	// Admin verified — render children
	return <>{children}</>;
}
