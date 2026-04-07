import { convexQuery } from "@convex-dev/react-query";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	loader: async ({ context }) => {
		if (context.isAuthenticated) {
			await context.queryClient.ensureQueryData(
				convexQuery(api.auth.getCurrentUser, {}),
			);
		}
	},
	component: HomePage,
});

function HomePage() {
	const { isAuthenticated } = Route.useRouteContext();

	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<Heading level={1} size={8} weight="bold" trim="both">
				LoMo
			</Heading>
			<Text size={4} color="gray" className="mt-4 max-w-md">
				A calm, consent-based community help platform. This is the experimental TanStack Start frontend.
			</Text>
			{isAuthenticated ? <AuthenticatedHome /> : <PublicHome />}
		</div>
	);
}

function PublicHome() {
	return (
		<Text size={3} className="mt-6">
			Logged out
		</Text>
	);
}

function AuthenticatedHome() {
	const { data: user } = useSuspenseQuery(
		convexQuery(api.auth.getCurrentUser, {}),
	);

	return (
		<Text size={3} className="mt-6">
			Welcome,
			{" "}
			{user?.name ?? "user"}
		</Text>
	);
}
