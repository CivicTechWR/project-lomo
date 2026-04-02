import { api } from "@repo/convex-backend/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import Header from "./header";

async function Page() {
	const [preloadedUserQuery] = await Promise.all([
		preloadAuthQuery(api.auth.getCurrentUser),
		// Load multiple queries in parallel if needed
	]);

	return (
		<div>
			<Header preloadedUserQuery={preloadedUserQuery} />
		</div>
	);
}

export default Page;
