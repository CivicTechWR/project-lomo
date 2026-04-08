import { api } from "@repo/convex-backend/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { UserDashboard } from "./user-dashboard";

export default async function AppPage() {
	const preloadedUser = await preloadAuthQuery(api.auth.getCurrentUser);

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<UserDashboard preloadedUser={preloadedUser} />
		</div>
	);
}
