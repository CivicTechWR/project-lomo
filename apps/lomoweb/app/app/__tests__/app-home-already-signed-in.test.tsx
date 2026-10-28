import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	replace: vi.fn(),
	preloadAuthQuery: vi.fn().mockResolvedValue("preloaded-user"),
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({ replace: mocks.replace }),
	usePathname: () => "/app",
}));

vi.mock("@/lib/sign-out", () => ({
	signOutToSignIn: vi.fn(),
}));

vi.mock("@/lib/auth-server", () => ({
	preloadAuthQuery: mocks.preloadAuthQuery,
}));

vi.mock("../requests-home", () => ({
	RequestsHome: () => <div>Requests home</div>,
}));

const ALREADY_LOGGED_IN = /already logged in/i;

describe("app home already-signed-in notice", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("shows the notice when sign-in or sign-up sent the visitor home", async () => {
		const { default: AppPage } = await import("../page");
		const page = await AppPage({
			searchParams: Promise.resolve({ notice: "already-signed-in" }),
		});

		render(page);
		expect(screen.getByRole("status")).toHaveTextContent(ALREADY_LOGGED_IN);
	});

	it("hides the notice on a normal home visit", async () => {
		const { default: AppPage } = await import("../page");
		const page = await AppPage({
			searchParams: Promise.resolve({}),
		});

		render(page);
		expect(screen.queryByRole("status")).not.toBeInTheDocument();
		expect(screen.getByText("Requests home")).toBeInTheDocument();
	});
});
