import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ONBOARDING_STEP_COUNT } from "@/lib/helper-preferences";
import { OnboardingFlowShell } from "../onboarding-flow-shell.tsx";
import { OnboardingStepFooter } from "../onboarding-step-footer.tsx";

const navigation = vi.hoisted(() => ({
	search: "",
}));

vi.mock("next/navigation", () => ({
	usePathname: () => "/app/onboarding/basics",
	useRouter: () => ({ replace: vi.fn() }),
	useSearchParams: () => new URLSearchParams(navigation.search),
}));

vi.mock("@/lib/sign-out", () => ({
	signOutToSignIn: vi.fn(),
}));

const PROGRESS_LABEL_REGEX = /onboarding progress/i;
const WHITESPACE_REGEX = /\s+/;
const ALREADY_LOGGED_IN = /already logged in/i;

describe("onboardingFlowShell", () => {
	beforeEach(() => {
		navigation.search = "";
	});
	/**
	 * Regression guard. The `/app` layout renders its children inside
	 * `flex min-h-screen w-full`, i.e. a flex *row*. A flex item there with no
	 * width/grow declaration shrinks to its content width and hugs the left edge,
	 * which is what made the onboarding steps look off-centre on wide screens.
	 */
	it("fills the width of its flex-row parent so the panel can centre", () => {
		const { container } = render(
			<OnboardingFlowShell>
				<p>step</p>
			</OnboardingFlowShell>,
		);

		const root = container.firstElementChild!;
		expect(root.className).toContain("w-full");
		expect(root.className).toContain("flex-1");
	});

	it("centres the panel and constrains its width", () => {
		const { container } = render(
			<OnboardingFlowShell>
				<p>step</p>
			</OnboardingFlowShell>,
		);

		const panel = container.firstElementChild!.firstElementChild!;
		expect(panel.className).toContain("m-auto");
		expect(panel.className).toContain("max-w-lg");
	});

	it("places the already-signed-in notice above the step, inside the centred panel", () => {
		navigation.search = "notice=already-signed-in";
		const { container } = render(
			<OnboardingFlowShell>
				<p>step</p>
			</OnboardingFlowShell>,
		);

		const panel = container.firstElementChild!.firstElementChild!;
		const notice = screen.getByRole("status");
		expect(panel.contains(notice)).toBe(true);
		expect(notice.compareDocumentPosition(screen.getByText("step"))).toBe(
			Node.DOCUMENT_POSITION_FOLLOWING,
		);
		expect(notice).toHaveTextContent(ALREADY_LOGGED_IN);
	});

	it("links to profile so an account can be managed before setup is finished", () => {
		render(
			<OnboardingFlowShell>
				<p>step</p>
			</OnboardingFlowShell>,
		);

		expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
			"href",
			"/app/profile",
		);
	});

	it("exposes step progress to assistive technology", () => {
		render(
			<OnboardingFlowShell>
				<p>step</p>
			</OnboardingFlowShell>,
		);

		// "basics" is the first entry in ONBOARDING_STEP_PATHS.
		const bar = screen.getByRole("progressbar", { name: PROGRESS_LABEL_REGEX });
		expect(bar).toHaveAttribute("aria-valuenow", "1");
		expect(bar).toHaveAttribute("aria-valuemax", String(ONBOARDING_STEP_COUNT));
	});
});

describe("onboardingStepFooter", () => {
	/**
	 * The Figma onboarding controls are a yellow "Continue" and a warm "Back",
	 * both with a 4px ink outline. Those come from `className` overriding the
	 * Button variants, which only holds if tailwind-merge resolves the conflicts
	 * in our favour — hence asserting on the resolved class list rather than
	 * trusting the override.
	 */
	it("renders the primary action with the Figma yellow fill and ink outline", () => {
		render(
			<OnboardingStepFooter onBack={() => {}} onNext={() => {}} nextLabel="Continue" />,
		);

		const classes = screen
			.getByRole("button", { name: "Continue" })
			.className
			.split(WHITESPACE_REGEX);

		expect(classes).toContain("bg-yellow-10");
		// The `solid`/`yellow` variant's own `bg-yellow-9` must have been merged out.
		expect(classes).not.toContain("bg-yellow-9");
		expect(classes).toContain("border-4");
		expect(classes).not.toContain("border");
		expect(classes).toContain("border-[var(--terracotta-9)]");
	});

	it("renders the back action on the warm surface with a 4px ink outline", () => {
		render(
			<OnboardingStepFooter onBack={() => {}} onNext={() => {}} />,
		);

		const classes = screen
			.getByRole("button", { name: "Back" })
			.className
			.split(WHITESPACE_REGEX);

		expect(classes).toContain("bg-surface-warm");
		// Guards the `outline` variant regression: a bare `border` here means a
		// variant reintroduced a 1px width and flattened the outline.
		expect(classes).toContain("border-4");
		expect(classes).not.toContain("border");
		expect(classes).toContain("border-[var(--terracotta-9)]");
	});

	it("omits the next action when showNext is false", () => {
		render(<OnboardingStepFooter onBack={() => {}} showNext={false} />);

		expect(screen.getAllByRole("button")).toHaveLength(1);
		expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
	});
});
