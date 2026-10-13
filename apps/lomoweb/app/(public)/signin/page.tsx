import { redirect } from "next/navigation";
import { Suspense } from "react";
import { isAuthenticated } from "@/lib/auth-server";
import { SignInForm } from "./signin-form";

export default async function SignInPage() {
	if (await isAuthenticated()) {
		redirect("/app");
	}

	return (
		<Suspense>
			<SignInForm />
		</Suspense>
	);
}
