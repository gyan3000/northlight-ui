# ADR-002: Headless primitives

- **Status:** Accepted
- **Date:** 2026-10-21

## Decision

Wrap **Radix UI** primitives for complex widgets (Dialog, Select, Tooltip, Tabs). Build simple components (Button, Input, Badge, Card) ourselves. Do not mix Radix with React Aria.

## Context

Focus trapping, focus restoration, typeahead, and ARIA wiring for overlays and listboxes are the easiest places to ship accessibility bugs. Reimplementing them costs time and adds risk for a solo project with an 8-week budget.

## Consequences

- Radix packages are **external** to our bundles (declared as dependencies, not inlined). The 5 KB per-component budget excludes them; their size is reported separately.
- Radix has no Combobox, so Combobox is a stretch item rather than a v1.0 commitment.
- `asChild` on our components uses `@radix-ui/react-slot`, matching the Radix convention.
