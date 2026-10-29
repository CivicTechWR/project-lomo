import { describe, expect, it } from "vitest";
import { onboardingRedirectPath, profileExit } from "../onboarding-gate";

describe("onboardingRedirectPath", () => {
	it("keeps profile available before onboarding is finished", () => {
		expect(onboardingRedirectPath("/app/profile", false)).toBeNull();
	});

	it("still sends the rest of the app to setup", () => {
		expect(onboardingRedirectPath("/app", false)).toBe("/app/onboarding/basics");
		expect(onboardingRedirectPath("/app/notifications", false)).toBe("/app/onboarding/basics");
		expect(onboardingRedirectPath("/app/admin", false)).toBe("/app/onboarding/basics");
	});

	it("leaves someone inside the wizard", () => {
		expect(onboardingRedirectPath("/app/onboarding/contact", false)).toBeNull();
	});

	it("sends a finished user out of the wizard", () => {
		expect(onboardingRedirectPath("/app/onboarding/preferences", true)).toBe("/app");
		expect(onboardingRedirectPath("/app/profile", true)).toBeNull();
	});
});

describe("profileExit", () => {
	it("returns to setup when onboarding is unfinished", () => {
		expect(profileExit(false)).toEqual({
			href: "/app/onboarding/basics",
			label: "Back to setup",
		});
	});

	it("returns to requests once setup is finished or still loading", () => {
		expect(profileExit(true)).toEqual({
			href: "/app/my-requests",
			label: "Back to requests",
		});
		expect(profileExit(undefined)).toEqual({
			href: "/app/my-requests",
			label: "Back to requests",
		});
	});
});
