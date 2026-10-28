import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	isAuthenticated: vi.fn(),
	redirect: vi.fn((destination: string) => {
		const error = new Error("NEXT_REDIRECT") as Error & { destination: string };
		error.destination = destination;
		throw error;
	}),
}));

vi.mock("@/lib/auth-server", () => ({
	isAuthenticated: mocks.isAuthenticated,
}));

vi.mock("next/navigation", () => ({
	redirect: mocks.redirect,
}));

describe("redirectIfAuthenticated", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("sends a signed-in visitor home with the already-logged-in notice", async () => {
		mocks.isAuthenticated.mockResolvedValue(true);
		const { redirectIfAuthenticated } = await import("../redirect-if-authenticated");

		await expect(redirectIfAuthenticated()).rejects.toThrow("NEXT_REDIRECT");
		expect(mocks.redirect).toHaveBeenCalledWith("/app?notice=already-signed-in");
	});

	it("leaves a signed-out visitor on the auth page", async () => {
		mocks.isAuthenticated.mockResolvedValue(false);
		const { redirectIfAuthenticated } = await import("../redirect-if-authenticated");

		await redirectIfAuthenticated();
		expect(mocks.redirect).not.toHaveBeenCalled();
	});

	it("treats an auth check failure as signed out", async () => {
		mocks.isAuthenticated.mockRejectedValue(new Error("Auth unavailable"));
		const { redirectIfAuthenticated } = await import("../redirect-if-authenticated");

		await redirectIfAuthenticated();
		expect(mocks.redirect).not.toHaveBeenCalled();
	});
});
