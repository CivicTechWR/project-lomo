import type { CountryCode } from "libphonenumber-js";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ContactStep } from "../contact-step";

const mocks = vi.hoisted(() => ({
	profileRow: null as Record<string, unknown> | null | undefined,
	phoneNumberSettings: null as Array<{ country: CountryCode; label: string }> | null | undefined,
	updatePublicProfile: vi.fn(),
	push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mocks.push }),
}));

vi.mock("@/lib/hooks/use-admin", () => ({
	usePublicPhoneNumberSettings: () => mocks.phoneNumberSettings,
}));

vi.mock("convex/react", () => ({
	useQuery: () => mocks.profileRow,
	useMutation: () => mocks.updatePublicProfile,
}));

function renderContactStep() {
	return render(<ContactStep />);
}

const COUNTRY_PATTERN = /country/i;
const MOBILE_NUMBER_PATTERN = /mobile number/i;

describe("contactStep phone number", () => {
	beforeEach(() => {
		mocks.profileRow = { phone: undefined };
		mocks.phoneNumberSettings = [
			{ country: "CA", label: "Canada" },
			{ country: "US", label: "United States" },
		];
		mocks.updatePublicProfile.mockReset();
		mocks.updatePublicProfile.mockResolvedValue({});
		mocks.push.mockReset();
		vi.spyOn(window, "alert").mockImplementation(() => {});
	});

	it("formats a number and shows valid status for an allowed country", () => {
		renderContactStep();

		const country = screen.getByRole("combobox", { name: COUNTRY_PATTERN });
		const phone = screen.getByRole("textbox", { name: MOBILE_NUMBER_PATTERN });
		const continueButton = screen.getByRole("button", { name: "Continue" });

		expect(continueButton).toBeEnabled();
		fireEvent.change(country, { target: { value: "CA" } });
		fireEvent.change(phone, { target: { value: "4165550100" } });

		expect(phone).toHaveValue("(416) 555-0100");
		expect(screen.getByRole("status")).toHaveTextContent("Valid Canada number");
		expect(continueButton).toBeEnabled();
	});

	it("rejects numbers from a country outside the configured allowlist", () => {
		mocks.phoneNumberSettings = [{ country: "CA", label: "Canada" }];
		renderContactStep();

		fireEvent.change(screen.getByRole("textbox", { name: MOBILE_NUMBER_PATTERN }), {
			target: { value: "4155551234" },
		});

		expect(screen.getByText("Enter a valid number for this country.")).toBeVisible();
		expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
	});

	it("disables Continue for incomplete input and submits a normalized E.164 value", async () => {
		renderContactStep();

		fireEvent.change(screen.getByRole("combobox", { name: COUNTRY_PATTERN }), {
			target: { value: "US" },
		});
		fireEvent.change(screen.getByRole("textbox", { name: MOBILE_NUMBER_PATTERN }), {
			target: { value: "123" },
		});

		expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
		fireEvent.change(screen.getByRole("textbox", { name: MOBILE_NUMBER_PATTERN }), {
			target: { value: "4155550100" },
		});
		expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
		fireEvent.click(screen.getByRole("button", { name: "Continue" }));

		await waitFor(() => {
			expect(mocks.updatePublicProfile).toHaveBeenCalledWith({ phone: "+14155550100" });
		});
		expect(mocks.push).toHaveBeenCalledWith("/app/onboarding/safety");
	});

	it("surfaces a backend validation error without navigating", async () => {
		mocks.updatePublicProfile.mockRejectedValue(new Error("Phone number is not allowed."));
		renderContactStep();

		fireEvent.change(screen.getByRole("combobox", { name: COUNTRY_PATTERN }), {
			target: { value: "CA" },
		});
		fireEvent.change(screen.getByRole("textbox", { name: MOBILE_NUMBER_PATTERN }), {
			target: { value: "4165550100" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Continue" }));

		await waitFor(() => {
			expect(screen.getByRole("alert")).toHaveTextContent("Phone number is not allowed.");
		});
		expect(mocks.push).not.toHaveBeenCalled();
	});
});
