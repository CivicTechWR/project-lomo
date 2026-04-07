import { convexQuery } from "@convex-dev/react-query";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/app")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(
			convexQuery(api.auth.getCurrentUser, {}),
		);
	},
	component: AppPage,
});

function AppPage() {
	const { data: user } = useSuspenseQuery(
		convexQuery(api.auth.getCurrentUser, {}),
	);

	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<Heading level={2} size={6} weight="bold">
				Welcome,
				{" "}
				{user?.name ?? "user"}
			</Heading>
			<Text size={3} color="gray" className="mt-2">
				This is a protected page.
			</Text>
		</div>
	);
}
