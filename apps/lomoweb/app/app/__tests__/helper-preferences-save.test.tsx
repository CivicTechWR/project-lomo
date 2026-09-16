import type { HelperPreferencesFormValues } from "../helper-preferences-fields";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
	HelperPreferencesFields,
	helperPreferencesFromProfile,
} from "../helper-preferences-fields";

/**
 * Covers the round trip the profile page relies on: the stored row becomes form
 * state, the switch edits that state, and the edited state is what gets sent.
 *
 * The map is stubbed because it pulls in Leaflet, which needs a real layout.
 */
vi.mock("../help-area-map", () => ({
	HelpAreaMap: () => <div data-testid="help-area-map" />,
}));

const OFFER_SUPPORT = /i can offer support/i;
const SAVE_BUTTON = /save preferences/i;
const TAKE_A_BREAK = /take a break/i;
const YOURE_RESTING = /you're resting/i;

/** Stands in for the profile page: seeds state from a row, saves on click. */
function Harness({
	row,
	onSave,
}: {
	row: Parameters<typeof helperPreferencesFromProfile>[0];
	onSave: (values: HelperPreferencesFormValues) => void;
}) {
	const [values, setValues] = useState(() => helperPreferencesFromProfile(row));
	return (
		<>
			<HelperPreferencesFields values={values} onChange={setValues} />
			<button type="button" onClick={() => onSave(values)}>
				Save preferences
			</button>
		</>
	);
}

describe("helperPreferencesFromProfile", () => {
	/**
	 * The bug this guards: the profile form never ran its sync, so it kept
	 * `helperPreferencesFromProfile(undefined)`, whose `canHelpNow` is false. The
	 * switch then read as off for a user whose stored value was true.
	 */
	it("carries a stored canHelpNow=true into the form", () => {
		expect(helperPreferencesFromProfile({ canHelpNow: true }).canHelpNow).toBe(true);
	});

	it("treats a missing canHelpNow as resting", () => {
		expect(helperPreferencesFromProfile({}).canHelpNow).toBe(false);
		expect(helperPreferencesFromProfile(undefined).canHelpNow).toBe(false);
		expect(helperPreferencesFromProfile(null).canHelpNow).toBe(false);
	});

	it("preserves stored help preferences and area rather than resetting them", () => {
		const values = helperPreferencesFromProfile({
			canHelpNow: true,
			helpPreferences: ["groceries"],
			helpAreaCenterLat: 43.1,
			helpAreaCenterLng: -80.2,
			helpAreaRadiusKm: 7,
		});

		expect(values).toMatchObject({
			canHelpNow: true,
			helpPreferences: ["groceries"],
			helpAreaCenterLat: 43.1,
			helpAreaCenterLng: -80.2,
			helpAreaRadiusKm: 7,
		});
	});
});

describe("saving the offer-support toggle", () => {
	it("renders the switch on when the stored value is on", () => {
		render(<Harness row={{ canHelpNow: true }} onSave={vi.fn()} />);

		expect(screen.getByRole("switch", { name: OFFER_SUPPORT })).toBeChecked();
	});

	it("sends canHelpNow=false after the user switches it off", () => {
		const onSave = vi.fn();
		render(<Harness row={{ canHelpNow: true }} onSave={onSave} />);

		fireEvent.click(screen.getByRole("switch", { name: OFFER_SUPPORT }));
		fireEvent.click(screen.getByRole("button", { name: SAVE_BUTTON }));

		expect(onSave).toHaveBeenCalledTimes(1);
		expect(onSave.mock.calls[0]?.[0]).toMatchObject({ canHelpNow: false });
	});

	it("sends canHelpNow=true after the user switches it back on", () => {
		const onSave = vi.fn();
		render(<Harness row={{ canHelpNow: false }} onSave={onSave} />);

		const toggle = screen.getByRole("switch", { name: OFFER_SUPPORT });
		expect(toggle).not.toBeChecked();

		fireEvent.click(toggle);
		fireEvent.click(screen.getByRole("button", { name: SAVE_BUTTON }));

		expect(onSave.mock.calls[0]?.[0]).toMatchObject({ canHelpNow: true });
	});

	it("keeps the other preferences intact when only the toggle changes", () => {
		const onSave = vi.fn();
		render(
			<Harness
				row={{
					canHelpNow: true,
					helpPreferences: ["groceries"],
					helpAreaRadiusKm: 7,
				}}
				onSave={onSave}
			/>,
		);

		fireEvent.click(screen.getByRole("switch", { name: OFFER_SUPPORT }));
		fireEvent.click(screen.getByRole("button", { name: SAVE_BUTTON }));

		// Regression guard: the stale-form bug sent [] and a reset radius here,
		// silently wiping preferences the user had already chosen.
		expect(onSave.mock.calls[0]?.[0]).toMatchObject({
			canHelpNow: false,
			helpPreferences: ["groceries"],
			helpAreaRadiusKm: 7,
		});
	});

	it("explains the consequence of turning the toggle off", () => {
		render(<Harness row={{ canHelpNow: true }} onSave={vi.fn()} />);

		expect(screen.getByText(TAKE_A_BREAK)).toBeInTheDocument();
	});

	it("confirms the resting state once the toggle is off", () => {
		render(<Harness row={{ canHelpNow: true }} onSave={vi.fn()} />);

		fireEvent.click(screen.getByRole("switch", { name: OFFER_SUPPORT }));

		expect(screen.getByText(YOURE_RESTING)).toBeInTheDocument();
	});
});
