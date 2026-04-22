import { api } from "@repo/convex-backend/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { RequestsHome } from "./requests-home";

export default async function AppPage() {
	const preloadedUser = await preloadAuthQuery(api.auth.getCurrentUser);

	return (
		<div className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col px-4 py-8 lg:max-w-none lg:w-full">
			<RequestsHome preloadedUser={preloadedUser} />
		</div>
	);
}
