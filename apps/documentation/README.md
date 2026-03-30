# LoMo Webapp

The frontend for LoMo — built with React 19, TypeScript, and Vite.

## Stack

- **React 19** with the React Compiler enabled
- **TypeScript**
- **Vite 7**
- **ESLint** (shared config from `@repo/eslint-config`)

## Dev

From the repo root:

```bash
bun run dev:web
```

Or from this directory:

```bash
bun run dev
```

Runs at `http://localhost:5173`.

## Commands

| Command            | Description              |
| ------------------ | ------------------------ |
| `bun run dev`      | Start dev server         |
| `bun run build`    | Type-check and build     |
| `bun run lint`     | Lint                     |
| `bun run lint:fix` | Auto-fix lint issues     |
| `bun run preview`  | Preview production build |
