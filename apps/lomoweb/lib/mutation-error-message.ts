import { ConvexError } from "convex/values";

const UNCAUGHT_LINE = /Uncaught (?:ConvexError|Error):\s*([^\n]+)/;
const STACK_FRAME = /\bat\s+\S+/;

/**
 * Message safe to show after a failed Convex mutation.
 *
 * Convex puts the server sentence inside a wrapper that also includes the
 * function name and stack. Prefer `ConvexError.data` when the server sent one,
 * and otherwise keep only the thrown sentence.
 */
export function mutationErrorMessage(error: unknown, fallback: string): string {
	if (error instanceof ConvexError) {
		const data = error.data;
		if (typeof data === "string" && isHumanMessage(data)) {
			return data.trim();
		}
	}
	if (error instanceof Error) {
		const extracted = error.message.match(UNCAUGHT_LINE)?.[1];
		if (extracted && isHumanMessage(extracted)) {
			return extracted.trim();
		}
	}
	return fallback;
}

function isHumanMessage(message: string): boolean {
	const trimmed = message.trim();
	return trimmed.length > 0
		&& !trimmed.includes("[CONVEX")
		&& !trimmed.includes("\n")
		&& !STACK_FRAME.test(trimmed);
}
