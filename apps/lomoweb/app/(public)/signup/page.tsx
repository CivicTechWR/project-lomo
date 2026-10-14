import { redirect } from "next/navigation";
import { Suspense } from "react";
import { isAuthenticated } from "@/lib/auth-server";
import { SignUpForm } from "./signup-form";

export default async function SignUpPage() {
	if (await isAuthenticated()) {
		redirect("/app");
	}

	return (
		<Suspense>
			<SignUpForm />
		</Suspense>
	);
}
