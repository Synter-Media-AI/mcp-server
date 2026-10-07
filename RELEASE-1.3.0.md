# Releasing 1.3.0

Nothing here has been run. This is the sequence for Joel's GO, after this PR (and #25 beneath it) is merged to
`main`. Order matters: the registry workflow refuses to register a version that is not already on npm (see
[PUBLISHING.md](PUBLISHING.md)).

## 1. Build and test from a clean `main`

```sh
git checkout main && git pull --ff-only
npm ci && npm run build && npm test
```

`package-lock.json` is in `.gitignore`, so a fresh clone has no lockfile and `npm ci` will refuse to run. In that
case use `npm install && npm run build && npm test` (this is what `.github/workflows/ci.yml` does).

Optional sanity checks:

```sh
node scripts/validate-discovery.mjs   # versions agree across package.json/server.json/manifest.json/gemini-extension.json
npm audit --omit=dev                  # expect: found 0 vulnerabilities
npm pack --dry-run                    # expect 11 files: LICENSE, README.md, package.json, dist/*
```

## 2. Publish to npm

```sh
npm whoami                     # must be an account with publish rights on @synterai
npm publish --access public
```

`prepublishOnly` runs `npm run build` again. Do not add `--provenance` for a local publish: npm provenance needs
an OIDC-capable CI runner (GitHub Actions with `id-token: write`). There is no npm publish workflow in this repo
today, so provenance only applies if one is added.

Verify:

```sh
npm view @synterai/mcp-server version            # 1.3.0
npm view @synterai/mcp-server@1.3.0 dependencies # @modelcontextprotocol/sdk: ^1.32.1
npm view @synterai/mcp-server@1.3.0 mcpName      # io.github.Synter-Media-AI/synter-ads
```

## 3. Tag, which publishes server.json to the MCP Registry

```sh
git tag v1.3.0 && git push origin v1.3.0
```

Pushing a `v*` tag triggers [`.github/workflows/publish-mcp-registry.yml`](.github/workflows/publish-mcp-registry.yml)
(it can also be run by hand with `workflow_dispatch`). The job, on `ubuntu-latest` with `id-token: write`:

1. Runs `node scripts/validate-discovery.mjs`.
2. Checks the tag (`v1.3.0` → `1.3.0`) equals `server.json` `version`; fails otherwise.
3. Checks `npm view @synterai/mcp-server@1.3.0` succeeds, i.e. step 2 above already happened; fails otherwise.
4. Downloads the latest `mcp-publisher` release from `github.com/modelcontextprotocol/registry`.
5. `mcp-publisher login github-oidc` (namespace `io.github.Synter-Media-AI/*` is proved by the workflow running in
   the Synter-Media-AI org; no stored token).
6. `mcp-publisher publish`, which uploads `server.json` to `registry.modelcontextprotocol.io`.
7. Prints what the registry serves for `search=synter-ads`.

It does not publish to npm. A registry version cannot be un-published.

Verify:

```sh
curl -s "https://registry.modelcontextprotocol.io/v0/servers?search=io.github.Synter-Media-AI/synter-ads"
```

The response should list `io.github.Synter-Media-AI/synter-ads` at version `1.3.0`, with the npm package at
`1.3.0` and the remote `https://mcp.synterai.com`. (The registry did not respond from the machine that prepared
this PR, so this URL is the one the workflow itself uses rather than one checked today.)
