import { ConvexError } from "convex/values";
import { describe, expect, it } from "vitest";
import { mutationErrorMessage } from "../mutation-error-message";

const FALLBACK = "Could not delete your account.";

describe("mutationErrorMessage", () => {
	it("uses the ConvexError data instead of the wrapped stack", () => {
		const error = new ConvexError<string>(
			"[CONVEX M(users:deleteMyAccount)] [Request ID: abc] Server Error\nUncaught ConvexError: Incorrect password.\n    at handler (../../convex/users/mutations.ts:121:5)\n",
		);
		error.data = "Incorrect password.";

		expect(mutationErrorMessage(error, FALLBACK)).toBe("Incorrect password.");
	});

	it("keeps only the thrown sentence from a plain Convex wrapper", () => {
		const error = new Error(
			"[CONVEX M(users:deleteMyAccount)] [Request ID: abc] Server Error\nUncaught Error: Incorrect password.\n    at handler (../../convex/users/mutations.ts:121:5)\n\n  Called by client",
		);

		expect(mutationErrorMessage(error, FALLBACK)).toBe("Incorrect password.");
	});

	it("falls back when the error has no readable sentence", () => {
		expect(mutationErrorMessage(new Error("boom"), FALLBACK)).toBe(FALLBACK);
		expect(mutationErrorMessage("nope", FALLBACK)).toBe(FALLBACK);
	});
});
