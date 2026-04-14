"use client";

import type { api } from "@repo/convex-backend/convex/_generated/api";
import type { Preloaded } from "convex/react";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function UserProfile({
	preloadedUser,
}: {
	preloadedUser: Preloaded<typeof api.auth.getCurrentUser>;
}) {
	const router = useRouter();
	const user = usePreloadedAuthQuery(preloadedUser);

	if (!user) {
		return null;
	}

	async function handleSignOut() {
		await authClient.signOut();
		router.push("/signin");
	}

	return (
		<Card size={3} variant="surface" className="w-full max-w-md">
			<div className="flex flex-col gap-5 p-6">
				<div className="flex items-center justify-between gap-3">
					<Heading level={2} size={6}>
						Your profile
					</Heading>
					<Button
						variant="soft"
						color="gray"
						size={1}
						onPress={handleSignOut}
					>
						Sign out
					</Button>
				</div>

				<div className="flex flex-col gap-3">
					<DetailRow label="Name" value={user.name ?? "—"} />
					<DetailRow label="Email" value={user.email ?? "—"} />
					<div className="flex items-center justify-between">
						<Text size={2} color="gray">
							Email verified
						</Text>
						<Badge
							variant="soft"
							size={1}
							color={user.emailVerified ? "sage" : "amber"}
						>
							{user.emailVerified ? "Verified" : "Not verified"}
						</Badge>
					</div>
					{user.issuer && <DetailRow label="Issuer" value={user.issuer} />}
				</div>

				<Button
					variant="outline"
					color="gray"
					className="w-full"
					onPress={() => router.push("/app")}
				>
					Back to requests
				</Button>
			</div>
		</Card>
	);
}

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between">
			<Text size={2} color="gray">
				{label}
			</Text>
			<Text size={2}>{value}</Text>
		</div>
	);
}
