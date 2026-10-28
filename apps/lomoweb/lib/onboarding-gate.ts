const ONBOARDING_START = "/app/onboarding/basics";

/**
 * Where to send someone who is in the wrong place for their onboarding state.
 * Profile stays available before setup is finished so people can manage or
 * delete their account. Returns null when the current path should stay put.
 */
export function onboardingRedirectPath(
	pathname: string,
	onboardingCompleted: boolean,
): string | null {
	const isOnboarding = pathname.startsWith("/app/onboarding");
	const isProfile = pathname === "/app/profile" || pathname.startsWith("/app/profile/");
	if (!onboardingCompleted && !isOnboarding && !isProfile) {
		return ONBOARDING_START;
	}
	if (onboardingCompleted && isOnboarding) {
		return "/app";
	}
	return null;
}

/** Exit from the profile page. Setup still in progress goes back to the wizard. */
export function profileExit(onboardingCompleted: boolean | undefined): {
	href: string;
	label: string;
} {
	if (onboardingCompleted === false) {
		return { href: ONBOARDING_START, label: "Back to setup" };
	}
	return { href: "/app", label: "Back to requests" };
}
