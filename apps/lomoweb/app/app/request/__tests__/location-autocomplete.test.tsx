import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CeremonyDetailsPage from "../ceremony/details/page";
import OtherDetailsPage from "../other/details/page";
import { RequestDraftProvider } from "../request-draft-context";
import SupportDetailsPage from "../support/details/page";

const push = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push, replace: vi.fn() }),
}));

const PICK_A_MATCH = /Pick a match from the list/;

const VICTORIA_PARK = {
	id: "1",
	label: "Victoria Park, Kitchener, Ontario, Canada",
	lat: 43.451,
	lng: -80.492,
};

function mockAddressSearch() {
	vi.stubGlobal("fetch", vi.fn(async () => ({
		ok: true,
		json: async () => ({ results: [VICTORIA_PARK] }),
	})));
}

function typeInto(name: string, value: string) {
	fireEvent.change(screen.getByRole("textbox", { name }), {
		target: { value },
	});
}

function typeLocation(name: string, value: string) {
	fireEvent.change(screen.getByRole("combobox", { name }), {
		target: { value },
	});
}

async function chooseVictoriaPark() {
	const suggestion = await screen.findByRole("button", { name: VICTORIA_PARK.label });
	fireEvent.click(suggestion);
	expect(await screen.findByText("Location verified.")).toBeInTheDocument();
}

describe("request location fields", () => {
	beforeEach(() => {
		push.mockReset();
		mockAddressSearch();
		vi.spyOn(window, "alert").mockImplementation(() => {});
	});

	it("requires a chosen location before an other request can continue", async () => {
		render(
			<RequestDraftProvider>
				<OtherDetailsPage />
			</RequestDraftProvider>,
		);

		typeInto("What do you need?", "Help moving a bookshelf");
		typeLocation("Location", "Victoria Park");
		expect(await screen.findByText(PICK_A_MATCH)).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Continue" }));
		expect(window.alert).toHaveBeenCalled();
		expect(push).not.toHaveBeenCalled();

		await chooseVictoriaPark();
		fireEvent.click(screen.getByRole("button", { name: "Continue" }));
		expect(push).toHaveBeenCalledWith("/app/request/other/preview");
	});

	it("requires a chosen public place before a walk request can continue", async () => {
		render(
			<RequestDraftProvider>
				<SupportDetailsPage />
			</RequestDraftProvider>,
		);

		fireEvent.click(screen.getByRole("radio", { name: "Today" }));
		typeLocation("Where should the walk be?", "Victoria Park");
		expect(await screen.findByText(PICK_A_MATCH)).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Next" }));
		expect(window.alert).toHaveBeenCalled();
		expect(push).not.toHaveBeenCalled();

		await chooseVictoriaPark();
		fireEvent.click(screen.getByRole("button", { name: "Next" }));
		expect(push).toHaveBeenCalledWith("/app/request/support/preview");
	});

	it("requires a chosen ceremony location before that request can continue", async () => {
		render(
			<RequestDraftProvider>
				<CeremonyDetailsPage />
			</RequestDraftProvider>,
		);

		typeInto("What do you need?", "Someone to keep the fire");
		typeInto("Time of day or other timing details", "Saturday at dawn");
		typeLocation("Location of ceremony", "Victoria Park");
		expect(await screen.findByText(PICK_A_MATCH)).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Next" }));
		expect(window.alert).toHaveBeenCalled();
		expect(push).not.toHaveBeenCalled();

		await chooseVictoriaPark();
		fireEvent.click(screen.getByRole("button", { name: "Next" }));
		expect(push).toHaveBeenCalledWith("/app/request/ceremony/preview");
	});
});
