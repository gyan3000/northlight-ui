# northlight-ui

Accessible, themeable React components built on a CSS-variable design-token system.
34 components, two visual styles (glass and aurora, soft neo-brutalist), light and dark, typed with TypeScript.

React 18 or 19 is a peer dependency.

## Install

```bash
npm install northlight-ui
```

## Use

```tsx
import "northlight-ui/tokens.css";   // design tokens (CSS variables)
import "northlight-ui/styles.css";   // component styles
import { Button, FormField, Input, ThemeProvider } from "northlight-ui";

export function App() {
  return (
    <ThemeProvider>
      <FormField label="Email" hint="We never share it.">
        <Input type="email" />
      </FormField>
      <Button>Save</Button>
    </ThemeProvider>
  );
}
```

Import a single component to keep bundles small: `import { Button } from "northlight-ui/button"`.

## Styles and themes

Set attributes on `<html>`: `data-style="brutal"` for the soft neo-brutalist style (glass and aurora is the default)
and `data-theme="light" | "dark"` (follows the system when absent). Every value is a CSS variable (`--nl-*`),
so you can re-theme with plain CSS.

## More

Source, documentation and issues: https://github.com/gyan3000/northlight-ui
