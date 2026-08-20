import { api } from "@repo/convex-backend/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { UserProfile } from "../user-profile";

export default async function ProfilePage() {
	const preloadedUser = await preloadAuthQuery(api.auth.getCurrentUser);

	return (
		<div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 lg:py-10">
			<UserProfile preloadedUser={preloadedUser} />
		</div>
	);
}
