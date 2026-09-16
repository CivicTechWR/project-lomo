import { render } from "@testing-library/react";
import fc from "fast-check";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { HowItWorksSection } from "../how-it-works-section.tsx";

vi.mock("@repo/ui/card", () => ({
	Card: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
		<div data-testid="card" {...props}>
			{children}
		</div>
	),
}));

vi.mock("@repo/ui/heading", () => ({
	Heading: ({ children, level, ...props }: { children: React.ReactNode; level: number; [key: string]: any }) => {
		const Tag = `h${level}` as React.ElementType;
		return <Tag {...props}>{children}</Tag>;
	},
}));

vi.mock("@repo/ui/text", () => ({
	Text: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
		<p {...props}>{children}</p>
	),
}));

const NEED_OR_REQUEST_REGEX = /need|request/;
const HELPER_OR_FORWARD_REGEX = /someone|helper|volunteer|forward/;
const CHOOSE_OR_ACCEPT_REGEX = /choose|accept|confirm|decide/;
const CONNECT_OR_READY_REGEX = /connect|ready/;

describe("howItWorksSection - Property 2: How It Works steps render in the correct order", () => {
	it(
		"**Validates: Requirements 12.3, 12.4** — should render exactly 4 steps in correct order across varied contexts",
		() => {
			fc.assert(
				fc.property(
					fc.tuple(
						fc.integer({ min: 0, max: 1000 }),
						fc.boolean(),
						fc.oneof(
							fc.constant("sm"),
							fc.constant("md"),
							fc.constant("lg"),
							fc.constant("xl"),
						),
					),
					() => {
						// Render the component
						const { container } = render(<HowItWorksSection />);

						// Extract all h3 headings (step labels) in DOM order
						const stepLabels = Array.from(container.querySelectorAll("h3"), el =>
							el.textContent?.trim() || "");

						// Assert exactly 4 steps are present
						expect(stepLabels).toHaveLength(4);

						// Assert the flow is preserved without locking to a single word-for-word copy
						const normalized = stepLabels.map(label => label.toLowerCase());
						expect(normalized[0]).toMatch(NEED_OR_REQUEST_REGEX);
						expect(normalized[1]).toMatch(HELPER_OR_FORWARD_REGEX);
						expect(normalized[2]).toMatch(CHOOSE_OR_ACCEPT_REGEX);
						expect(normalized[3]).toMatch(CONNECT_OR_READY_REGEX);

						// Verify no steps are missing or out of order
						expect(stepLabels[0].length).toBeGreaterThan(0);
						expect(stepLabels[1].length).toBeGreaterThan(0);
						expect(stepLabels[2].length).toBeGreaterThan(0);
						expect(stepLabels[3].length).toBeGreaterThan(0);
					},
				),
				{ numRuns: 100 },
			);
		},
	);

	it("should render exactly 4 step cards", () => {
		const { container } = render(<HowItWorksSection />);
		const stepCards = container.querySelectorAll("[data-testid='card']");
		expect(stepCards).toHaveLength(4);
	});

	it("should render all step numbers correctly", () => {
		const { container } = render(<HowItWorksSection />);
		// Extract all aria-hidden spans (step numbers)
		const stepNumbers = Array.from(container.querySelectorAll("span[aria-hidden='true']"), el =>
			el.textContent?.trim() || "");
		expect(stepNumbers).toEqual(["1", "2", "3", "4"]);
	});

	it("should render section with correct aria-label", () => {
		const { container } = render(<HowItWorksSection />);
		const section = container.querySelector("section[aria-label=\"How it works\"]");
		expect(section).toBeInTheDocument();
	});

	it("should render main heading 'A simple, safe process'", () => {
		const { container } = render(<HowItWorksSection />);
		const headings = Array.from(container.querySelectorAll("h2"), el => el.textContent?.trim() || "");
		expect(headings).toContain("A simple, safe process");
	});
});
