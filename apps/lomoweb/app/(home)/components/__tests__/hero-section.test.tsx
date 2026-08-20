import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { HeroSection } from "../hero-section.tsx";

vi.mock("@repo/ui/button", () => ({
	Button: ({ href, children, className }: { href?: string; children: React.ReactNode; className?: string }) =>
		href
			? (
					<a href={href} className={className}>
						{children}
					</a>
				)
			: (
					<button type="button" className={className}>
						{children}
					</button>
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
		return (
			<Element className={className}>
				{children}
			</Element>
		);
	},
}));

vi.mock("@repo/ui/text", () => ({
	Text: ({ children, className }: { children: React.ReactNode; className?: string }) => (
		<p className={className}>{children}</p>
	),
}));

const GET_STARTED_REGEX = /get started/i;
const SIGN_IN_REGEX = /sign in/i;

describe("heroSection", () => {
	it("displays h1 heading that contains 'Waterloo'", () => {
		render(<HeroSection />);
		const heading = screen.getByRole("heading", { level: 1 });
		expect(heading).toBeVisible();
		expect(heading.textContent).toContain("Waterloo");
	});

	it("primary CTA has href='/signup' with accessible name", () => {
		render(<HeroSection />);
		const primaryCTA = screen.getByRole("link", { name: GET_STARTED_REGEX });
		expect(primaryCTA).toHaveAttribute("href", "/signup");
		expect(primaryCTA).toHaveAccessibleName();
	});

	it("secondary CTA has href='/signin'", () => {
		render(<HeroSection />);
		const secondaryCTA = screen.getByRole("link", { name: SIGN_IN_REGEX });
		expect(secondaryCTA).toHaveAttribute("href", "/signin");
	});
});
