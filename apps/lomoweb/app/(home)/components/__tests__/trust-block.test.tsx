import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TrustBlock } from "../trust-block.tsx";

const FREE_AND_NOT_FOR_PROFIT_REGEX = /Free & not-for-profit/i;
const NO_ALGORITHMS_NO_ADS_REGEX = /No algorithms, no ads/i;
const YOU_OWN_YOUR_DATA_REGEX = /You own your data/i;
const COMMUNITY_FIRST_ALWAYS_REGEX = /Community-first, always/i;
const OUR_VALUES_REGEX = /Our values/i;

describe("trustBlock", () => {
	it("renders four value statements", () => {
		const { container } = render(<TrustBlock />);
		const items = container.querySelectorAll("li");
		expect(items).toHaveLength(4);
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
		const { container } = render(<TrustBlock />);
		const items = Array.from(container.querySelectorAll("li"), li => li.textContent?.trim() || "");

		expect(items[0]).toContain("Free & not-for-profit");
		expect(items[1]).toContain("No algorithms, no ads");
		expect(items[2]).toContain("You own your data");
		expect(items[3]).toContain("Community-first, always");
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
		expect(section).toHaveClass("w-full");
	});
});
