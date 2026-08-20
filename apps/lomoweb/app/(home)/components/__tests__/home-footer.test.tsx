import { render } from "@testing-library/react";
import fc from "fast-check";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { HomeFooter } from "../home-footer.tsx";

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

const WHITESPACE_REGEX = /\s+/g;
const EXPECTED_SAFETY_NOTICE = "If you are experiencing an emergency, please reach out to local emergency services or a crisis professional immediately. LoMo is here to help with community needs once you are safe.";

describe("homeFooter - Property 1: Safety notice is always present verbatim", () => {
	it(
		"**Validates: Requirements 10.7, 13.3** — should render safety notice verbatim across arbitrary contexts",
		() => {
			fc.assert(
				fc.property(
					fc.tuple(
						fc.integer({ min: 0, max: 1000 }),
						fc.boolean(),
					),
					() => {
						const { container } = render(<HomeFooter />);
						const footerText = container.textContent || "";
						// Normalize whitespace to account for JSX formatting/newlines
						const normalizedFooterText = footerText.replace(WHITESPACE_REGEX, " ");
						const normalizedExpected = EXPECTED_SAFETY_NOTICE.replace(WHITESPACE_REGEX, " ");

						expect(normalizedFooterText).toContain(normalizedExpected);
					},
				),
				{ numRuns: 100 },
			);
		},
	);

	it("renders footer element with dark background", () => {
		const { container } = render(<HomeFooter />);
		const footer = container.querySelector("footer");
		expect(footer).toBeInTheDocument();
		expect(footer).toHaveClass("bg-terracotta-12");
	});
});
