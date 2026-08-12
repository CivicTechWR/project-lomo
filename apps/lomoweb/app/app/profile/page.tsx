import { api } from "@repo/convex-backend/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { UserProfile } from "../user-profile";

export default async function ProfilePage() {
	const preloadedUser = await preloadAuthQuery(api.auth.getCurrentUser);

	return (
		<div className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col px-4 py-6 lg:max-w-none lg:w-full lg:py-8">
			<UserProfile preloadedUser={preloadedUser} />
		</div>
	);
}
