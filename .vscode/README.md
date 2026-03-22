# VS Code Workspace Settings

## Tailwind CSS IntelliSense

The [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension is recommended (see `extensions.json`). The workspace settings configure it for this monorepo:

### `configFile` mapping

```jsonc
"tailwindCSS.experimental.configFile": {
    "apps/webapp/src/app.css": ["apps/webapp/**"],
    "packages/ui/src/theme/theme.css": ["packages/ui/**"]
}
```

Each package maps to its own CSS entry point so the extension resolves the correct `@theme` tokens and `@source` scopes. When adding a new app or package that uses Tailwind, add another entry here.

### `classRegex` patterns

```jsonc
"tailwindCSS.experimental.classRegex": [
    ["tw\\(([^)]*?)\\)", "[\"'`]([^\"'`]*)[\"'`]"],
    ["cn\\(([^;]*?)\\)", "[\"'`]([^\"'`]*)[\"'`]"]
]
```

These tell the extension where to find Tailwind class strings beyond the standard `className` attribute:

- **`tw()`** — Identity function used in `@repo/ui` variant files. It does nothing at runtime but gives IntelliSense a function call to anchor on. Use `tw("...")` whenever you write Tailwind classes in plain string variables outside of `tv()` or `cn()` calls.
- **`cn()`** — Class merging utility (wraps `tailwind-merge`). Used at component call sites to conditionally compose classes.

We intentionally do **not** add a regex for `tv()` — its deeply nested object structure can cause the extension to hang. If you need IntelliSense while editing a `tv()` call, use `tw("...")` for the class string and pass the result to `tv()`.
