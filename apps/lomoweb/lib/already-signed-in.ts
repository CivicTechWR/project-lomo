/** Query value for the signed-in notice on the app home page. */
export const ALREADY_SIGNED_IN_NOTICE = "already-signed-in";

export const ALREADY_SIGNED_IN_MESSAGE
	= "You're already logged in. Log out to use a different email.";

export function alreadySignedInPath(): string {
	return pathWithAlreadySignedInNotice("/app");
}

export function pathWithAlreadySignedInNotice(path: string): string {
	return `${path}?notice=${ALREADY_SIGNED_IN_NOTICE}`;
}

export function isAlreadySignedInNotice(
	notice: string | string[] | undefined,
): boolean {
	if (Array.isArray(notice)) {
		return notice.includes(ALREADY_SIGNED_IN_NOTICE);
	}
	return notice === ALREADY_SIGNED_IN_NOTICE;
}
