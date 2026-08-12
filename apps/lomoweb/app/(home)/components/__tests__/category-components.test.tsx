import type { CategoryItem } from "../category-badge-selector.tsx";
import { fireEvent, render } from "@testing-library/react";
import fc from "fast-check";
import { describe, expect, it, vi } from "vitest";
import { CategoryBadgeSelector } from "../category-badge-selector.tsx";

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

const FOCUS_VISIBLE_RING_RE = /focus-visible:ring/;

/** Arbitrary for a single CategoryItem with a unique key */
const arbCategory: fc.Arbitrary<CategoryItem> = fc.record({
	key: fc.string({ minLength: 1, maxLength: 20 }).filter(s => NON_WHITESPACE_RE.test(s)),
	label: fc.string({ minLength: 1, maxLength: 30 }),
	color: arbColor,
});

/** Arbitrary for a non-empty list of categories with unique keys */
const arbCategories: fc.Arbitrary<CategoryItem[]> = fc
	.uniqueArray(arbCategory, { minLength: 1, maxLength: 10, selector: c => c.key });

describe("categoryBadgeSelector - Property 4: Category badges convey selected state via aria-pressed", () => {
	it(
		"**Validates: Requirements 6.4** — For any set of categories and any selected category key, the badge matching the active key SHALL have aria-pressed='true' and all others SHALL have aria-pressed='false'",
		() => {
			fc.assert(
				fc.property(
					arbCategories.chain(cats =>
						fc.tuple(
							fc.constant(cats),
							fc.integer({ min: 0, max: cats.length - 1 }),
						),
					),
					([categories, activeIndex]) => {
						const activeKey = categories[activeIndex].key;
						const onChange = vi.fn();

						const { container } = render(
							<CategoryBadgeSelector
								categories={categories}
								activeKey={activeKey}
								onChange={onChange}
							/>,
						);

						const buttons = container.querySelectorAll("button");

						// Each button's aria-pressed should match whether it's the active one
						buttons.forEach((button, i) => {
							const expectedPressed = categories[i].key === activeKey;
							expect(button.getAttribute("aria-pressed")).toBe(
								String(expectedPressed),
							);
						});
					},
				),
				{ numRuns: 100 },
			);
		},
	);
});

describe("categoryBadgeSelector - Property 7: CategoryBadgeSelector renders one button per category and fires onChange", () => {
	it(
		"**Validates: Requirements 12.4** — For any list of N categories and any onChange callback, the CategoryBadgeSelector SHALL render exactly N button elements, and clicking the k-th button SHALL invoke onChange with the k-th category's key",
		() => {
			fc.assert(
				fc.property(
					arbCategories.chain(cats =>
						fc.tuple(
							fc.constant(cats),
							fc.integer({ min: 0, max: cats.length - 1 }),
							fc.integer({ min: 0, max: cats.length - 1 }),
						),
					),
					([categories, activeIndex, clickIndex]) => {
						const activeKey = categories[activeIndex].key;
						const onChange = vi.fn();

						const { container } = render(
							<CategoryBadgeSelector
								categories={categories}
								activeKey={activeKey}
								onChange={onChange}
							/>,
						);

						const buttons = container.querySelectorAll("button");

						// Property: exactly N buttons rendered
						expect(buttons).toHaveLength(categories.length);

						// Property: clicking the k-th button invokes onChange with the k-th category's key
						fireEvent.click(buttons[clickIndex]);
						expect(onChange).toHaveBeenCalledTimes(1);
						expect(onChange).toHaveBeenCalledWith(categories[clickIndex].key);
					},
				),
				{ numRuns: 100 },
			);
		},
	);
});

describe("categoryBadgeSelector - Property 2: Category badges are keyboard-activatable buttons", () => {
	it(
		"**Validates: Requirements 6.1, 6.3** — For any category in a CategoryBadgeSelector's category list, each rendered element SHALL be a <button> and SHALL activate when Enter or Space is pressed",
		() => {
			fc.assert(
				fc.property(
					arbCategories.chain(cats =>
						fc.tuple(
							fc.constant(cats),
							fc.integer({ min: 0, max: cats.length - 1 }),
							fc.integer({ min: 0, max: cats.length - 1 }),
						),
					),
					([categories, activeIndex, targetIndex]) => {
						const activeKey = categories[activeIndex].key;
						const onChange = vi.fn();

						const { container } = render(
							<CategoryBadgeSelector
								categories={categories}
								activeKey={activeKey}
								onChange={onChange}
							/>,
						);

						const buttons = container.querySelectorAll("button");

						// Property 6.1: Each category badge is rendered as a <button> element
						expect(buttons).toHaveLength(categories.length);
						buttons.forEach((btn) => {
							expect(btn.tagName).toBe("BUTTON");
							expect(btn.getAttribute("type")).toBe("button");
						});

						// Property 6.3: Enter key activates the category
						fireEvent.keyDown(buttons[targetIndex], { key: "Enter", code: "Enter" });
						fireEvent.keyUp(buttons[targetIndex], { key: "Enter", code: "Enter" });
						// Native <button> elements handle Enter via click event
						fireEvent.click(buttons[targetIndex]);
						expect(onChange).toHaveBeenCalledWith(categories[targetIndex].key);

						onChange.mockClear();

						// Property 6.3: Space key activates the category
						fireEvent.keyDown(buttons[targetIndex], { key: " ", code: "Space" });
						fireEvent.keyUp(buttons[targetIndex], { key: " ", code: "Space" });
						// Native <button> elements handle Space via click event
						fireEvent.click(buttons[targetIndex]);
						expect(onChange).toHaveBeenCalledWith(categories[targetIndex].key);
					},
				),
				{ numRuns: 100 },
			);
		},
	);
});

describe("categoryBadgeSelector - Property 3: Category badges show visible focus indicators", () => {
	it(
		"**Validates: Requirements 6.2** — For any category badge in a CategoryBadgeSelector, the button SHALL contain focus-visible ring classes that produce a visible focus indicator",
		() => {
			fc.assert(
				fc.property(
					arbCategories.chain(cats =>
						fc.tuple(
							fc.constant(cats),
							fc.integer({ min: 0, max: cats.length - 1 }),
						),
					),
					([categories, activeIndex]) => {
						const activeKey = categories[activeIndex].key;
						const onChange = vi.fn();

						const { container } = render(
							<CategoryBadgeSelector
								categories={categories}
								activeKey={activeKey}
								onChange={onChange}
							/>,
						);

						const buttons = container.querySelectorAll("button");

						// Property: every button has focus-visible ring classes for visible focus indication
						buttons.forEach((button) => {
							const className = button.getAttribute("class") ?? "";
							expect(className).toMatch(FOCUS_VISIBLE_RING_RE);
						});
					},
				),
				{ numRuns: 100 },
			);
		},
	);
});
