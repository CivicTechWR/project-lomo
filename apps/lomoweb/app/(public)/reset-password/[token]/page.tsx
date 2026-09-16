import { redirect } from "next/navigation";

/** Better Auth email links hit `/api/auth/reset-password/:token` first; this catches stray path tokens. */
export default async function ResetPasswordTokenPage({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const { token } = await params;
	redirect(`/reset-password?token=${encodeURIComponent(token)}`);
}
