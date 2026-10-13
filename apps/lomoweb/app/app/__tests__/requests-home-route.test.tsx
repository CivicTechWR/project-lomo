import { fireEvent, render, screen } from "@testing-library/react";
import { getFunctionName } from "convex/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RequestsHome } from "../requests-home";

const mocks = vi.hoisted(() => ({
	homeMode: "request_help" as "home" | "request_help" | "offer_help",
	push: vi.fn(),
	homeDashboard: {
		active: [],
		pendingMine: [],
		pendingMineTotal: 0,
		openPreview: [],
		openTotal: 0,
		canHelpNow: false,
	},
}));

const MY_REQUESTS_HEADING = /^my requests$/i;
const VIEW_ALL_MY_REQUESTS = /view all my requests/i;

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mocks.push }),
}));

vi.mock("@convex-dev/better-auth/nextjs/client", () => ({
	usePreloadedAuthQuery: () => ({ id: "user-1" }),
}));

vi.mock("convex/react", () => ({
	useQuery: (reference: Parameters<typeof getFunctionName>[0]) => {
		const name = getFunctionName(reference);
		if (name.includes("homeDashboard")) {
			return mocks.homeDashboard;
		}
		if (name.includes("isAdmin")) {
			return false;
		}
		return [];
	},
}));

vi.mock("@/lib/home-mode-context", () => ({
	useHomeMode: () => ({
		mode: mocks.homeMode,
		setMode: vi.fn(),
	}),
}));

vi.mock("../home-dashboard-panel", () => ({
	HomeDashboardPanel: ({
		onViewAllMine,
	}: {
		onViewAllMine: () => void;
	}) => (
		<button type="button" onClick={onViewAllMine}>
			View all my requests
		</button>
	),
	RequestCardLink: () => null,
}));

describe("requestsHome routes", () => {
	beforeEach(() => {
		mocks.homeMode = "request_help";
		mocks.push.mockClear();
	});

	it("shows Home at /app even when a stale session mode is request_help", () => {
		render(<RequestsHome preloadedUser={{} as never} view="home" />);

		expect(screen.queryByRole("heading", { name: MY_REQUESTS_HEADING })).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: VIEW_ALL_MY_REQUESTS })).toBeInTheDocument();
	});

	it("shows My Requests at its own route regardless of the saved mode", () => {
		mocks.homeMode = "home";

		render(<RequestsHome preloadedUser={{} as never} view="my-requests" />);

		expect(screen.getByRole("heading", { name: MY_REQUESTS_HEADING })).toBeInTheDocument();
	});

	it("opens the dedicated My Requests route from the Home dashboard", () => {
		mocks.homeMode = "home";

		render(<RequestsHome preloadedUser={{} as never} view="home" />);
		fireEvent.click(screen.getByRole("button", { name: VIEW_ALL_MY_REQUESTS }));

		expect(mocks.push).toHaveBeenCalledWith("/app/my-requests");
	});
});
