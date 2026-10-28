import {
	PERSON_NAME_CHARACTERS_ERROR,
	PERSON_NAME_LENGTH_ERROR,
} from "@repo/convex-backend/convex/lib/personName";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignUpForm } from "../signup/signup-form";

const mocks = vi.hoisted(() => ({
	signUpEmail: vi.fn(),
	push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mocks.push }),
	useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/lib/auth-client", () => ({
	AUTH_CONNECTION_ERROR_MESSAGE: "Could not reach the server.",
	authClient: { signUp: { email: mocks.signUpEmail } },
}));

const PREFERRED_NAME = /preferred name/i;
const EMAIL_ADDRESS = /email address/i;
const PASSWORD = /password/i;

function fillAndSubmit(name: string) {
	render(<SignUpForm />);
	fireEvent.change(screen.getByRole("textbox", { name: PREFERRED_NAME }), { target: { value: name } });
	fireEvent.change(screen.getByRole("textbox", { name: EMAIL_ADDRESS }), { target: { value: "sam@example.test" } });
	fireEvent.change(screen.getByLabelText(PASSWORD), { target: { value: "long-enough-password" } });
	fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
}

describe("sign up name validation", () => {
	beforeEach(() => {
		mocks.signUpEmail.mockReset().mockResolvedValue({ error: null });
		mocks.push.mockReset();
	});

	it("rejects an @ in the name with an inline error and does not submit", async () => {
		fillAndSubmit("sam@example.test");

		expect(await screen.findByText(PERSON_NAME_CHARACTERS_ERROR)).toBeVisible();
		expect(screen.getByRole("textbox", { name: PREFERRED_NAME })).toHaveAttribute("aria-invalid", "true");
		expect(mocks.signUpEmail).not.toHaveBeenCalled();
	});

	it("submits a trimmed real-world name with accents, apostrophes, and hyphens", async () => {
		fillAndSubmit("  Zoë   D’Angelo-Saldaña ");

		await waitFor(() => {
			expect(mocks.signUpEmail).toHaveBeenCalledWith({
				name: "Zoë D’Angelo-Saldaña",
				email: "sam@example.test",
				password: "long-enough-password",
			});
		});
		expect(mocks.push).toHaveBeenCalledWith("/app/onboarding/basics");
	});

	it("shows the server's name error on the name field", async () => {
		mocks.signUpEmail.mockResolvedValue({
			error: { code: "INVALID_NAME", message: PERSON_NAME_LENGTH_ERROR },
		});
		fillAndSubmit("Sam");

		expect(await screen.findByText(PERSON_NAME_LENGTH_ERROR)).toBeVisible();
		expect(screen.getByRole("textbox", { name: PREFERRED_NAME })).toHaveAttribute("aria-invalid", "true");
		expect(mocks.push).not.toHaveBeenCalled();
	});
});
