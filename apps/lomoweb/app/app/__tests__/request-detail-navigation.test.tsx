import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getFunctionName } from "convex/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RequestDetailView } from "../requests/[id]/request-detail-view";

const mocks = vi.hoisted(() => ({
	cancel: vi.fn(),
	complete: vi.fn(),
	decline: vi.fn(),
	document: {
		_id: "request-1",
		category: "food",
		details: "A grocery delivery would help.",
		status: "pending",
		summary: "Need groceries",
		title: "Need groceries",
	},
	push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	useParams: () => ({ id: "request-1" }),
	useRouter: () => ({ push: mocks.push }),
}));

vi.mock("convex/react", () => ({
	useMutation: (reference: Parameters<typeof getFunctionName>[0]) => {
		const name = getFunctionName(reference);
		if (name.includes("cancel")) {
			return mocks.cancel;
		}
		if (name.includes("requesterDeclineMatch")) {
			return mocks.decline;
		}
		return mocks.complete;
	},
	useQuery: (reference: Parameters<typeof getFunctionName>[0]) => {
		const name = getFunctionName(reference);
		return name.includes("getOfferHelperPreview") ? null : mocks.document;
	},
}));

vi.mock("@/lib/hooks/use-request-messages", () => ({
	usePostRequestMessage: () => vi.fn(),
	useRequestMessages: () => [],
	useRequestRelayAddress: () => ({ relayAddress: null }),
}));

vi.mock("@/lib/hooks/use-user-profile", () => ({
	useMyProfileRow: () => null,
}));

const BACK_TO_REQUESTS = /back to requests/i;

describe("request detail navigation", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.spyOn(window, "confirm").mockReturnValue(true);
		mocks.document = {
			_id: "request-1",
			category: "food",
			details: "A grocery delivery would help.",
			status: "pending",
			summary: "Need groceries",
			title: "Need groceries",
		};
	});

	it("returns to My Requests from the unavailable request state", () => {
		mocks.document = null as never;
		render(<RequestDetailView />);

		fireEvent.click(screen.getByRole("button", { name: BACK_TO_REQUESTS }));

		expect(mocks.push).toHaveBeenCalledWith("/app/my-requests");
	});

	it("returns to My Requests from a request detail", () => {
		render(<RequestDetailView />);

		fireEvent.click(screen.getByRole("button", { name: BACK_TO_REQUESTS }));

		expect(mocks.push).toHaveBeenCalledWith("/app/my-requests");
	});

	it.each([
		["Cancel request", "pending"],
		["Decline match", "awaiting_requester_acceptance"],
		["Mark complete", "in_progress"],
	])("returns to My Requests after %s", async (action, status) => {
		mocks.document.status = status;
		render(<RequestDetailView />);

		fireEvent.click(screen.getByRole("button", { name: action }));

		await waitFor(() => {
			expect(mocks.push).toHaveBeenCalledWith("/app/my-requests");
		});
	});
});
