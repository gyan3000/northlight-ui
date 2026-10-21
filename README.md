# Northlight UI

An accessible, themeable React component library (npm package: `northlight-ui`) built on a CSS-variable design-token system. Work in progress; see the PRD for scope and milestones.

**Live documentation:** https://gyan3000.github.io/northlight-ui/ (Storybook: components, design tokens, guides and recipes)

## Status

- 34 components plus `ThemeProvider`, each with tests, stories and a right-to-left variant.
- Two visual styles (glass and aurora, soft neo-brutalist), each in light and dark.
- Checked with axe in jsdom and in a real browser (`pnpm a11y`), with bundle budgets enforced (`pnpm size`).
- Not published to npm yet. See [Releasing](#releasing).

## Requirements

- Node 20+ (`.nvmrc` pins 22)
- pnpm 12 (`corepack enable`)

## Getting started

```bash
pnpm install
pnpm build        # tokens first, then the React package
pnpm test         # token tests + component tests with coverage
pnpm typecheck
pnpm storybook    # docs site at http://localhost:6006
pnpm size         # bundle budgets: each component entry under 5 kB gzipped (Radix and React excluded)
pnpm a11y         # builds Storybook, runs axe in Chromium on every story (2 styles x 2 themes)
```

## Layout

| Path | Purpose |
| --- | --- |
| `packages/tokens` | JSON design tokens compiled to `dist/tokens.css` |
| `packages/react` | The components (`northlight-ui`) |
| `apps/docs` | Storybook |
| `docs/adr` | Architecture decision records |

## Usage

```tsx
import "northlight-ui/tokens.css";
import "northlight-ui/styles.css";
import { Button, ThemeProvider } from "northlight-ui";

export function App() {
  return (
    <ThemeProvider>
      <Button>Save</Button>
    </ThemeProvider>
  );
}
```

Icons: `Button` takes `startIcon` / `endIcon`, which accept any React node. The library ships no icon set, so use whichever your app already has, for example Font Awesome:

```tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

<Button startIcon={<FontAwesomeIcon icon={faPlus} />}>New project</Button>
```

Visual styles: two ship in the box. **Glass and aurora** is the default. Set `data-style="brutal"` on `<html>` for the soft neo-brutalist style. `data-theme="light" | "dark"` picks the color scheme (system preference by default). Put both attributes on the same element.

Re-theme by overriding semantic tokens in plain CSS:

```css
:root {
  --nl-color-action: #0d9488;
}
```

## Component checklist ("done" means all of these)

Code, CSS Module using tokens only, unit tests with axe, Storybook stories with a keyboard play function, an RTL story, and docs.

## Releasing

Releases use [Changesets](https://github.com/changesets/changesets). For any user-facing change, run `pnpm changeset`
and commit the file it creates. When changes reach `main`, the Release workflow opens a "chore: version packages" pull
request; merging it publishes `northlight-ui` to npm with provenance. Setup the workflow needs is described in
`.github/workflows/release.yml`.

## Documentation site

The Docs workflow builds the Storybook and deploys it to GitHub Pages on every push to `main`
(repository Settings > Pages > Source: GitHub Actions).

## License

No license is granted. The code is public to read, but all rights are reserved: it may not be copied, modified or redistributed without permission.
