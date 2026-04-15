import { api } from "@repo/convex-backend/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { NotificationsPanel } from "./notifications-panel";
import { RequestsHome } from "./requests-home";

export default async function AppPage() {
	const preloadedUser = await preloadAuthQuery(api.auth.getCurrentUser);

	return (
		<div className="mx-auto min-h-screen max-w-lg px-4 py-8">
			<NotificationsPanel />
			<RequestsHome preloadedUser={preloadedUser} />
		</div>
	);
}
