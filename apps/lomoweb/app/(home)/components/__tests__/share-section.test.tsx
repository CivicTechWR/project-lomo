import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { ShareSection } from "../share-section.tsx";

vi.mock("next/image", () => ({
	default: ({ alt, src, className }: { alt: string; src: string; className?: string }) => (
		<img alt={alt} src={src} className={className} />
	),
}));

vi.mock("@repo/ui/heading", () => ({
	Heading: ({
		level,
		children,
		className,
	}: {
		level: number;
		children: React.ReactNode;
		className?: string;
	}) => {
		const Element = `h${level}` as React.ElementType;
		return <Element className={className}>{children}</Element>;
	},
}));

vi.mock("@repo/ui/text", () => ({
	Text: ({ children, className }: { children: React.ReactNode; className?: string }) => (
		<p className={className}>{children}</p>
	),
}));

vi.mock("@repo/ui/badge", () => ({
	Badge: ({ children, className }: { children: React.ReactNode; className?: string }) => (
		<span data-testid="badge" className={className}>
			{children}
		</span>
	),
}));

const SHARE_WHAT_YOU_CAN_REGEX = /Share What You Can/i;
const DROPPING_OFF_SUPPLIES_REGEX = /Dropping off supplies/i;
const FUNDING_A_MICROGRANT_REGEX = /Funding a microgrant/i;
const SHARING_EXTRA_GARDEN_PRODUCE_REGEX = /Sharing extra garden produce/i;

describe("shareSection", () => {
	it("asserts heading 'Share What You Can' is present", () => {
		render(<ShareSection />);
		const heading = screen.getByRole("heading", { name: SHARE_WHAT_YOU_CAN_REGEX, level: 2 });
		expect(heading).toBeInTheDocument();
	});

	it("asserts at least 3 Badge elements are rendered", () => {
		render(<ShareSection />);
		const badges = screen.getAllByTestId("badge");
		expect(badges.length).toBeGreaterThanOrEqual(3);
	});

	it("asserts required tag labels are present", () => {
		render(<ShareSection />);
		expect(screen.getByText(DROPPING_OFF_SUPPLIES_REGEX)).toBeInTheDocument();
		expect(screen.getByText(FUNDING_A_MICROGRANT_REGEX)).toBeInTheDocument();
		expect(screen.getByText(SHARING_EXTRA_GARDEN_PRODUCE_REGEX)).toBeInTheDocument();
	});

	it("asserts image has a non-empty alt attribute", () => {
		render(<ShareSection />);
		const images = screen.getAllByRole("img");
		expect(images.length).toBeGreaterThan(0);
		const image = images[0];
		expect(image).toHaveAttribute("alt");
		expect(image.getAttribute("alt")).not.toBe("");
	});
});
