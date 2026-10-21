# Changesets

Every user-facing change gets a changeset: a small file saying which package changed and how much
(`patch` for fixes, `minor` for new components or props, `major` for breaking changes to props or tokens).

```bash
pnpm changeset
```

Commit the generated file with your change. When changes reach `main`, the release workflow opens a
"chore: version packages" pull request that bumps the version and updates the changelog. Merging that
pull request publishes to npm (once the package is no longer `private`).

Only `northlight-ui` is released. The tokens package and the docs app are ignored.
