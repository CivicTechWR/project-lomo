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

vi.mock("../signin/signin-form", () => ({
	SignInForm: () => null,
}));

vi.mock("../signup/signup-form", () => ({
	SignUpForm: () => null,
}));

describe("sign-in and sign-up pages", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("redirects a signed-in visitor away from sign-in", async () => {
		mocks.isAuthenticated.mockResolvedValue(true);
		const { default: SignInPage } = await import("../signin/page");

		await expect(SignInPage()).rejects.toThrow("NEXT_REDIRECT");
		expect(mocks.redirect).toHaveBeenCalledWith("/app?notice=already-signed-in");
	});

	it("redirects a signed-in visitor away from sign-up", async () => {
		mocks.isAuthenticated.mockResolvedValue(true);
		const { default: SignUpPage } = await import("../signup/page");

		await expect(SignUpPage()).rejects.toThrow("NEXT_REDIRECT");
		expect(mocks.redirect).toHaveBeenCalledWith("/app?notice=already-signed-in");
	});

	it("renders sign-in for a signed-out visitor", async () => {
		mocks.isAuthenticated.mockResolvedValue(false);
		const { default: SignInPage } = await import("../signin/page");

		const page = await SignInPage();
		expect(page).toBeDefined();
		expect(mocks.redirect).not.toHaveBeenCalled();
	});

	it("renders sign-up for a signed-out visitor", async () => {
		mocks.isAuthenticated.mockResolvedValue(false);
		const { default: SignUpPage } = await import("../signup/page");

		const page = await SignUpPage();
		expect(page).toBeDefined();
		expect(mocks.redirect).not.toHaveBeenCalled();
	});
});
