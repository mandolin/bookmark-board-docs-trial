# Bookmark Board Docs Trial

`Bookmark Board Docs Trial` is a small ordinary JavaScript project used as a public consumer trial for HIA documentation packages. It is intentionally outside the HIA source repositories and installs HIA tooling from the public npm registry.

## Documentation Check

```powershell
npm ci
npm run test:docs
```

The check performs a clean consumer-style documentation build:

- runs JSDoc with `@mandolin/jsdoc-plugin-hia-sys` and `@mandolin/jsdoc-theme-hia`;
- emits `docs/jsdoc/hia-integration.json`;
- runs `@hia-doc/cli` to produce unified HTML under `docs/unified`;
- verifies entry counts, source linkage privacy, and output path hygiene.

## Evidence Boundary

This repository is public consumer evidence for the currently published JavaScript/JSDoc path. HTMDoc/CSSDoc consumer evidence is intentionally not included yet because those doc-line runner/producer packages have not been published to npm at the time of this trial.
