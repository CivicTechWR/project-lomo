import { api } from "@repo/convex-backend/convex/_generated/api";
import { isAlreadySignedInNotice } from "@/lib/already-signed-in";
import { preloadAuthQuery } from "@/lib/auth-server";
import { AlreadySignedInNotice } from "./already-signed-in-notice";
import { RequestsHome } from "./requests-home";

export default async function AppPage({
	searchParams,
}: {
	searchParams: Promise<{ notice?: string | string[] }>;
}) {
	const { notice } = await searchParams;
	const preloadedUser = await preloadAuthQuery(api.auth.getCurrentUser);

	return (
		<div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:py-10">
			{isAlreadySignedInNotice(notice) ? <AlreadySignedInNotice /> : null}
			<RequestsHome preloadedUser={preloadedUser} />
		</div>
	);
}
