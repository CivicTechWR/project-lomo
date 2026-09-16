import { Button } from "@repo/ui/button";
import { Link } from "@repo/ui/link";
import { render, screen } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

describe("core UI contract", () => {
	it("renders bordered buttons by default", () => {
		render(<Button>Save</Button>);

		expect(screen.getByRole("button", { name: "Save" })).toHaveClass("border");
	});

	it("renders underlined links by default", () => {
		render(<Link href="/details">Learn more</Link>);

		expect(screen.getByRole("link", { name: "Learn more" })).toHaveClass("underline");
	});

	it("keeps link and button class names stable across SSR and hydration", () => {
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const serverHtml = renderToString(
			<div>
				<Link href="/signin" className="font-display font-black text-sm">Login</Link>
				<Button href="/signup" variant="solid" color="terracotta" size={2}>Sign Up</Button>
			</div>,
		);
		const container = document.createElement("div");
		container.innerHTML = serverHtml;
		document.body.appendChild(container);

		hydrateRoot(
			container,
			<div>
				<Link href="/signin" className="font-display font-black text-sm">Login</Link>
				<Button href="/signup" variant="solid" color="terracotta" size={2}>Sign Up</Button>
			</div>,
		);

		expect(errorSpy).not.toHaveBeenCalledWith(
			expect.stringContaining("Hydration failed"),
			expect.anything(),
		);
		document.body.removeChild(container);
		errorSpy.mockRestore();
	});
});
