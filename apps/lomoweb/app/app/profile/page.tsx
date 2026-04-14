import { api } from "@repo/convex-backend/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { UserProfile } from "../user-profile";

export default async function ProfilePage() {
	const preloadedUser = await preloadAuthQuery(api.auth.getCurrentUser);

	return (
		<div className="flex min-h-screen items-center justify-center px-4 py-10">
			<UserProfile preloadedUser={preloadedUser} />
		</div>
	);
}
