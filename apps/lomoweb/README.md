# LoMo web (`@repo/lomoweb`)

Next.js 16 app for LoMo (landing page, sign-in, signup, authenticated home, help request flow).

## Homepage (Landing Page)

The public landing page lives at `/` and is rendered by the `(home)` route group. Authenticated users are redirected to `/app` automatically.

### Route structure

```
app/(home)/
  layout.tsx          — Route group layout (skip-to-content link, data-radius="full")
  page.tsx            — Page component, auth redirect, section composition
  components/         — All homepage-specific components
```

### Section order

The page renders sections in this order:

| # | Component | Purpose |
|---|-----------|---------|
| 1 | `ScrollAwareNav` + `HomeNav` | Sticky navigation bar (logo, login, signup) |
| 2 | `HeroSection` | Headline, tagline, description, CTA buttons, editorial illustration |
| 3 | `TrustBlock` | Four value cards (free, no ads, data ownership, community-first) |
| 4 | `HowItWorksSection` | 4-step process cards explaining the mutual aid flow |
| 5 | `FindSection` | "Find what you need" — category picker with image cards (grocery, check-ins, crisis, meals) |
| 6 | `ShareSection` | "Share what you can" — category picker (supplies, microgrants, produce) |
| 7 | `JoinSection` | CTA section with community image and signup button |
| 8 | `ContactSection` | Email link for community inquiries |
| 9 | `HomeFooter` | Brand, safety notice, copyright |

### Key patterns

- **Shared styles** — `styles.ts` exports reusable Tailwind class strings via a `tw()` utility (section padding, button variants, badge styles, card surfaces).
- **CategorySection** — A reusable layout component used by both `FindSection` and `ShareSection`. Accepts `layout="image-first"` or `layout="text-first"` to alternate visual rhythm between sections.
- **CategoryPicker** — Client component that lets users toggle category badges to swap the displayed image card.
- **Design system components** — Buttons, headings, text, badges, cards, and links are imported from `@repo/ui`.
- **Accessibility** — Skip-to-content link in the layout, `aria-label` on every `<section>`, `sr-only` headings where visual headings are absent, 44px minimum touch targets (`min-h-11`).

### Visual design language

- **Colors** — Warm palette: terracotta (CTAs, accents), yellow (brand, highlights), sage (secondary), black borders.
- **Typography** — Display font (`Andada Pro`) for headings and buttons, `Geist` for body, `MuseoModerno` for the logo.
- **Shapes** — Rounded pills (`rounded-full`), large radius cards (`rounded-5`), 2px black borders throughout.
- **Images** — Grayscale by default with warm overlay; color on hover. Contained in oval/rounded frames with black borders.

### Adding a new section

1. Create a component in `app/(home)/components/`.
2. Import shared styles from `./styles` for consistent spacing and surfaces.
3. Use `@repo/ui` primitives (Heading, Text, Button, Card, Badge, Link).
4. Add an `aria-label` to the `<section>` element.
5. Import and place the component in `page.tsx` in the desired order.

## Convex backend

The app calls Convex functions (for example `helpRequests:listMine`). Those only exist on your deployment after the **Convex dev server** has pushed them from this repo.

1. From the repo root, run **`bun run dev`** and include **both** `@repo/lomoweb` and **`@repo/convex-backend`** (Turbo TUI), **or**
2. In a separate terminal:

   ```bash
   cd apps/convex-backend && bun run dev
   ```

   Leave this running while you use the Next app. It should show successful sync when `convex/helpRequests.ts` (and the rest of `convex/`) is saved.

If you only run `next dev` for lomoweb, the UI will hit Convex without the latest functions and you may see:

`Could not find public function for 'helpRequests:listMine'. Did you forget to run npx convex dev?`

**Check:** `NEXT_PUBLIC_CONVEX_URL` in `apps/lomoweb/.env.local` must match the deployment that `convex dev` is using (same Convex project / dev deployment).

## Local Next.js

```bash
cd apps/lomoweb && bun run dev
```

Open [http://localhost:3000](http://localhost:3000).
