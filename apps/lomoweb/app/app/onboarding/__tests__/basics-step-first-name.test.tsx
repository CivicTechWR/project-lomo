import { PERSON_NAME_CHARACTERS_ERROR } from "@repo/convex-backend/convex/lib/personName";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BasicsStep } from "../basics-step";

const mocks = vi.hoisted(() => ({
	// Stable reference: the step re-syncs its fields whenever the profile row changes.
	profileRow: { firstName: undefined, pronouns: undefined },
	updatePublicProfile: vi.fn(),
	push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mocks.push }),
}));

vi.mock("convex/react", () => ({
	useQuery: () => mocks.profileRow,
	useMutation: () => mocks.updatePublicProfile,
}));

describe("basicsStep first name", () => {
	beforeEach(() => {
		mocks.updatePublicProfile.mockReset().mockResolvedValue({});
		mocks.push.mockReset();
	});

	it("blocks names with @ and recovers once the name is corrected", async () => {
		render(<BasicsStep />);
		const input = screen.getByRole("textbox", { name: "First name" });

		fireEvent.change(input, { target: { value: "@sam" } });
		expect(input).toHaveAttribute("aria-invalid", "true");
		expect(screen.getByText(PERSON_NAME_CHARACTERS_ERROR)).toBeVisible();
		expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();

		fireEvent.change(input, { target: { value: "  Siobhán  " } });
		expect(input).not.toHaveAttribute("aria-invalid");
		fireEvent.click(screen.getByRole("button", { name: "Continue" }));

		await waitFor(() => {
			expect(mocks.updatePublicProfile).toHaveBeenCalledWith({ firstName: "Siobhán", pronouns: undefined });
		});
		expect(mocks.push).toHaveBeenCalledWith("/app/onboarding/contact");
	});

	it("keeps first name optional", async () => {
		render(<BasicsStep />);

		fireEvent.click(screen.getByRole("button", { name: "Continue" }));

		await waitFor(() => {
			expect(mocks.updatePublicProfile).toHaveBeenCalledWith({ firstName: undefined, pronouns: undefined });
		});
	});
});
