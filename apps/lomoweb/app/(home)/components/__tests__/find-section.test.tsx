import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { FindSection } from "../find-section.tsx";

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

const FIND_WHAT_YOU_NEED_REGEX = /Find What You Need/i;
const GROCERY_SHARING_REGEX = /Grocery sharing/i;
const CRISIS_FUNDS_REGEX = /Crisis funds/i;
const WARM_MEALS_REGEX = /Warm meals/i;
const PEER_CHECK_INS_REGEX = /Peer check-ins/i;

describe("findSection", () => {
	it("asserts heading 'Find What You Need' is present", () => {
		render(<FindSection />);
		const heading = screen.getByRole("heading", { name: FIND_WHAT_YOU_NEED_REGEX, level: 2 });
		expect(heading).toBeInTheDocument();
	});

	it("asserts at least 4 Badge elements are rendered", () => {
		render(<FindSection />);
		const badges = screen.getAllByTestId("badge");
		expect(badges.length).toBeGreaterThanOrEqual(4);
	});

	it("asserts required tag labels are present", () => {
		render(<FindSection />);
		expect(screen.getByText(GROCERY_SHARING_REGEX)).toBeInTheDocument();
		expect(screen.getByText(CRISIS_FUNDS_REGEX)).toBeInTheDocument();
		expect(screen.getByText(WARM_MEALS_REGEX)).toBeInTheDocument();
		expect(screen.getByText(PEER_CHECK_INS_REGEX)).toBeInTheDocument();
	});

	it("asserts image has a non-empty alt attribute", () => {
		render(<FindSection />);
		const images = screen.getAllByRole("img");
		expect(images.length).toBeGreaterThan(0);
		const image = images[0];
		expect(image).toHaveAttribute("alt");
		expect(image.getAttribute("alt")).not.toBe("");
	});
});
