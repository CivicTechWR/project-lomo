import { render } from "@testing-library/react";
import fc from "fast-check";
import { describe, expect, it, vi } from "vitest";
import { CategoryImageCard } from "../category-image-card.tsx";

vi.mock("next/image", () => ({
	default: ({ fill: _fill, priority: _priority, placeholder: _placeholder, quality: _quality, ...props }: any) => <img {...props} />,
}));

const WHITESPACE_RE = /\s/g;

/** Arbitrary for a URL-like src string */
const arbSrc = fc.oneof(
	fc.webUrl(),
	fc.string({ minLength: 1, maxLength: 80 }).map(s => `/${s.replace(WHITESPACE_RE, "-")}.jpg`),
);

/** Arbitrary for alt text */
const arbAlt = fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0);

/** Arbitrary for a sizes attribute string */
const arbSizes = fc.oneof(
	fc.constant("100vw"),
	fc.constant("(max-width: 768px) 100vw, 50vw"),
	fc.constant("(max-width: 1024px) 80vw, 40vw"),
	fc.string({ minLength: 1, maxLength: 60 }).filter(s => s.trim().length > 0),
);

describe("categoryImageCard - Property 6: CategoryImageCard renders provided props into the image element", () => {
	it(
		"**Validates: Requirements 11.4** — For any valid src, alt, and sizes props, the rendered img element has matching attributes",
		() => {
			fc.assert(
				fc.property(
					arbSrc,
					arbAlt,
					arbSizes,
					(src, alt, sizes) => {
						const { container } = render(
							<CategoryImageCard src={src} alt={alt} sizes={sizes} />,
						);

						const img = container.querySelector("img");
						expect(img).not.toBeNull();
						expect(img!.getAttribute("src")).toBe(src);
						expect(img!.getAttribute("alt")).toBe(alt);
						expect(img!.getAttribute("sizes")).toBe(sizes);
					},
				),
				{ numRuns: 100 },
			);
		},
	);
});
