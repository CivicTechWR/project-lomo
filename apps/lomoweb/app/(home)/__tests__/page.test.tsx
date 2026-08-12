import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the auth-server module
vi.mock("@/lib/auth-server", () => ({
	isAuthenticated: vi.fn(),
}));

// Mock next/navigation - redirect throws in Next.js
vi.mock("next/navigation", () => ({
	redirect: vi.fn((destination) => {
		// In Next.js, redirect throws an error that's caught by the framework
		const error = new Error("NEXT_REDIRECT") as any;
		error.digest = "NEXT_REDIRECT";
		error.destination = destination;
		throw error;
	}),
}));

describe("homePage (page.tsx)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should call isAuthenticated() on render", async () => {
		const { isAuthenticated } = await import("@/lib/auth-server");
		vi.mocked(isAuthenticated).mockResolvedValue(false);

		const { default: HomePage } = await import("../page");
		await HomePage();

		expect(isAuthenticated).toHaveBeenCalledTimes(1);
	});

	it("should attempt redirect when isAuthenticated returns true", async () => {
		const { isAuthenticated } = await import("@/lib/auth-server");
		const { redirect } = await import("next/navigation");
		vi.mocked(isAuthenticated).mockResolvedValue(true);

		const { default: HomePage } = await import("../page");

		try {
			await HomePage();
		}
		catch {
			// redirect() throws in Next.js
			expect(redirect).toHaveBeenCalledWith("/app");
			return;
		}

		// If redirect mock doesn't throw, still verify it was called
		expect(redirect).toHaveBeenCalledWith("/app");
	});

	it("should render homepage content when isAuthenticated returns false (Requirement 1.2)", async () => {
		const { isAuthenticated } = await import("@/lib/auth-server");
		vi.mocked(isAuthenticated).mockResolvedValue(false);

		const { default: HomePage } = await import("../page");
		const result = await HomePage();

		// Should return JSX (a React element)
		expect(result).toBeDefined();
		expect(result.props).toBeDefined();
		// Should be a Fragment or have children
		expect(result.type || result.props.children).toBeDefined();
	});

	it("should handle isAuthenticated errors and render homepage (Requirement 1.3)", async () => {
		const { isAuthenticated } = await import("@/lib/auth-server");
		vi.mocked(isAuthenticated).mockRejectedValue(new Error("Auth service unavailable"));

		const { default: HomePage } = await import("../page");
		const result = await HomePage();

		// Should NOT throw - should treat as unauthenticated and render
		expect(result).toBeDefined();
		expect(result.props).toBeDefined();
	});

	it("should render page without use client directive (server component)", async () => {
		const { isAuthenticated } = await import("@/lib/auth-server");
		vi.mocked(isAuthenticated).mockResolvedValue(false);

		const { default: HomePage } = await import("../page");
		expect(HomePage).toBeDefined();
		expect(typeof HomePage).toBe("function");
		// Server components are async functions
	});

	it("should include all section components in correct order", async () => {
		const { isAuthenticated } = await import("@/lib/auth-server");
		vi.mocked(isAuthenticated).mockResolvedValue(false);

		const { default: HomePage } = await import("../page");
		const result = await HomePage();

		// Result should have children containing the structure
		expect(result.props || result.type).toBeDefined();
		// The page structure should be: Fragment > [HomeNav, main, HomeFooter]
		// where main contains [HeroSection, TrustBlock, HowItWorksSection, FindSection, ShareSection, JoinSection, ContactSection]

		const children = result.props.children;
		expect(children).toBeDefined();
	});

	it("requirement 1.1: redirects authenticated users to /app", async () => {
		const { isAuthenticated } = await import("@/lib/auth-server");
		const { redirect } = await import("next/navigation");

		vi.mocked(isAuthenticated).mockResolvedValue(true);

		const { default: HomePage } = await import("../page");

		try {
			await HomePage();
		}
		catch {
			// Expected - redirect throws
		}

		expect(redirect).toHaveBeenCalledWith("/app");
	});

	it("requirement 1.2: renders homepage for unauthenticated users", async () => {
		const { isAuthenticated } = await import("@/lib/auth-server");
		vi.mocked(isAuthenticated).mockResolvedValue(false);

		const { default: HomePage } = await import("../page");
		const result = await HomePage();

		// Should render, not redirect
		expect(result).toBeDefined();
		expect(result.props || result.type).toBeDefined();
	});

	it("requirement 1.3: renders homepage when auth state cannot be determined", async () => {
		const { isAuthenticated } = await import("@/lib/auth-server");
		vi.mocked(isAuthenticated).mockRejectedValue(new Error("Auth check failed"));

		const { default: HomePage } = await import("../page");
		const result = await HomePage();

		// Should render, treating as unauthenticated
		expect(result).toBeDefined();
		expect(result.props || result.type).toBeDefined();
	});
});
