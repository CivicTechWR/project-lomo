import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BasicsStep } from "../basics-step";

const mocks = vi.hoisted(() => ({ update: vi.fn(), push: vi.fn() }));
const profile = { pronouns: "" };
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }));
vi.mock("convex/react", () => ({ useQuery: () => profile, useMutation: () => mocks.update }));

describe("basics pronouns validation", () => {
	beforeEach(() => {
		mocks.update.mockReset().mockResolvedValue({});
		mocks.push.mockReset();
	});

	it("blocks invalid pronouns with an inline error and recovers after correction", async () => {
		render(<BasicsStep />);
		const input = screen.getByRole("textbox", { name: "Pronouns" });
		fireEvent.change(input, { target: { value: "a".repeat(65) } });
		expect(input).toHaveAttribute("aria-invalid", "true");
		expect(screen.getByText("Use 64 characters or fewer for pronouns.")).toBeVisible();
		expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
		expect(mocks.update).not.toHaveBeenCalled();
		fireEvent.change(input, { target: { value: "  xe/xem  " } });
		fireEvent.click(screen.getByRole("button", { name: "Continue" }));
		await waitFor(() => expect(mocks.update).toHaveBeenCalledWith({ firstName: undefined, pronouns: "xe/xem" }));
		expect(mocks.push).toHaveBeenCalledWith("/app/onboarding/contact");
	});

	it("allows leaving pronouns blank and explicitly clears a saved value", async () => {
		render(<BasicsStep />);
		fireEvent.click(screen.getByRole("button", { name: "Continue" }));
		await waitFor(() => expect(mocks.update).toHaveBeenCalledWith({ firstName: undefined, pronouns: "" }));
	});
});
