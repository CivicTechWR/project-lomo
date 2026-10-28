import { redirect } from "next/navigation";
import { alreadySignedInPath } from "@/lib/already-signed-in";
import { isAuthenticated } from "@/lib/auth-server";

/**
 * Sign-in and sign-up are for signed-out visitors. A signed-in session would
 * keep the previous account, so a second email could not register.
 */
export async function redirectIfAuthenticated(): Promise<void> {
	let signedIn = false;
	try {
		signedIn = await isAuthenticated();
	}
	catch {
		signedIn = false;
	}

	if (signedIn) {
		redirect(alreadySignedInPath());
	}
}
