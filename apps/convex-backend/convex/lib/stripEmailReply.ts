/**
 * Keep only the new reply text from an inbound email, dropping quoted thread history.
 */

const CRLF_RE = /\r\n/g;
const CR_RE = /\r/g;

const CUT_PATTERNS: RegExp[] = [
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

const QUOTE_LINE_RE = /\n> ?/;
const TRAILING_SEPARATOR_RE = /\n----[\t\v\f\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\n[\s\S]*$/;
const TRAILING_REPLY_NOTICE_RE = /\nReply to this email \(plain text\) to continue the conversation\.[\s\S]*$/i;
const TRAILING_RECEIVING_RE = /\n---\s*\nYou're receiving this through LoMo[\s\S]*$/i;
const TRAILING_CAN_REPLY_RE = /\n---\s*\nYou can also reply to this email[\s\S]*$/i;
const TRAILING_MATCH_RE = /\nYou can also reply to this email \(plain text\) to message your match\.[\s\S]*$/i;

export function extractNewReplyText(raw: string): string {
	let text = raw.replace(CRLF_RE, "\n").replace(CR_RE, "\n");

	let cutAt = text.length;
	for (const pattern of CUT_PATTERNS) {
		const match = pattern.exec(text);
		if (match && match.index < cutAt) {
			cutAt = match.index;
		}
	}

	// Plain `>` quote blocks (no "On … wrote" header)
	const quoteLine = text.search(QUOTE_LINE_RE);
	if (quoteLine !== -1 && quoteLine < cutAt) {
		cutAt = quoteLine;
	}

	text = text.slice(0, cutAt).trim();

	// Trailing LoMo boilerplate if it wasn't preceded by a quote marker
	text = text.replace(TRAILING_SEPARATOR_RE, "").trim();
	text = text.replace(TRAILING_REPLY_NOTICE_RE, "").trim();
	text = text.replace(TRAILING_RECEIVING_RE, "").trim();
	text = text.replace(TRAILING_CAN_REPLY_RE, "").trim();
	text = text.replace(TRAILING_MATCH_RE, "").trim();

	return text;
}
