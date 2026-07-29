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

describe("TrustBlock", () => {
	it("renders four Card elements", () => {
		render(<TrustBlock />);
		const cards = screen.getAllByTestId("card");
		expect(cards).toHaveLength(4);
	});

	it('renders "Free & not-for-profit" text', () => {
		render(<TrustBlock />);
		expect(screen.getByText(/Free & not-for-profit/i)).toBeInTheDocument();
	});

	it('renders "No algorithms, no ads" text', () => {
		render(<TrustBlock />);
		expect(screen.getByText(/No algorithms, no ads/i)).toBeInTheDocument();
	});

	it('renders "You own your data" text', () => {
		render(<TrustBlock />);
		expect(screen.getByText(/You own your data/i)).toBeInTheDocument();
	});

	it('renders "Community-first, always" text', () => {
		render(<TrustBlock />);
		expect(screen.getByText(/Community-first, always/i)).toBeInTheDocument();
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
		const section = screen.getByRole("region", { name: /Our values/i });
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
		const section = screen.getByRole("region", { name: /Our values/i });
		expect(section).toHaveClass("w-full", "bg-gray-1");
	});

	it("renders all four value statements are present (requires Free, No algorithms, You own, Community-first keywords)", () => {
		render(<TrustBlock />);

		// Check for required keywords as per requirements 11.2, 11.4
		expect(screen.getByText(/Free/)).toBeInTheDocument();
		expect(screen.getByText(/No algorithms/)).toBeInTheDocument();
		expect(screen.getByText(/You own/)).toBeInTheDocument();
		expect(screen.getByText(/Community-first/)).toBeInTheDocument();
	});

	it("renders exactly one Card element per value statement", () => {
		render(<TrustBlock />);
		const cards = screen.getAllByTestId("card");
		const textElements = cards.map(card => card.textContent);

		expect(textElements).toContain(expect.stringMatching(/Free & not-for-profit/));
		expect(textElements).toContain(expect.stringMatching(/No algorithms, no ads/));
		expect(textElements).toContain(expect.stringMatching(/You own your data/));
		expect(textElements).toContain(expect.stringMatching(/Community-first, always/));
	});
});
