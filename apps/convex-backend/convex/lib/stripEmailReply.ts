/**
 * Keep only the new reply text from an inbound email, dropping quoted thread history.
 */
export function extractNewReplyText(raw: string): string {
	let text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

	const cutPatterns: RegExp[] = [
		// Gmail, Apple Mail, many mobile clients
		/\nOn .+? wrote:\s*\n/i,
		// Outlook / some clients
		/\n-{5,}\s*Original Message\s*-{5,}\s*\n/i,
		/\nFrom:\s.+\n(?:Sent|Date):\s/i,
		/\n_{10,}\s*\n/,
		// Current LoMo message email footer
		/\n----\s*\n/,
		/\nReply to this email \(plain text\) to continue the conversation\./i,
		/\nOpen the conversation: /i,
		// Legacy LoMo relay footers
		/\n---\s*\nYou're receiving this through LoMo/i,
		/\n---\s*\nYou can also reply to this email/i,
		/\nYou can also reply to this email \(plain text\) to message your match\./i,
	];

	let cutAt = text.length;
	for (const pattern of cutPatterns) {
		const match = pattern.exec(text);
		if (match && match.index < cutAt) {
			cutAt = match.index;
		}
	}

	// Plain `>` quote blocks (no "On … wrote" header)
	const quoteLine = text.search(/\n> ?/);
	if (quoteLine !== -1 && quoteLine < cutAt) {
		cutAt = quoteLine;
	}

	text = text.slice(0, cutAt).trim();

	// Trailing LoMo boilerplate if it wasn't preceded by a quote marker
	text = text.replace(/\n----[\t\v\f\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\n[\s\S]*$/, "").trim();
	text = text.replace(
		/\nReply to this email \(plain text\) to continue the conversation\.[\s\S]*$/i,
		"",
	).trim();
	text = text.replace(
		/\n---\s*\nYou're receiving this through LoMo[\s\S]*$/i,
		"",
	).trim();
	text = text.replace(
		/\n---\s*\nYou can also reply to this email[\s\S]*$/i,
		"",
	).trim();
	text = text.replace(
		/\nYou can also reply to this email \(plain text\) to message your match\.[\s\S]*$/i,
		"",
	).trim();

	return text;
}
