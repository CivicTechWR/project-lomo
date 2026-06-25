export async function postResendEmail(opts: {
	apiKey: string;
	from: string;
	to: string;
	subject: string;
	text: string;
	replyTo?: string;
	html?: string;
}): Promise<void> {
	const body: Record<string, unknown> = {
		from: opts.from,
		to: [opts.to],
		subject: opts.subject,
		text: opts.text,
	};
	if (opts.replyTo) {
		body.reply_to = [opts.replyTo];
	}
	if (opts.html) {
		body.html = opts.html;
	}
	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${opts.apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		const errBody = await res.text();
		throw new Error(`Resend error (${res.status}): ${errBody}`);
	}
}

export function getResendConfig(): { apiKey: string; from: string } | null {
	const apiKey = process.env.RESEND_API_KEY;
	const from = process.env.NOTIFICATIONS_FROM_EMAIL;
	if (!apiKey || !from) {
		return null;
	}
	return { apiKey, from };
}
