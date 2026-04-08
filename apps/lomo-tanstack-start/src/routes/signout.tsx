import { authClient } from "#/lib/auth-client";
import { LoaderIcon } from "@repo/ui/icons";
import { Text } from "@repo/ui/text";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/signout")({
	component: SignOutPage,
});

function SignOutPage() {
	useEffect(() => {
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = "/";
				},
			},
		});
	}, []);

	return (
		<div className="flex flex-col items-center justify-center gap-3 py-16">
			<LoaderIcon className="size-6" />
			<Text size={3} color="gray">Signing out...</Text>
		</div>
	);
}
