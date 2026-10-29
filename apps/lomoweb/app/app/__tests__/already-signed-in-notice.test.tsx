import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ALREADY_SIGNED_IN_MESSAGE } from "@/lib/already-signed-in";
import { AlreadySignedInNotice } from "../already-signed-in-notice";

const mocks = vi.hoisted(() => ({
	replace: vi.fn(),
	signOut: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({ replace: mocks.replace }),
	usePathname: () => "/app/onboarding/basics",
}));

vi.mock("@/lib/sign-out", () => ({
	signOutToSignIn: mocks.signOut,
}));

describe("alreadySignedInNotice", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("tells a signed-in visitor to log out before using another email", () => {
		render(<AlreadySignedInNotice />);
		expect(screen.getByRole("status")).toHaveTextContent(ALREADY_SIGNED_IN_MESSAGE);
	});

	it("dismisses without leaving the current page", () => {
		render(<AlreadySignedInNotice />);
		fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
		expect(mocks.replace).toHaveBeenCalledWith("/app/onboarding/basics");
	});

	it("logs out so a different email can be used", () => {
		render(<AlreadySignedInNotice />);
		fireEvent.click(screen.getByRole("button", { name: "Log out" }));
		expect(mocks.signOut).toHaveBeenCalledOnce();
	});
});
