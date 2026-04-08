import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
	beforeLoad: ({ context, location }) => {
		if (!context.isAuthenticated) {
			throw redirect({
				to: "/signin",
				search: { redirect: location.pathname },
			});
		}
	},
	component: () => <Outlet />,
});
