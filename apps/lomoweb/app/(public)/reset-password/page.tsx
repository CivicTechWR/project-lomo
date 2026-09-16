import { Suspense } from "react";
import { ResetPasswordForm } from "./reset-password-form";

/** Query params (reset token) must be read per request — static cache drops them. */
export const dynamic = "force-dynamic";

interface ResetPasswordPageProps {
	searchParams: Promise<{ token?: string; error?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
	const { token, error } = await searchParams;

	return (
		<Suspense>
			<ResetPasswordForm initialToken={token} initialUrlError={error} />
		</Suspense>
	);
}
