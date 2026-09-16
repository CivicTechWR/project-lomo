import type { CategoryItem } from "../category-badge-selector.tsx";
import { fireEvent, render } from "@testing-library/react";
import fc from "fast-check";
import { describe, expect, it, vi } from "vitest";
import { CategoryPicker } from "../category-picker.tsx";

vi.mock("next/image", () => ({
	default: ({ fill: _fill, priority: _priority, placeholder: _placeholder, quality: _quality, ...props }: any) => <img {...props} />,
}));

vi.mock("@repo/ui/badge", () => ({
	Badge: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
		<span data-testid="badge" {...props}>
			{children}
		</span>
	),
}));

/** Arbitrary for a valid category color */
const arbColor = fc.oneof(
	fc.constant("terracotta" as const),
	fc.constant("yellow" as const),
	fc.constant("sage" as const),
	fc.constant("red" as const),
);

const NON_WHITESPACE_RE = /^\S+$/;

/** Arbitrary for a single CategoryItem with a unique key */
const arbCategory: fc.Arbitrary<CategoryItem> = fc.record({
	key: fc.string({ minLength: 1, maxLength: 20 }).filter(s => NON_WHITESPACE_RE.test(s)),
	label: fc.string({ minLength: 1, maxLength: 30 }),
	color: arbColor,
});

/** Arbitrary for a non-empty list of categories with unique keys (at least 2 for switching tests) */
const arbCategories: fc.Arbitrary<CategoryItem[]> = fc
	.uniqueArray(arbCategory, { minLength: 2, maxLength: 8, selector: c => c.key });

/** Arbitrary for a descriptive alt text that is never a generic label */
const arbAltText = fc.string({ minLength: 5, maxLength: 60 })
	.filter(s => !s.toLowerCase().includes("category image") && s.trim().length > 0);

/**
 * Generate a complete CategoryPicker input: categories, images map, and defaultKey index.
 */
const arbPickerInput = arbCategories.chain(cats =>
	fc.tuple(
		fc.constant(cats),
		fc.tuple(
			...cats.map(() => arbAltText),
		),
		fc.integer({ min: 0, max: cats.length - 1 }),
	),
);

describe("categoryPicker - Property 5: Category image alt text reflects the active category", () => {
	it(
		"**Validates: Requirements 7.1, 7.2** — The initially displayed image has alt text matching the defaultKey's alt",
		() => {
			fc.assert(
				fc.property(
					arbPickerInput,
					([categories, altTexts, defaultIndex]) => {
						const images: Record<string, { src: string; alt: string }> = {};
						categories.forEach((cat, i) => {
							images[cat.key] = { src: `/img/${cat.key}.jpg`, alt: altTexts[i] };
						});
						const defaultKey = categories[defaultIndex].key;

						const { container } = render(
							<CategoryPicker
								categories={categories}
								images={images}
								defaultKey={defaultKey}
								badgePosition="right"
								sizes="(max-width: 768px) 100vw, 50vw"
							/>,
						);

						const img = container.querySelector("img");
						expect(img).not.toBeNull();
						expect(img!.getAttribute("alt")).toBe(images[defaultKey].alt);
					},
				),
				{ numRuns: 100 },
			);
		},
	);

	it(
		"**Validates: Requirements 7.1, 7.2** — When a different category badge is clicked, the alt text updates to match the new category's alt text",
		() => {
			fc.assert(
				fc.property(
					arbCategories.chain(cats =>
						fc.tuple(
							fc.constant(cats),
							fc.tuple(
								...cats.map(() => arbAltText),
							),
							fc.integer({ min: 0, max: cats.length - 1 }),
							fc.integer({ min: 0, max: cats.length - 1 }),
						),
					).filter(([_cats, , defaultIdx, clickIdx]) => defaultIdx !== clickIdx),
					([categories, altTexts, defaultIndex, clickIndex]) => {
						const images: Record<string, { src: string; alt: string }> = {};
						categories.forEach((cat, i) => {
							images[cat.key] = { src: `/img/${cat.key}.jpg`, alt: altTexts[i] };
						});
						const defaultKey = categories[defaultIndex].key;

						const { container } = render(
							<CategoryPicker
								categories={categories}
								images={images}
								defaultKey={defaultKey}
								badgePosition="right"
								sizes="(max-width: 768px) 100vw, 50vw"
							/>,
						);

						// Click a different category badge
						const buttons = container.querySelectorAll("button");
						fireEvent.click(buttons[clickIndex]);

						// After clicking, the image alt text should reflect the new category
						const img = container.querySelector("img");
						expect(img).not.toBeNull();
						expect(img!.getAttribute("alt")).toBe(images[categories[clickIndex].key].alt);
					},
				),
				{ numRuns: 100 },
			);
		},
	);

	it(
		"**Validates: Requirements 7.1, 7.2** — The alt text is never a generic label like 'Category image'",
		() => {
			fc.assert(
				fc.property(
					arbPickerInput,
					([categories, altTexts, defaultIndex]) => {
						const images: Record<string, { src: string; alt: string }> = {};
						categories.forEach((cat, i) => {
							images[cat.key] = { src: `/img/${cat.key}.jpg`, alt: altTexts[i] };
						});
						const defaultKey = categories[defaultIndex].key;

						const { container } = render(
							<CategoryPicker
								categories={categories}
								images={images}
								defaultKey={defaultKey}
								badgePosition="left"
								sizes="100vw"
							/>,
						);

						const img = container.querySelector("img");
						expect(img).not.toBeNull();
						const alt = img!.getAttribute("alt") || "";
						// Alt text should never be a generic label
						expect(alt.toLowerCase()).not.toBe("category image");
						expect(alt.toLowerCase()).not.toBe("image");
						expect(alt.trim().length).toBeGreaterThan(0);
					},
				),
				{ numRuns: 100 },
			);
		},
	);
});
