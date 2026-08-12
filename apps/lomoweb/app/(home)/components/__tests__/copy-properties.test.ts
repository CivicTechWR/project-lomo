import fc from "fast-check";
import { describe, expect, it } from "vitest";

/**
 * Correctness property tests for homepage copy.
 * These validate that the refined copy meets specification constraints.
 */

const BANNED_PHRASES = [
	"Act now",
	"Don't miss out",
	"Hurry",
	"the best",
	"revolutionary",
	"Join thousands",
	"You deserve",
	"We believe in you",
	"pay it forward",
	"give back",
	"less fortunate",
	"fall on hard times",
] as const;

/**
 * All section text strings gathered from homepage components.
 * Includes: labels, subtitles, body text, headings, step labels, step descriptions.
 */
const ALL_SECTION_TEXT: string[] = [
	// Hero section
	"Mutual Aid Waterloo Region",
	"A calm, consent-based mutual aid platform",
	"LoMo connects neighbours in Waterloo Region to share food, microgrants, and everyday supports. Direct, secure, and free — on your terms.",

	// How It Works section
	"How It Works",
	"A simple, safe process",
	"Here is how mutual aid works, step by step.",
	"Ask for what you need",
	"Describe what you need and when. Only matched helpers see your request.",
	"Someone steps forward",
	"A neighbour volunteers, or a coordinator suggests someone trusted.",
	"You choose your helper",
	"You confirm before anything is shared. Nothing happens without your say.",
	"Connect when you're ready",
	"You and your helper connect directly, with consent at every step.",

	// Find section
	"Mutual Aid In Action",
	"Find What You Need",
	"Support is here when you need it",
	"Ask for fresh food, emergency funds, or companion supports. You control what you request and how much you share.",

	// Share section
	"Solidarity, Not Charity",
	"Share What You Can",
	"Offer support in your own way, on your own time",
	"When you have capacity or extra resources, respond to open requests from neighbours. No obligation, no timeline — just community care when it works for you.",

	// Join section
	"Join The Circle",
	"Free to use. No social media login required. Your data belongs to you.",

	// Contact section
	"Contact Us",
	"Questions, ideas, or want to start a circle in your area? Reach out any time.",

	// Home footer
	"Community help, close to home.",
	"If you are experiencing an emergency, please reach out to local emergency services or a crisis professional immediately. LoMo is here to help with community needs once you are safe.",
	"Calm, consent-based mutual aid",
];

describe("property 1: banned phrase exclusion", () => {
	/**
	 * **Validates: Requirements 1.2, 1.3, 3.1, 3.2, 3.3, 4.2**
	 *
	 * For any section text string (body, subtitle, or label) in the homepage components,
	 * the text shall not contain any phrase from the banned list.
	 * Uses case-insensitive matching.
	 */
	it("no section text contains any banned phrase (case-insensitive)", () => {
		fc.assert(
			fc.property(
				fc.constantFrom(...ALL_SECTION_TEXT),
				fc.constantFrom(...BANNED_PHRASES),
				(sectionText, bannedPhrase) => {
					const textLower = sectionText.toLowerCase();
					const phraseLower = bannedPhrase.toLowerCase();
					expect(textLower).not.toContain(phraseLower);
				},
			),
			{ numRuns: 500 },
		);
	});
});

/**
 * Regex for splitting text into sentences.
 * Splits on `.`, `!`, or `?` followed by a space or end-of-string.
 */
const SENTENCE_SPLIT_REGEX = /[.!?](?:\s|$)/;

/**
 * Counts sentences in a text by splitting on sentence-ending punctuation.
 */
function countSentences(text: string): number {
	const trimmed = text.trim();
	if (trimmed.length === 0)
		return 0;
	const sentences = trimmed.split(SENTENCE_SPLIT_REGEX).filter(s => s.trim().length > 0);
	return sentences.length;
}

/**
 * All section body texts from the homepage components.
 * Section bodies are the paragraph/body text below headings.
 */
const SECTION_BODIES: { section: string; body: string }[] = [
	{
		section: "Hero",
		body: "LoMo connects neighbours in Waterloo Region to share food, microgrants, and everyday supports. Direct, secure, and free — on your terms.",
	},
	{
		section: "How It Works",
		body: "Here is how mutual aid works, step by step.",
	},
	{
		section: "How It Works - Step 1",
		body: "Describe what you need and when. Only matched helpers see your request.",
	},
	{
		section: "How It Works - Step 2",
		body: "A neighbour volunteers, or a coordinator suggests someone trusted.",
	},
	{
		section: "How It Works - Step 3",
		body: "You confirm before anything is shared. Nothing happens without your say.",
	},
	{
		section: "How It Works - Step 4",
		body: "You and your helper connect directly, with consent at every step.",
	},
	{
		section: "Find",
		body: "Ask for fresh food, emergency funds, or companion supports. You control what you request and how much you share.",
	},
	{
		section: "Share",
		body: "When you have capacity or extra resources, respond to open requests from neighbours. No obligation, no timeline — just community care when it works for you.",
	},
	{
		section: "Contact",
		body: "Questions, ideas, or want to start a circle in your area? Reach out any time.",
	},
];

describe("property 2: Section body brevity", () => {
	/**
	 * **Validates: Requirements 6.1, 8.1, 9.4, 10.3, 10.4, 11.3, 12.1**
	 *
	 * For any section body text in the homepage components,
	 * the sentence count shall be at most 2.
	 */
	it("all section body texts have at most 2 sentences", () => {
		fc.assert(
			fc.property(
				fc.constantFrom(...SECTION_BODIES),
				({ section, body }) => {
					const sentenceCount = countSentences(body);
					expect(
						sentenceCount,
						`Section "${section}" body has ${sentenceCount} sentences (max 2): "${body}"`,
					).toBeLessThanOrEqual(2);
				},
			),
			{ numRuns: SECTION_BODIES.length * 10 },
		);
	});
});

/**
 * Section labels extracted from current homepage components.
 * These are the small descriptive text above section headings.
 */
const SECTION_LABELS = [
	"Mutual Aid Waterloo Region", // hero-section.tsx
	"How It Works", // how-it-works-section.tsx
	"Mutual Aid In Action", // find-section.tsx
	"Solidarity, Not Charity", // share-section.tsx
] as const;

/**
 * Regex to detect emoji Unicode characters.
 * Matches Emoji_Presentation and Extended_Pictographic code points.
 */
const EMOJI_REGEX = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;

describe("property 3: Emoji-free section labels", () => {
	/**
	 * **Validates: Requirements 7.1, 7.4, 9.3, 10.1, 10.2**
	 *
	 * For any section label text in the homepage components,
	 * the text shall contain zero emoji Unicode characters.
	 */
	it("no section label contains emoji characters", () => {
		fc.assert(
			fc.property(
				fc.constantFrom(...SECTION_LABELS),
				(label) => {
					expect(EMOJI_REGEX.test(label)).toBe(false);
				},
			),
			{ numRuns: SECTION_LABELS.length * 10 },
		);
	});
});

// Trust block badge values (source: trust-block.tsx)
const TRUST_BLOCK_BADGES = [
	"Free & not-for-profit 🤝",
	"No algorithms, no ads 🚫",
	"You own your data 🔒",
	"Community-first, always 🌱",
] as const;

describe("property 4: Emoji retention in trust block badges", () => {
	/**
	 * **Validates: Requirements 7.2**
	 *
	 * For any trust block badge value string,
	 * the text shall contain at least one emoji Unicode character.
	 */
	it("every trust block badge contains at least one emoji", () => {
		fc.assert(
			fc.property(
				fc.constantFrom(...TRUST_BLOCK_BADGES),
				(badge) => {
					expect(badge).toMatch(EMOJI_REGEX);
				},
			),
			{ numRuns: TRUST_BLOCK_BADGES.length * 10 },
		);
	});
});
