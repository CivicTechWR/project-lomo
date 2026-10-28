import { PERSON_NAME_CHARACTERS_ERROR } from "@repo/convex-backend/convex/lib/personName";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserProfile } from "../user-profile";

const mocks = vi.hoisted(() => ({
	updatePublicProfile: vi.fn(),
}));

const FIRST_NAME = /first name/i;

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@convex-dev/better-auth/nextjs/client", () => ({
	usePreloadedAuthQuery: () => ({ email: "user@example.com" }),
}));

vi.mock("@/lib/hooks/use-user-profile", () => ({
	useMyProfileRow: () => ({ _id: "users:1", firstName: "Sam", pronouns: "", phone: "" }),
	useUpdatePublicProfile: () => mocks.updatePublicProfile,
	useUpdateHelperPreferences: () => vi.fn(),
	useAcknowledgeSafety: () => vi.fn(),
	useDeleteMyAccount: () => vi.fn(),
}));

vi.mock("@/lib/auth-client", () => ({
	authClient: { signOut: vi.fn() },
}));

vi.mock("../helper-preferences-fields", () => ({
	HelperPreferencesFields: () => null,
	helperPreferencesFromProfile: () => ({}),
}));

vi.mock("../onboarding/safety-acknowledgment", () => ({
	SafetyAcknowledgment: () => null,
}));

describe("profile first name", () => {
	beforeEach(() => {
		mocks.updatePublicProfile.mockReset().mockResolvedValue({});
	});

	it("shows an inline error and disables saving for an invalid name", async () => {
		render(<UserProfile preloadedUser={{} as never} />);
		const input = screen.getByRole("textbox", { name: FIRST_NAME });

		fireEvent.change(input, { target: { value: "Sam <3" } });
		expect(input).toHaveAttribute("aria-invalid", "true");
		expect(screen.getByText(PERSON_NAME_CHARACTERS_ERROR)).toBeVisible();
		expect(screen.getByRole("button", { name: "Save profile" })).toBeDisabled();

		fireEvent.change(input, { target: { value: "Sam-Lee" } });
		fireEvent.click(screen.getByRole("button", { name: "Save profile" }));
		await waitFor(() => {
			expect(mocks.updatePublicProfile).toHaveBeenCalledWith(
				expect.objectContaining({ firstName: "Sam-Lee" }),
			);
		});
	});
});
