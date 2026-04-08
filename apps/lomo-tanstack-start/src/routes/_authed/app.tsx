import { useConvexMutation, useConvexQuery } from "@convex-dev/react-query";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/app")({
	component: AppPage,
});

function AppPage() {
	const navigate = useNavigate();
	const user = useConvexQuery(api.auth.getCurrentUser);

	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<Heading level={2} size={6} weight="bold">
				Welcome,
				<code>
					<pre>
						{JSON.stringify(user ?? {}, null, 2)}
					</pre>
				</code>
			</Heading>
			<Text size={3} color="gray" className="mt-2">
				This is a protected page.
			</Text>
			<Button
				variant="soft"
				color="gray"
				className="mt-6"
				onPress={() => navigate({ to: "/signout" })}
			>
				Sign out
			</Button>
			<AddRandomNumber />
			<NumbersList />
		</div>
	);
}

function AddRandomNumber() {
	const mutate = useConvexMutation(api.numbers.addRandomNumber);

	function handlePress() {
		const number = Math.round(Math.random() * 100);

		mutate({ value: number });
	}

	return <Button onPress={handlePress}>Add Random Number</Button>;
}

function NumbersList() {
	const numbers = useConvexQuery(api.numbers.listNumbers, {});

	if (!numbers) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			{JSON.stringify(numbers.map(({ value }) => value), null, 2)}
		</div>
	);
}
