const LOMO_TAG = "[LoMo]";

export const MESSAGE_EMAIL_FOOTER_SEPARATOR = "----";

export const MESSAGE_EMAIL_REPLY_PROMPT =
	"Reply to this email (plain text) to continue the conversation. Your email address stays private.";

/** Subject for the first notification in a request thread. */
export function messageEmailSubject(requestTitle: string): string {
	return `${LOMO_TAG} New message about "${requestTitle}":`;
}

/** Subject for replies in a request thread (avoids nested `[LoMo] Re: [LoMo] …`). */
export function messageEmailReplySubject(requestTitle: string): string {
	return `${LOMO_TAG} Re: New message about "${requestTitle}":`;
}

export function formatMessageEmailBody(
	message: string,
	conversationLink: string,
): string {
	return (
		`${message}\n\n`
		+ `${MESSAGE_EMAIL_FOOTER_SEPARATOR}\n\n`
		+ `${MESSAGE_EMAIL_REPLY_PROMPT}\n\n`
		+ `Open the conversation: ${conversationLink}`
	);
}

export function conversationPath(
	requestId: string,
	recipientIsOwner: boolean,
): string {
	return recipientIsOwner
		? `/app/requests/${requestId}`
		: `/app/offer/${requestId}`;
}

export function conversationLink(
	siteBaseUrl: string,
	requestId: string,
	recipientIsOwner: boolean,
): string {
	const path = conversationPath(requestId, recipientIsOwner);
	return siteBaseUrl ? `${siteBaseUrl}${path}` : path;
}
