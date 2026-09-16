import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { ContactSection } from "../components/contact-section.tsx";
import { FindSection } from "../components/find-section.tsx";
import { HeroSection } from "../components/hero-section.tsx";
import { HomeFooter } from "../components/home-footer.tsx";
import { HomeNav } from "../components/home-nav.tsx";
import { HowItWorksSection } from "../components/how-it-works-section.tsx";
import { JoinSection } from "../components/join-section.tsx";
import { ShareSection } from "../components/share-section.tsx";
import { TrustBlock } from "../components/trust-block.tsx";

vi.mock("next/image", () => ({
	default: ({
		alt,
		src,
		className,
		"aria-hidden": ariaHidden,
		fill: _fill,
		priority: _priority,
		placeholder: _placeholder,
		quality: _quality,
		...props
	}: {
		"alt"?: string;
		"src": string;
		"className"?: string;
		"aria-hidden"?: boolean | "true" | "false";
		"fill"?: boolean;
		"priority"?: boolean;
		"placeholder"?: string;
		"quality"?: number | string;
		[key: string]: any;
	}) => (
		<img
			alt={alt ?? ""}
			src={src}
			className={className}
			aria-hidden={ariaHidden as unknown as boolean}
			{...props}
		/>
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

vi.mock("@repo/ui/link", () => ({
	Link: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
		<a href={href} className={className}>
			{children}
		</a>
	),
}));

vi.mock("@repo/ui/badge", () => ({
	Badge: ({ children, className }: { children: React.ReactNode; className?: string }) => (
		<span className={className}>{children}</span>
	),
}));

vi.mock("@repo/ui/card", () => ({
	Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
		<div className={className}>{children}</div>
	),
}));

vi.mock("@repo/ui/icons", () => ({
	LomoLogo: () => <svg data-testid="lomo-logo" />,
}));

function AssembledHomePage() {
	return (
		<>
			<HomeNav />
			<main>
				<HeroSection />
				<TrustBlock />
				<HowItWorksSection />
				<FindSection />
				<ShareSection />
				<JoinSection />
				<ContactSection />
			</main>
			<HomeFooter />
		</>
	);
}

describe("accessibility Audit for Homepage", () => {
	it("has correct page landmark hierarchy (header, main, footer)", () => {
		const { container } = render(<AssembledHomePage />);
		const header = container.querySelector("header");
		const main = container.querySelector("main");
		const footer = container.querySelector("footer");

		expect(header).toBeInTheDocument();
		expect(main).toBeInTheDocument();
		expect(footer).toBeInTheDocument();
	});

	it("has exactly one h1 heading on the page", () => {
		const { container } = render(<AssembledHomePage />);
		const h1s = container.querySelectorAll("h1");
		expect(h1s).toHaveLength(1);
	});

	it("decorative images are hidden from assistive tech and informative images have alt text", () => {
		const { container } = render(<AssembledHomePage />);
		const images = [...container.querySelectorAll("img")];
		expect(images.length).toBeGreaterThan(0);
		for (const img of images) {
			expect(img).toHaveAttribute("alt");
			const isDecorative = img.getAttribute("aria-hidden") === "true";
			if (isDecorative) {
				expect(img.getAttribute("alt")?.trim() ?? "").toBe("");
			}
			else {
				expect(img.getAttribute("alt")?.trim()).not.toBe("");
			}
		}
	});

	it("all interactive anchor links have non-empty href and accessible content", () => {
		const { container } = render(<AssembledHomePage />);
		const links = [...container.querySelectorAll("a")];
		expect(links.length).toBeGreaterThan(0);
		for (const link of links) {
			expect(link).toHaveAttribute("href");
			expect(link.getAttribute("href")).not.toBe("");
			expect(link.textContent?.trim() || link.querySelector("svg")).toBeTruthy();
		}
	});

	it("sections have valid aria-label region names", () => {
		const { container } = render(<AssembledHomePage />);
		const sections = [...container.querySelectorAll("section")];
		expect(sections.length).toBeGreaterThan(0);
		for (const section of sections) {
			expect(section).toHaveAttribute("aria-label");
			expect(section.getAttribute("aria-label")?.trim()).not.toBe("");
		}
	});
});
