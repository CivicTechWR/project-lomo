import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	signOut: vi.fn(),
	assign: vi.fn(),
}));

vi.mock("@/lib/auth-client", () => ({
	authClient: {
		signOut: mocks.signOut,
	},
}));

describe("signOutToSignIn", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.signOut.mockResolvedValue(undefined);
		vi.stubGlobal("location", { assign: mocks.assign });
	});

	it("ends the session and opens a fresh sign-in page", async () => {
		const { signOutToSignIn } = await import("../sign-out");
		await signOutToSignIn();

		expect(mocks.signOut).toHaveBeenCalledOnce();
		expect(mocks.assign).toHaveBeenCalledWith("/signin");
	});
});
