# @repo/eslint-config

Shared ESLint configuration for the LoMo monorepo, based on `@antfu/eslint-config`.

## Usage

This package is consumed as a workspace dependency. In your app's `eslint.config.js`:

```js
import { GetConfig } from "@repo/eslint-config/react";

export default GetConfig({
	ignores: ["dist/**"],
});
```

## Style Rules

- Indentation: tabs
- Quotes: double
- Semicolons: always
- Formatters: enabled (no Prettier needed)
