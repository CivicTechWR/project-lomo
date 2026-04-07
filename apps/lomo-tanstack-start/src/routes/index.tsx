import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { createFileRoute } from "@tanstack/react-router";
import {
	Authenticated,
	AuthLoading,
	Unauthenticated,
} from "convex/react";

function App() {
	return (
		<main>
			<Unauthenticated>Logged out</Unauthenticated>
			<Authenticated>Logged in</Authenticated>
			<AuthLoading>Loading...</AuthLoading>
		</main>
	);
}

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<Heading level={1} size={8} weight="bold" trim="both">
				LoMo
			</Heading>
			<Text size={4} color="gray" className="mt-4 max-w-md">
				A calm, consent-based community help platform. This is the experimental TanStack Start frontend.
			</Text>
			<App />
		</div>
	);
}
