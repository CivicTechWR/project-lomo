import { render } from "@testing-library/react";
import fc from "fast-check";
import { describe, expect, it, vi } from "vitest";
import { ContactSection } from "../contact-section.tsx";

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
		return <Element className={className}>{children}</Element>;
	},
}));

vi.mock("@repo/ui/text", () => ({
	Text: ({ children, className }: { children: React.ReactNode; className?: string }) => (
		<p className={className}>{children}</p>
	),
}));

vi.mock("@repo/ui/link", () => ({
	Link: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
		<a href={href} className={className}>
			{children}
		</a>
	),
}));

const VALID_HREF_PREFIX_REGEX = /^(mailto:|https?:\/\/)/;

describe("contactSection - Property 3: All contact hrefs are validly formatted", () => {
	it(
		"**Validates: Requirements 7.2** — should render validly formatted contact hrefs across varied contexts",
		() => {
			fc.assert(
				fc.property(
					fc.tuple(
						fc.integer({ min: 0, max: 1000 }),
						fc.boolean(),
					),
					() => {
						const { container } = render(<ContactSection />);
						const links = [...container.querySelectorAll("a")];

						expect(links.length).toBeGreaterThanOrEqual(1);

						for (const link of links) {
							const href = link.getAttribute("href") || "";
							expect(href).toMatch(VALID_HREF_PREFIX_REGEX);
						}
					},
				),
				{ numRuns: 100 },
			);
		},
	);

	it("renders Contact Us heading", () => {
		const { container } = render(<ContactSection />);
		const h2 = container.querySelector("h2");
		expect(h2).toBeInTheDocument();
		expect(h2?.textContent).toContain("Contact Us");
	});
});
