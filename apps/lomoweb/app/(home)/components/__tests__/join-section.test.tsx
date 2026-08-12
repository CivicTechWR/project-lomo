import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { JoinSection } from "../join-section.tsx";

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

const JOIN_THE_CIRCLE_REGEX = /Join the Circle/i;
const FREE_REGEX = /free/i;
const SOCIAL_MEDIA_REGEX = /social media/i;
const DATA_REGEX = /data/i;

describe("joinSection", () => {
	it("asserts heading 'Join the Circle' is present", () => {
		render(<JoinSection />);
		const heading = screen.getByRole("heading", { name: JOIN_THE_CIRCLE_REGEX, level: 2 });
		expect(heading).toBeInTheDocument();
	});

	it("asserts exactly one CTA button/link with href='/signup'", () => {
		render(<JoinSection />);
		const links = screen.getAllByRole("link");
		const signupLinks = links.filter(link => link.getAttribute("href") === "/signup");
		expect(signupLinks).toHaveLength(1);
	});

	it("asserts supporting text mentions 'free', social media login, and data ownership", () => {
		render(<JoinSection />);
		const supportingText = screen.getByText((content, element) => {
			const hasText = (el: Element | null) => {
				const text = el?.textContent || "";
				return FREE_REGEX.test(text) && SOCIAL_MEDIA_REGEX.test(text) && DATA_REGEX.test(text);
			};
			const elementHasText = hasText(element);
			const childrenDoNotHaveText = [...element?.children || []].every(child => !hasText(child));
			return elementHasText && childrenDoNotHaveText;
		});
		expect(supportingText).toBeInTheDocument();
	});
});
