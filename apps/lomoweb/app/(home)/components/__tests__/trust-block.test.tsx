import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TrustBlock } from "../trust-block.tsx";

// Mock the @repo/ui components
vi.mock("@repo/ui", () => ({
	Card: ({ children, className, variant, color, size }: { children: React.ReactNode; className?: string; variant?: string; color?: string; size?: number }) => (
		<div className={className} data-testid="card" data-variant={variant} data-color={color} data-size={size}>
			{children}
		</div>
	),
	Text: ({ children, className, weight, size }: { children: React.ReactNode; className?: string; weight?: string; size?: number }) => (
		<span className={className} data-weight={weight} data-size={size}>
			{children}
		</span>
	),
}));

const FREE_AND_NOT_FOR_PROFIT_REGEX = /Free & not-for-profit/i;
const NO_ALGORITHMS_NO_ADS_REGEX = /No algorithms, no ads/i;
const YOU_OWN_YOUR_DATA_REGEX = /You own your data/i;
const COMMUNITY_FIRST_ALWAYS_REGEX = /Community-first, always/i;
const OUR_VALUES_REGEX = /Our values/i;
const FREE_REGEX = /Free/;
const NO_ALGORITHMS_REGEX = /No algorithms/;
const YOU_OWN_REGEX = /You own/;
const COMMUNITY_FIRST_REGEX = /Community-first/;
const FREE_AND_NOT_FOR_PROFIT_MATCH_REGEX = /Free & not-for-profit/;
const NO_ALGORITHMS_NO_ADS_MATCH_REGEX = /No algorithms, no ads/;
const YOU_OWN_YOUR_DATA_MATCH_REGEX = /You own your data/;
const COMMUNITY_FIRST_ALWAYS_MATCH_REGEX = /Community-first, always/;

describe("trustBlock", () => {
	it("renders four Card elements", () => {
		render(<TrustBlock />);
		const cards = screen.getAllByTestId("card");
		expect(cards).toHaveLength(4);
	});

	it("renders \"Free & not-for-profit\" text", () => {
		render(<TrustBlock />);
		expect(screen.getByText(FREE_AND_NOT_FOR_PROFIT_REGEX)).toBeInTheDocument();
	});

	it("renders \"No algorithms, no ads\" text", () => {
		render(<TrustBlock />);
		expect(screen.getByText(NO_ALGORITHMS_NO_ADS_REGEX)).toBeInTheDocument();
	});

	it("renders \"You own your data\" text", () => {
		render(<TrustBlock />);
		expect(screen.getByText(YOU_OWN_YOUR_DATA_REGEX)).toBeInTheDocument();
	});

	it("renders \"Community-first, always\" text", () => {
		render(<TrustBlock />);
		expect(screen.getByText(COMMUNITY_FIRST_ALWAYS_REGEX)).toBeInTheDocument();
	});

	it("renders all four value statements in the correct order", () => {
		render(<TrustBlock />);
		const cards = screen.getAllByTestId("card");

		expect(cards[0]).toHaveTextContent("Free & not-for-profit");
		expect(cards[1]).toHaveTextContent("No algorithms, no ads");
		expect(cards[2]).toHaveTextContent("You own your data");
		expect(cards[3]).toHaveTextContent("Community-first, always");
	});

	it("renders as a section with aria-label", () => {
		render(<TrustBlock />);
		const section = screen.getByRole("region", { name: OUR_VALUES_REGEX });
		expect(section).toBeInTheDocument();
	});

	it("includes a hidden h2 heading for accessibility", () => {
		const { container } = render(<TrustBlock />);
		const hiddenHeading = container.querySelector("h2.sr-only");
		expect(hiddenHeading).toBeInTheDocument();
		expect(hiddenHeading).toHaveTextContent("Our values");
	});

	it("renders with full width background", () => {
		render(<TrustBlock />);
		const section = screen.getByRole("region", { name: OUR_VALUES_REGEX });
		expect(section).toHaveClass("w-full", "bg-gray-1");
	});

	it("renders all four value statements are present (requires Free, No algorithms, You own, Community-first keywords)", () => {
		render(<TrustBlock />);

		// Check for required keywords as per requirements 11.2, 11.4
		expect(screen.getByText(FREE_REGEX)).toBeInTheDocument();
		expect(screen.getByText(NO_ALGORITHMS_REGEX)).toBeInTheDocument();
		expect(screen.getByText(YOU_OWN_REGEX)).toBeInTheDocument();
		expect(screen.getByText(COMMUNITY_FIRST_REGEX)).toBeInTheDocument();
	});

	it("renders exactly one Card element per value statement", () => {
		render(<TrustBlock />);
		const cards = screen.getAllByTestId("card");
		const textElements = cards.map(card => card.textContent);

		// toContain does not support asymmetric matchers on arrays — use arrayContaining
		expect(textElements).toEqual(
			expect.arrayContaining([
				expect.stringMatching(FREE_AND_NOT_FOR_PROFIT_MATCH_REGEX),
				expect.stringMatching(NO_ALGORITHMS_NO_ADS_MATCH_REGEX),
				expect.stringMatching(YOU_OWN_YOUR_DATA_MATCH_REGEX),
				expect.stringMatching(COMMUNITY_FIRST_ALWAYS_MATCH_REGEX),
			]),
		);
	});
});
