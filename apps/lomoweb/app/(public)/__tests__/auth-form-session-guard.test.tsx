import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	getSession: vi.fn(),
	signInEmail: vi.fn(),
	signUpEmail: vi.fn(),
	replace: vi.fn(),
	push: vi.fn(),
}));

vi.mock("@/lib/auth-client", () => ({
	AUTH_CONNECTION_ERROR_MESSAGE: "Could not reach the sign-in service.",
	authClient: {
		useSession: () => ({ data: null, isPending: false }),
		getSession: mocks.getSession,
		signIn: { email: mocks.signInEmail },
		signUp: { email: mocks.signUpEmail },
	},
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({ replace: mocks.replace, push: mocks.push }),
	useSearchParams: () => new URLSearchParams(),
}));

describe("auth forms while a session may still exist", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.getSession.mockResolvedValue({ data: null });
	});

	it("starts sign-in with an empty email", async () => {
		const { SignInForm } = await import("../signin/signin-form");
		render(<SignInForm />);

		const email = screen.getByRole("textbox", { name: "Email address" });
		expect(email).toHaveValue("");
		expect(email).toHaveAttribute("autocomplete", "off");
	});

	it("does not sign in over an existing session", async () => {
		mocks.getSession.mockResolvedValue({ data: { user: { id: "user-1" } } });
		const { SignInForm } = await import("../signin/signin-form");
		render(<SignInForm />);

		fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
			target: { value: "next@example.com" },
		});
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "password1" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Login" }));

		await vi.waitFor(() => {
			expect(mocks.replace).toHaveBeenCalledWith("/app?notice=already-signed-in");
		});
		expect(mocks.signInEmail).not.toHaveBeenCalled();
	});

	it("starts sign-up with an empty email", async () => {
		const { SignUpForm } = await import("../signup/signup-form");
		render(<SignUpForm />);

		const email = screen.getByRole("textbox", { name: "Email address" });
		expect(email).toHaveValue("");
		expect(email).toHaveAttribute("autocomplete", "off");
	});

	it("does not register another email over an existing session", async () => {
		mocks.getSession.mockResolvedValue({ data: { user: { id: "user-1" } } });
		const { SignUpForm } = await import("../signup/signup-form");
		render(<SignUpForm />);

		fireEvent.change(screen.getByRole("textbox", { name: "Preferred name" }), {
			target: { value: "Ada" },
		});
		fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
			target: { value: "next@example.com" },
		});
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "password1" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

		await vi.waitFor(() => {
			expect(mocks.replace).toHaveBeenCalledWith("/app?notice=already-signed-in");
		});
		expect(mocks.signUpEmail).not.toHaveBeenCalled();
	});

	it("clears an email-already-in-use error when the email changes", async () => {
		mocks.signUpEmail.mockResolvedValue({
			error: {
				code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
				message: "User already exists",
			},
		});
		const { SignUpForm } = await import("../signup/signup-form");
		render(<SignUpForm />);

		fireEvent.change(screen.getByRole("textbox", { name: "Preferred name" }), {
			target: { value: "Ada" },
		});
		fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
			target: { value: "taken@example.com" },
		});
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "password1" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

		const takenMessage = "An account with this email already exists";
		expect(await screen.findByText(takenMessage)).toBeInTheDocument();

		fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
			target: { value: "new@example.com" },
		});

		expect(screen.queryByText(takenMessage)).not.toBeInTheDocument();
	});
});
