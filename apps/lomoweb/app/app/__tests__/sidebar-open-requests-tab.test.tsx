import { render, screen } from "@testing-library/react";
import { getFunctionName } from "convex/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomeModeProvider } from "@/lib/home-mode-context";
import { AppSidebar } from "../app-sidebar";

/**
 * Guards the Open Requests tab against the resting state.
 *
 * Turning off "I can offer support" puts a helper in Resting, which has to hide
 * Open Requests everywhere — the point of a break is not being shown work. The
 * tab is rendered twice (desktop sidebar and mobile bottom bar) from one `tabs`
 * array, so both disappear together; the assertions below count every match.
 */

const mocks = vi.hoisted(() => ({
	profileRow: null as Record<string, unknown> | null | undefined,
}));

vi.mock("next/navigation", () => ({
	usePathname: () => "/app",
	useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/lib/auth-client", () => ({
	authClient: { signOut: vi.fn() },
}));

vi.mock("convex/react", () => ({
	useQuery: (reference: Parameters<typeof getFunctionName>[0]) => {
		const name = getFunctionName(reference);
		if (name.includes("isAdmin")) {
			return false;
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

const OPEN_REQUESTS = /open requests/i;
const HOME_TAB = /^home$/i;

beforeEach(() => {
	sessionStorage.clear();
	mocks.profileRow = undefined;
});

describe("open Requests tab visibility", () => {
	it("shows the tab when the user can offer support", () => {
		mocks.profileRow = { canHelpNow: true };

		renderSidebar();

		expect(screen.getAllByRole("link", { name: OPEN_REQUESTS }).length).toBeGreaterThan(0);
	});

	it("hides the tab while resting (canHelpNow off)", () => {
		mocks.profileRow = { canHelpNow: false };

		renderSidebar();

		expect(screen.queryAllByRole("link", { name: OPEN_REQUESTS })).toHaveLength(0);
		// The rest of the nav must survive — this hides one tab, not the sidebar.
		expect(screen.getAllByRole("link", { name: HOME_TAB }).length).toBeGreaterThan(0);
	});

	it("hides the tab when canHelpNow was never set", () => {
		mocks.profileRow = {};

		renderSidebar();

		expect(screen.queryAllByRole("link", { name: OPEN_REQUESTS })).toHaveLength(0);
	});

	it("hides the tab for a blocked account even if it could otherwise help", () => {
		mocks.profileRow = { canHelpNow: true, blocked: true };

		renderSidebar();

		expect(screen.queryAllByRole("link", { name: OPEN_REQUESTS })).toHaveLength(0);
	});

	it("keeps the tab while the profile is still loading, to avoid a flicker", () => {
		mocks.profileRow = undefined;

		renderSidebar();

		expect(screen.getAllByRole("link", { name: OPEN_REQUESTS }).length).toBeGreaterThan(0);
	});

	it("hides the tab when the user has no profile row", () => {
		mocks.profileRow = null;

		renderSidebar();

		expect(screen.queryAllByRole("link", { name: OPEN_REQUESTS })).toHaveLength(0);
	});
});
