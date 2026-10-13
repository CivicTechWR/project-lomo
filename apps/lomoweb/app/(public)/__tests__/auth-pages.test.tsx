import { beforeEach, describe, expect, it, vi } from "vitest";
import SignInPage from "../signin/page";
import SignUpPage from "../signup/page";

const mocks = vi.hoisted(() => ({
	isAuthenticated: vi.fn(),
	redirect: vi.fn((path: string) => {
		throw new Error(`NEXT_REDIRECT:${path}`);
	}),
}));

vi.mock("@/lib/auth-server", () => ({
	isAuthenticated: mocks.isAuthenticated,
}));

vi.mock("../signin/signin-form", () => ({
	SignInForm: () => null,
}));

vi.mock("../signup/signup-form", () => ({
	SignUpForm: () => null,
}));

vi.mock("next/navigation", () => ({
	redirect: mocks.redirect,
}));

describe("authentication pages", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it.each([
		["sign in", SignInPage],
		["sign up", SignUpPage],
	])("redirects authenticated visitors from %s to /app", async (_label, Page) => {
		mocks.isAuthenticated.mockResolvedValue(true);

		await expect(Promise.resolve().then(() => Page())).rejects.toThrow("NEXT_REDIRECT:/app");
		expect(mocks.redirect).toHaveBeenCalledWith("/app");
	});

	it.each([
		["sign in", SignInPage],
		["sign up", SignUpPage],
	])("renders the %s page for unauthenticated visitors", async (_label, Page) => {
		mocks.isAuthenticated.mockResolvedValue(false);

		await expect(Promise.resolve().then(() => Page())).resolves.toBeTruthy();
		expect(mocks.redirect).not.toHaveBeenCalled();
	});
});
