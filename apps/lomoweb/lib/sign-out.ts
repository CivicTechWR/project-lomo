import { authClient } from "@/lib/auth-client";

/**
 * End the session and open sign-in as a new document so the form does not
 * keep the previous account's email in memory.
 */
export async function signOutToSignIn(): Promise<void> {
	await authClient.signOut();
	window.location.assign("/signin");
}
