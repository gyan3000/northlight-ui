# ADR-001: Styling approach

- **Status:** Accepted
- **Date:** 2026-10-21

## Decision

CSS Modules plus CSS custom properties (design tokens). Zero runtime. Variants are mapped to class names with `class-variance-authority`.

## Context

The library needs theming that consumers can override with plain CSS and no rebuild, a small bundle, and compatibility with Next.js App Router (no runtime CSS-in-JS, no client-only style injection).

## Options considered

| Option | Why not / why |
| --- | --- |
| CSS Modules + CSS variables | **Chosen.** Zero runtime, scoped class names, works in RSC, supported natively by Vite. |
| vanilla-extract | Also zero runtime and typed, but adds a build plugin that every consumer toolchain-adjacent step (Storybook, tests) must support. |
| Tailwind + tokens | Ties consumers to Tailwind or ships generated utility CSS; harder to override with plain CSS. |
| Runtime CSS-in-JS | Rejected: runtime cost and poor RSC support. |

## Consequences

- Components reference **semantic** tokens only (`--nl-color-action`), never primitives or literals. Consumers re-theme by overriding semantic tokens.
- Logical CSS properties (`padding-inline`, `inline-size`) everywhere, so layouts are RTL-safe.
- Week 1 packaging spike result: Vite library mode with `cssCodeSplit: false` emits **one** `styles.css` for the whole library. Per-component CSS files are not produced yet. If a component-level CSS import turns out to matter for tree-shaking CSS, revisit (for example `cssCodeSplit: true` with per-entry CSS imports).
