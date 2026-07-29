import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HeroSection } from "../hero-section.tsx";

vi.mock("next/image", () => ({
	default: ({ alt, src, className }: { alt: string; src: string; className?: string }) => (
		<img alt={alt} src={src} className={className} />
	),
}));

vi.mock("@repo/ui/button", () => ({
	Button: ({ href, children, className }: { href?: string; children: React.ReactNode; className?: string }) =>
		href ? (
			<a href={href} className={className}>
				{children}
			</a>
		) : (
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
		const Element = `h${level}` as keyof JSX.IntrinsicElements;
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

describe("HeroSection", () => {
	it("displays h1 heading that contains 'Waterloo'", () => {
		render(<HeroSection />);
		const heading = screen.getByRole("heading", { level: 1 });
		expect(heading).toBeVisible();
		expect(heading.textContent).toContain("Waterloo");
	});

	it("primary CTA has href='/signup' with accessible name", () => {
		render(<HeroSection />);
		const primaryCTA = screen.getByRole("link", { name: /get started/i });
		expect(primaryCTA).toHaveAttribute("href", "/signup");
		expect(primaryCTA).toHaveAccessibleName();
	});

	it("secondary CTA has href='/signin'", () => {
		render(<HeroSection />);
		const secondaryCTA = screen.getByRole("link", { name: /sign in/i });
		expect(secondaryCTA).toHaveAttribute("href", "/signin");
	});

	it("image has non-empty alt attribute", () => {
		render(<HeroSection />);
		const image = screen.getByAltText(/community members sharing resources/i);
		expect(image).toBeVisible();
		expect(image).toHaveAttribute("alt");
		const altText = image.getAttribute("alt");
		expect(altText).toBeTruthy();
		expect(altText).not.toBe("");
	});
});
