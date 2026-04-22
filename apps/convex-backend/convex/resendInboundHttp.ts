/* eslint-disable node/prefer-global/process */
import { internal } from "./_generated/api";
import { parseSvixHeaders, verifyResendWebhookPayload } from "./lib/verifyResendWebhook";
import { httpAction } from "./_generated/server";

function stripHtmlToText(html: string): string {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, " ")
		.replace(/<style[\s\S]*?<\/style>/gi, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function pickPlainBody(
	text: string | undefined,
	html: string | undefined,
): string {
	const t = text?.trim();
	if (t && t.length > 0) {
		return t;
	}
	if (html?.trim()) {
		return stripHtmlToText(html);
	}
	return "";
}

type ResendWebhookBody = {
	type?: string;
	data?: {
		email_id?: string;
	};
};

export const resendInboundWebhook = httpAction(async (ctx, req) => {
	if (req.method !== "POST") {
		return new Response("Method not allowed", { status: 405 });
	}

	const raw = await req.text();
	const svix = parseSvixHeaders(req);
	const secret = process.env.RESEND_WEBHOOK_SECRET;
	if (!svix || !(await verifyResendWebhookPayload(raw, svix, secret))) {
		return new Response("Invalid signature", { status: 401 });
	}

	let parsed: ResendWebhookBody;
	try {
		parsed = JSON.parse(raw) as ResendWebhookBody;
	}
	catch {
		return new Response("Invalid JSON", { status: 400 });
	}

	if (parsed.type !== "email.received") {
		return new Response(null, { status: 200 });
	}

	const emailId = parsed.data?.email_id;
	if (!emailId) {
		return new Response(null, { status: 200 });
	}

	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		return new Response("Missing RESEND_API_KEY", { status: 500 });
	}

	const r = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
		headers: { Authorization: `Bearer ${apiKey}` },
	});
	if (!r.ok) {
		const errText = await r.text();
		return new Response(`Resend receiving API: ${errText}`, { status: 502 });
	}

	const emailJson = (await r.json()) as Record<string, unknown>;
	const fromHeader = String(emailJson.from ?? "");
	const toField = emailJson.to;
	const toAddresses = Array.isArray(toField) ? toField.map(String) : [];
	const subject = String(emailJson.subject ?? "");
	const bodyText = pickPlainBody(
		typeof emailJson.text === "string" ? emailJson.text : undefined,
		typeof emailJson.html === "string" ? emailJson.html : undefined,
	);

	await ctx.runMutation(internal.requestMessages.ingestInboundEmail, {
		resendEmailId: emailId,
		fromHeader,
		toAddresses,
		subject,
		bodyText,
	});

	return new Response(null, { status: 200 });
});
