import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeDashboardPanel } from "../home-dashboard-panel";

const SUPPORT_IN_PROGRESS_HEADING = /support in progress/i;
const MY_REQUESTS_HEADING = /my requests for support/i;

describe("homeDashboardPanel empty sections", () => {
	it("hides empty support and pending sections when there are no items", () => {
		const dashboard = {
			active: [],
			pendingMine: [],
			pendingMineTotal: 0,
			openPreview: [],
			openTotal: 0,
			canHelpNow: false,
		} as any;

		render(
			<HomeDashboardPanel
				dashboard={dashboard}
				onViewAllMine={vi.fn()}
				onViewAllOpen={vi.fn()}
				onNewRequest={vi.fn()}
			/>,
		);

		expect(screen.queryByRole("heading", { name: SUPPORT_IN_PROGRESS_HEADING })).not.toBeInTheDocument();
		expect(screen.queryByRole("heading", { name: MY_REQUESTS_HEADING })).not.toBeInTheDocument();
	});
});
