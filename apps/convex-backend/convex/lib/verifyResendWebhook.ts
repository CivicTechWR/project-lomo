/**
 * Verify Resend webhook signatures (Svix). See
 * https://resend.com/docs/dashboard/webhooks/verify-webhooks-requests
 */

const SVIX_TOLERANCE_SEC = 300;

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
	if (a.length !== b.length) {
		return false;
	}
	let out = 0;
	for (let i = 0; i < a.length; i++) {
		out |= a[i]! ^ b[i]!;
	}
	return out === 0;
}

function base64Decode(b64: string): Uint8Array | null {
	try {
		const bin = atob(b64);
		const out = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) {
			out[i] = bin.charCodeAt(i);
		}
		return out;
	}
	catch {
		return null;
	}
}

function bytesToBase64(u8: Uint8Array): string {
	let bin = "";
	for (let i = 0; i < u8.length; i++) {
		bin += String.fromCharCode(u8[i]!);
	}
	return btoa(bin);
}

export function parseSvixHeaders(req: Request): {
	id: string;
	timestamp: string;
	signature: string;
} | null {
	const id = req.headers.get("svix-id");
	const timestamp = req.headers.get("svix-timestamp");
	const signature = req.headers.get("svix-signature");
	if (!id || !timestamp || !signature) {
		return null;
	}
	return { id, timestamp, signature };
}

export async function verifyResendWebhookPayload(
	payload: string,
	headers: { id: string; timestamp: string; signature: string },
	secret: string | undefined,
): Promise<boolean> {
	if (!secret || !secret.startsWith("whsec_")) {
		return false;
	}
	const tsNum = Number(headers.timestamp);
	if (!Number.isFinite(tsNum)) {
		return false;
	}
	const now = Math.floor(Date.now() / 1000);
	if (Math.abs(now - tsNum) > SVIX_TOLERANCE_SEC) {
		return false;
	}

	let keyBytes: Uint8Array;
	try {
		keyBytes = Uint8Array.from(atob(secret.slice(6)), c => c.charCodeAt(0));
	}
	catch {
		return false;
	}

	// Copy so `buffer` is a plain ArrayBuffer (SubtleCrypto importKey typing).
	const rawKey = new Uint8Array(keyBytes);

	const signedContent = `${headers.id}.${headers.timestamp}.${payload}`;
	const cryptoKey = await crypto.subtle.importKey(
		"raw",
		rawKey,
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const sig = new Uint8Array(
		await crypto.subtle.sign(
			"HMAC",
			cryptoKey,
			new TextEncoder().encode(signedContent),
		),
	);
	const expectedB64 = bytesToBase64(sig);

	const chunks = headers.signature.trim().split(/\s+/);
	for (const chunk of chunks) {
		const comma = chunk.indexOf(",");
		if (comma === -1) {
			continue;
		}
		const version = chunk.slice(0, comma);
		const sigB64 = chunk.slice(comma + 1);
		if (version !== "v1" || !sigB64) {
			continue;
		}
		const decoded = base64Decode(sigB64);
		if (!decoded) {
			continue;
		}
		if (timingSafeEqual(decoded, sig)) {
			return true;
		}
		// Some stacks compare base64 strings; byte compare above is canonical.
		if (sigB64 === expectedB64) {
			return true;
		}
	}
	return false;
}
