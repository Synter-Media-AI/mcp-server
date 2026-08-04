# Publishing

Two artifacts, and **the order matters**.

1. **npm** — `@synterai/mcp-server`
2. **MCP registry** — `io.github.Synter-Media-AI/synter-ads`, via `.github/workflows/publish-mcp-registry.yml`

## npm must ship first

The registry proves you own the npm package by fetching the **published** `package.json` and checking its `mcpName` equals `server.json`'s `name`. It cannot see this repo. So if you register before npm has a version carrying the current `mcpName`, the registry compares against the *old* published value and rejects the publish.

That is not hypothetical: it is why version 1.2.2 exists. 1.2.1 shipped with `mcpName: io.github.synter-media-ai/synter-ads` (lowercase), which no longer matches, so registering had to wait for a new npm release.

```
bump version in package.json, server.json (twice: top level + packages[].version),
  and manifest.json                       -> all four must agree
node scripts/validate-discovery.mjs        -> must pass before you go further
npm publish                                -> ships the corrected mcpName
git tag vX.Y.Z && git push --tags          -> triggers the registry publish
```

`workflow_dispatch` on **Publish to MCP Registry** does the registry half on its own, for backfilling a version that reached npm without a tag.

## The namespace is case-sensitive

The server name **must** be `io.github.Synter-Media-AI/synter-ads` — matching the GitHub org's real casing, capitals included.

The reverse-DNS convention and nearly every example in the registry docs are lowercase, and the schema pattern `^[a-zA-Z0-9.-]+/[a-zA-Z0-9._-]+$` happily accepts either. But namespace *authorization* is derived from the org that owns the OIDC token and is compared case-sensitively:

```
403 Forbidden
You have permission to publish: io.github.Synter-Media-AI/*
Attempting to publish: io.github.synter-media-ai/synter-ads
```

`scripts/validate-discovery.mjs` now derives the expected namespace from `repository.url` and fails on a mismatch, so this cannot reach the registry again.

## Why a rejected publish is the good outcome

A registry version **cannot be un-published**. A bad field that gets rejected costs a CI run; one that gets accepted is permanent. Every check in `validate-discovery.mjs` runs before `mcp-publisher publish` for that reason, and the workflow additionally refuses to register an npm version that is not actually live.

## Known-stale registry entries

Neither can be cleaned up from this repo's workflow, because each needs auth for its own namespace:

| Entry | Problem |
|---|---|
| `io.github.Synter-Media-AI/synter-ads` @ 1.0.8 | Correct name, stale version. Superseded once a current version registers. |
| `io.github.jshorwitz/synter-ads` @ 1.0.2–1.0.7 | Legacy personal namespace. Wants `mcp-publisher status ... deprecated` under that account. |
