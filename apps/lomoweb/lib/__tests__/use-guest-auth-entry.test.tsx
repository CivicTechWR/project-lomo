import { fireEvent, render, screen } from "@testing-library/react";
import { act, useCallback, useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGuestAuthEntry } from "../use-guest-auth-entry";

const mocks = vi.hoisted(() => ({
	session: {
		data: null as { user?: { id: string } } | null,
		isPending: false,
	},
	getSession: vi.fn(),
	replace: vi.fn(),
}));

vi.mock("@/lib/auth-client", () => ({
	authClient: {
		useSession: () => mocks.session,
		getSession: mocks.getSession,
	},
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({ replace: mocks.replace, push: vi.fn() }),
}));

function EmailProbe() {
	const [email, setEmail] = useState("previous@example.com");
	const resetFields = useCallback(() => {
		setEmail("");
	}, []);
	const { markEdited } = useGuestAuthEntry(resetFields);

	return (
		<input
			aria-label="Email address"
			value={email}
			onChange={(event) => {
				markEdited();
				setEmail(event.target.value);
			}}
		/>
	);
}

describe("useGuestAuthEntry", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.session.data = null;
		mocks.session.isPending = false;
	});

	it("clears a restored email when nobody is signed in", () => {
		render(<EmailProbe />);
		expect(screen.getByRole("textbox", { name: "Email address" })).toHaveValue("");
	});

	it("sends a signed-in visitor home", () => {
		mocks.session.data = { user: { id: "user-1" } };
		render(<EmailProbe />);
		expect(mocks.replace).toHaveBeenCalledWith("/app?notice=already-signed-in");
	});

	it("keeps an email the visitor typed while the session was loading", () => {
		mocks.session.isPending = true;
		const view = render(<EmailProbe />);
		const input = screen.getByRole("textbox", { name: "Email address" });
		fireEvent.change(input, { target: { value: "new@example.com" } });

		mocks.session.isPending = false;
		view.rerender(<EmailProbe />);

		expect(input).toHaveValue("new@example.com");
		expect(mocks.replace).not.toHaveBeenCalled();
	});

	it("clears the email when a cached page is restored", () => {
		render(<EmailProbe />);
		const input = screen.getByRole("textbox", { name: "Email address" });
		fireEvent.change(input, { target: { value: "typed@example.com" } });

		const event = new Event("pageshow");
		Object.defineProperty(event, "persisted", { value: true });
		act(() => {
			window.dispatchEvent(event);
		});

		expect(input).toHaveValue("");
	});
});
