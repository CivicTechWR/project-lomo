import { Icon, iconRegistry } from "@repo/ui/icons";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

/**
 * The design system opts out of Font Awesome's runtime stylesheet
 * (`config.autoAddCss = false`) and reproduces the layout rules it would have
 * supplied as Tailwind classes. These tests pin that contract: if the opt-out or
 * the replacement classes are ever dropped, icons silently render at the size of
 * their container, which is the failure mode the opt-out exists to prevent.
 */
describe("icon", () => {
	it("renders an svg for every name in the registry", () => {
		for (const name of Object.keys(iconRegistry) as (keyof typeof iconRegistry)[]) {
			const { container, unmount } = render(<Icon name={name} />);
			const svg = container.querySelector("svg");

			expect(svg, `no <svg> rendered for "${name}"`).not.toBeNull();
			// A real glyph, not an empty placeholder.
			expect(svg?.querySelector("path"), `no path data for "${name}"`).not.toBeNull();

			unmount();
		}
	});

	it("carries its own sizing so it does not inherit the container's box", () => {
		const { container } = render(<Icon name="home" />);
		const svg = container.querySelector("svg");

		expect(svg?.getAttribute("class")).toContain("size-4");
		expect(svg?.getAttribute("class")).toContain("inline-block");
		expect(svg?.getAttribute("class")).toContain("overflow-visible");
	});

	it("lets a caller override the default size without leaving two size classes behind", () => {
		const { container } = render(<Icon name="home" className="size-6" />);
		const classes = container.querySelector("svg")?.getAttribute("class") ?? "";

		expect(classes).toContain("size-6");
		expect(classes).not.toContain("size-4");
	});

	it("is hidden from assistive tech when decorative", () => {
		const { container } = render(<Icon name="notifications" />);

		expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
	});

	it("exposes an accessible name when labelled", () => {
		const { getByRole } = render(<Icon name="notifications" label="Notifications" />);

		// Queried by role so this fails if the name never reaches assistive tech,
		// which is what happened when the name was passed via the `title` prop.
		expect(getByRole("img", { name: "Notifications" })).toBeTruthy();
	});

	it("does not set aria-hidden=\"false\" on a labelled icon", () => {
		const { container } = render(<Icon name="notifications" label="Notifications" />);

		expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBeNull();
	});
});
