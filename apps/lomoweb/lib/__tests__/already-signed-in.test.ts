import { describe, expect, it } from "vitest";
import {
	ALREADY_SIGNED_IN_MESSAGE,
	ALREADY_SIGNED_IN_NOTICE,
	alreadySignedInPath,
	isAlreadySignedInNotice,
	pathWithAlreadySignedInNotice,
} from "../already-signed-in";

const ALREADY_LOGGED_IN = /already logged in/i;
const LOG_OUT = /log out/i;

describe("already signed in notice", () => {
	it("points signed-in visitors at the app home with a notice", () => {
		expect(alreadySignedInPath()).toBe(`/app?notice=${ALREADY_SIGNED_IN_NOTICE}`);
	});

	it("keeps the notice when onboarding sends someone away from home", () => {
		expect(pathWithAlreadySignedInNotice("/app/onboarding/basics")).toBe(
			"/app/onboarding/basics?notice=already-signed-in",
		);
	});

	it("recognizes the notice query value", () => {
		expect(isAlreadySignedInNotice(ALREADY_SIGNED_IN_NOTICE)).toBe(true);
		expect(isAlreadySignedInNotice([ALREADY_SIGNED_IN_NOTICE])).toBe(true);
		expect(isAlreadySignedInNotice(undefined)).toBe(false);
		expect(isAlreadySignedInNotice("other")).toBe(false);
	});

	it("tells the visitor they are already logged in", () => {
		expect(ALREADY_SIGNED_IN_MESSAGE).toMatch(ALREADY_LOGGED_IN);
		expect(ALREADY_SIGNED_IN_MESSAGE).toMatch(LOG_OUT);
	});
});
