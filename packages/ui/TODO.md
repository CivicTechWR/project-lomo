# UI Package — TODO

## Migrate outline variant from `border` to `box-shadow`

- **What:** Change `outlineColors` and `outlineColorsHighContrast` in `color-treatments.ts` from using CSS `border` to `box-shadow: inset 0 0 0 1px`, matching the approach used by `surfaceColors`.
- **Why:** Radix Themes uses `box-shadow` for all border-like treatments (outline, surface). This avoids layout shift from border width, and enables advanced patterns like the double-ring high-contrast outline (`accent-a7` + `gray-a11` layered). Our `surfaceColors` already uses `box-shadow`, so `outlineColors` is inconsistent.
- **How:** Replace `border border-{color}-7` with `shadow-[inset_0_0_0_1px_var(--color-{color}-7)]` in `outlineColors`. For `outlineColorsHighContrast`, implement the Radix double-ring pattern: `shadow-[inset_0_0_0_1px_var(--color-{color}-7),inset_0_0_0_1px_var(--color-gray-11)]`. Then audit the Button `outline` variant to ensure it still renders correctly.
- **When:** After Badge component ships — this is a separate cleanup pass that touches Button too.
