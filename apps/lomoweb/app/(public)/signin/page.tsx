import { Suspense } from "react";
import { redirectIfAuthenticated } from "@/lib/redirect-if-authenticated";
import { SignInForm } from "./signin-form";

/** Session check must run per request so a signed-in visitor never sees this form. */
export const dynamic = "force-dynamic";

export default async function SignInPage() {
	await redirectIfAuthenticated();

	return (
		<Suspense>
			<SignInForm />
		</Suspense>
	);
}
