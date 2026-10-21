// Bundle budgets, enforced by `pnpm size` (and in CI). One entry per published
// component, measured the way a consumer's bundler would see it: the entry file
// plus the shared code it pulls in, minified and gzipped.
//
// `react`, `react-dom` and every `@radix-ui/*` package are left out. They are the
// peer and headless-primitive dependencies (see ADR-002), so the budget measures
// this library's own code. `class-variance-authority` is a regular dependency and
// IS counted.
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

const EXTERNAL = ["react", "react-dom", "react/jsx-runtime", "@radix-ui/*"];

// The PRD budgets gzipped size. size-limit defaults to brotli, so say gzip explicitly.
const GZIP = { gzip: true };

/** Budget for a single component entry point (the PRD's "each component under 5 KB gzipped"). */
const COMPONENT_LIMIT = "5 kB";

// Components with an entry in the exports map: "./button" -> dist/button.js
const components = Object.entries(pkg.exports)
  .filter(([key, value]) => key !== "." && typeof value === "object" && value.import)
  .map(([key, value]) => ({ name: key.slice(2), path: value.import.replace("./", "") }));

export default [
  ...components.map(({ name, path }) => ({
    name: `${name} (entry)`,
    path,
    ...GZIP,
    ignore: EXTERNAL,
    limit: COMPONENT_LIMIT,
  })),

  // The barrel must tree-shake: importing one component from the root must cost
  // about the same as its own entry, not the whole library.
  {
    name: "index: only Button (tree-shaking)",
    path: "dist/index.js",
    import: "{ Button }",
    ...GZIP,
    ignore: EXTERNAL,
    limit: COMPONENT_LIMIT,
  },
  {
    name: "index: only Dialog (tree-shaking)",
    path: "dist/index.js",
    import: "{ Dialog, DialogContent, DialogTrigger }",
    ...GZIP,
    ignore: EXTERNAL,
    limit: COMPONENT_LIMIT,
  },

  // Everything at once. Not a per-component budget; it guards against the library growing unnoticed.
  {
    name: "index: whole library",
    path: "dist/index.js",
    ...GZIP,
    ignore: EXTERNAL,
    limit: "15 kB",
  },

  // Styles. Today all components share one stylesheet, so this is the whole library's CSS,
  // not a per-component number. Tokens are separate so apps can load them once.
  { name: "styles.css (all components)", path: "dist/styles.css", ...GZIP, limit: "12 kB" },
  { name: "tokens.css (both styles, light and dark)", path: "dist/tokens.css", ...GZIP, limit: "4 kB" },
];
