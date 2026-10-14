import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	isAuthenticated: vi.fn(),
	redirect: vi.fn((path: string) => {
		throw new Error(`NEXT_REDIRECT:${path}`);
	}),
}));

vi.mock("@/lib/auth-server", () => ({
	isAuthenticated: mocks.isAuthenticated,
}));

vi.mock("@/lib/auth-client", () => ({
	AUTH_CONNECTION_ERROR_MESSAGE: "",
	authClient: {},
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

const authPages = [
	["sign in", () => import("../signin/page").then(module => module.default)],
	["sign up", () => import("../signup/page").then(module => module.default)],
] as const;

describe("authentication pages", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it.each(authPages)("redirects authenticated visitors from %s to /app", async (_label, loadPage) => {
		mocks.isAuthenticated.mockResolvedValue(true);
		const Page = await loadPage();

		await expect(Promise.resolve().then(() => Page())).rejects.toThrow("NEXT_REDIRECT:/app");
		expect(mocks.redirect).toHaveBeenCalledWith("/app");
	});

	it.each(authPages)("renders the %s page for unauthenticated visitors", async (_label, loadPage) => {
		mocks.isAuthenticated.mockResolvedValue(false);
		const Page = await loadPage();

		await expect(Promise.resolve().then(() => Page())).resolves.toBeTruthy();
		expect(mocks.redirect).not.toHaveBeenCalled();
	});
});
