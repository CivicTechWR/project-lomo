import { render, screen } from "@testing-library/react";
import { getFunctionName } from "convex/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomeModeProvider } from "@/lib/home-mode-context";
import { AppSidebar } from "../app-sidebar";

let currentPathname = "/app";

vi.mock("next/navigation", () => ({
	usePathname: () => currentPathname,
	useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/lib/auth-client", () => ({
	authClient: { signOut: vi.fn() },
}));

const mocks = vi.hoisted(() => ({
	isAdmin: false,
	profileRow: { canHelpNow: true } as Record<string, unknown> | null | undefined,
}));

vi.mock("convex/react", () => ({
	useQuery: (reference: Parameters<typeof getFunctionName>[0]) => {
		const name = getFunctionName(reference);
		if (name.includes("isAdmin")) {
			return mocks.isAdmin;
		}
		if (name.includes("getMyProfileRow")) {
			return mocks.profileRow;
		}
		return undefined;
	},
}));

function renderSidebar() {
	return render(
		<HomeModeProvider>
			<AppSidebar />
		</HomeModeProvider>,
	);
}

const HOME_REGEX = /^home$/i;
const ADMIN_REGEX = /^admin$/i;
const BACK_TO_APP_REGEX = /back to app/i;
const DASHBOARD_REGEX = /dashboard/i;
const USERS_REGEX = /users/i;

beforeEach(() => {
	sessionStorage.clear();
	currentPathname = "/app";
	mocks.isAdmin = false;
	mocks.profileRow = { canHelpNow: true };
});

describe("responsive navigation tiers & admin exit", () => {
	it("renders regular app navigation across desktop, tablet, and mobile", () => {
		currentPathname = "/app";
		renderSidebar();

		// Home tab appears on all 3 tiers
		const homeLinks = screen.getAllByRole("link", { name: HOME_REGEX });
		expect(homeLinks.length).toBe(3);

		// Admin link should not appear when user is not admin
		expect(screen.queryByRole("link", { name: ADMIN_REGEX })).toBeNull();
		expect(screen.queryByRole("link", { name: BACK_TO_APP_REGEX })).toBeNull();
	});

	it("shows admin tab link on regular routes when user is an admin", () => {
		currentPathname = "/app";
		mocks.isAdmin = true;

		renderSidebar();

		// Admin link should appear in desktop and tablet rails
		const adminLinks = screen.getAllByRole("link", { name: ADMIN_REGEX });
		expect(adminLinks.length).toBe(2);
	});

	it("provides 'Back to app' exit link on laptop, tablet, and mobile when on admin routes", () => {
		currentPathname = "/app/admin";
		mocks.isAdmin = true;

		renderSidebar();

		// "Back to app" / "Back to App" exit link should appear across all 3 tiers
		const backToAppLinks = screen.getAllByRole("link", { name: BACK_TO_APP_REGEX });
		expect(backToAppLinks.length).toBe(3);

		// Admin tabs (Dashboard, Requests, Users, Settings) should be present
		expect(screen.getAllByRole("link", { name: DASHBOARD_REGEX }).length).toBeGreaterThan(0);
		expect(screen.getAllByRole("link", { name: USERS_REGEX }).length).toBeGreaterThan(0);
	});

	it("sets aria-current='page' on active tabs for current route", () => {
		currentPathname = "/app/admin/users";
		mocks.isAdmin = true;

		renderSidebar();

		const userTabs = screen.getAllByRole("link", { name: USERS_REGEX });
		for (const tab of userTabs) {
			expect(tab).toHaveAttribute("aria-current", "page");
		}
	});
});
