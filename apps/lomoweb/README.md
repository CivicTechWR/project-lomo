# LoMo web (`@repo/lomoweb`)

Next.js app for LoMo (sign-in, signup, authenticated home, help request flow).

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
