import { Suspense } from "react";
import { redirectIfAuthenticated } from "@/lib/redirect-if-authenticated";
import { SignUpForm } from "./signup-form";

/** Session check must run per request so a signed-in visitor never sees this form. */
export const dynamic = "force-dynamic";

export default async function SignUpPage() {
	await redirectIfAuthenticated();

	return (
		<Suspense>
			<SignUpForm />
		</Suspense>
	);
}
