import { Suspense } from "react";
import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
	return (
		<Suspense>
			<ForgotPasswordForm />
		</Suspense>
	);
}
