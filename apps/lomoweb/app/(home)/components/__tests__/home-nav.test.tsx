import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeNav } from "../home-nav.tsx";

vi.mock("@repo/ui/link", () => ({
	Link: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
		<a href={href} className={className}>
			{children}
		</a>
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

vi.mock("@repo/ui/icons", () => ({
	LomoLogo: ({ className }: { className?: string }) => (
		<svg aria-label="LoMo logo" className={className} />
	),
}));

describe("HomeNav", () => {
	it("displays the LoMo brand name", () => {
		render(<HomeNav />);
		expect(screen.getByText("LoMo")).toBeVisible();
	});

	it("Login link navigates to /signin", () => {
		render(<HomeNav />);
		const loginLink = screen.getByRole("link", { name: /login/i });
		expect(loginLink).toHaveAttribute("href", "/signin");
	});

	it("Sign Up link navigates to /signup", () => {
		render(<HomeNav />);
		const signUpLink = screen.getByRole("link", { name: /sign up/i });
		expect(signUpLink).toHaveAttribute("href", "/signup");
	});
});
