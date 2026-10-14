import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserProfile } from "../user-profile";

const mocks = vi.hoisted(() => ({
	push: vi.fn(),
}));

const BACK_TO_REQUESTS = /back to requests/i;

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mocks.push }),
}));

vi.mock("@convex-dev/better-auth/nextjs/client", () => ({
	usePreloadedAuthQuery: () => ({ email: "user@example.com" }),
}));

vi.mock("@/lib/hooks/use-user-profile", () => ({
	useMyProfileRow: () => null,
	useDeleteMyAccount: () => vi.fn(),
}));

vi.mock("@/lib/auth-client", () => ({
	authClient: { signOut: vi.fn() },
}));

vi.mock("../onboarding/safety-acknowledgment", () => ({
	SafetyAcknowledgment: () => null,
}));

describe("profile navigation", () => {
	beforeEach(() => {
		mocks.push.mockClear();
	});

	it("returns to My Requests from the profile page", () => {
		render(<UserProfile preloadedUser={{} as never} />);

		fireEvent.click(screen.getByRole("button", { name: BACK_TO_REQUESTS }));

		expect(mocks.push).toHaveBeenCalledWith("/app/my-requests");
	});
});
