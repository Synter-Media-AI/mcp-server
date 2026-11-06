# Publishing @synterai/mcp-server

Operator notes for a release. Following this file does not publish npm, register the MCP server, or submit a Claude directory listing. Do those only when a release is explicitly intended.

Current package version: **1.5.0**.

## Identity

| | |
|---|---|
| npm package | `@synterai/mcp-server` on the `@synterai` scope |
| Repository | https://github.com/Synter-Media-AI/mcp-server (this repo root, not `packages/mcp-server`) |
| `mcpName` / registry name | `io.github.Synter-Media-AI/synter-ads` (case-sensitive; a lowercased namespace is rejected) |
| Canonical description | Open-source MCP server for ad performance reports and approved changes across 30+ ad platforms. $0.25 per verified write, 0% of ad spend. |
| Homepage | https://synterai.com/mcp |
| Docs | https://docs.synterai.com |
| API keys | https://synterai.com/developer |
| Pricing | https://synterai.com/pricing |
| Privacy policy | https://synterai.com/privacy |
| Hosted MCP | `https://mcp.synterai.com` (Streamable HTTP, OAuth 2.1; optional `X-Synter-Key` for headless clients) |
| Support contact on the package | hello@synterai.com |

`scripts/validate-discovery.mjs` checks that `package.json`, `server.json`, `manifest.json`, `plugin.json`, `.claude-plugin/plugin.json`, `gemini-extension.json`, and the lockfile version agree, and that public metadata uses the canonical description, `synterai.com`, and `https://mcp.synterai.com`.

## SDK dependency

`package.json` and the lockfile root must both declare `@modelcontextprotocol/sdk` as `^1.32.1`. The lockfile resolves `1.32.1`. The pre-1.3.0 range `^0.6.0` does not match that install; `npm install` would then select a different major than `npm ci`. `validate-discovery` fails if the ranges diverge or the resolved tarball is not 1.x.

## Before a release

From the repository root, with a committed `package-lock.json`:

```bash
npm ci
npm test
npm run validate:discovery
```

`npm test` builds with `tsc` and runs `test/*.test.mjs`, including the stdio `tools/list` check. `npm run validate:discovery` is the same script the registry workflow runs before it uploads `server.json`.

## 1. npm

Publish from an account that can publish `@synterai/*`. The scope is `@synterai`, not `@syntermedia`.

```bash
npm whoami
npm publish --access public
```

`prepublishOnly` runs `npm run build`. Skip `--provenance` on a laptop publish; npm provenance needs a GitHub Actions run with `id-token: write`. This repo has no npm publish workflow.

Check the result:

```bash
npm view @synterai/mcp-server version
npm view @synterai/mcp-server dependencies   # @modelcontextprotocol/sdk: ^1.32.1
npm view @synterai/mcp-server mcpName        # io.github.Synter-Media-AI/synter-ads
```

A tool call with no `SYNTER_API_KEY` returns an error containing `SYNTER_API_KEY not set`. `npx -y @synterai/mcp-server --demo` starts the zero-credential sandbox.

## 2. MCP Registry

Publish to npm first. `server.json` points clients at an npm version; the registry workflow refuses a version npm does not already have. A registry version cannot be unpublished.

Pushing a `v*` tag runs [`.github/workflows/publish-mcp-registry.yml`](.github/workflows/publish-mcp-registry.yml). The job:

1. Runs `node scripts/validate-discovery.mjs`.
2. Requires the tag (`v1.5.0` → `1.5.0`) to equal `server.json` `version`.
3. Requires `npm view @synterai/mcp-server@<version>` to succeed.
4. Logs in with `mcp-publisher login github-oidc` (namespace permission comes from the Synter-Media-AI org; there is no stored registry token).
5. Runs `mcp-publisher publish`, which uploads `server.json` to `registry.modelcontextprotocol.io`.

`npm version` creates a git tag. Pushing that tag starts this workflow. Tag only after that exact version is already on npm.

`server.json` limits that have already rejected a publish: `description` max 100 was an older registry schema error (the in-repo check now enforces `name` ≤ 200, `title` ≤ 100, `version` ≤ 255, icon `src` ≤ 255 against the 2025-12-11 server schema). The namespace check compares `server.json` `name` to the GitHub owner in `repository.url`, including case.

## 3. Claude Connectors Directory

The Google Form this file used to link is retired. Submission is manual, in the developer portal, and is separate from npm and the MCP Registry.

- Guide: https://claude.com/docs/connectors/building/submission
- Directory: https://claude.com/docs/connectors/directory
- Review criteria: https://claude.com/docs/connectors/building/review-criteria
- Portal: https://claude.ai/directory/manage → Submit new → **MCP connector**

Submit the remote server `https://mcp.synterai.com`. The directory asks for an `https://` URL. It no longer accepts a local server packaged as an MCP Bundle on its own; the stdio package stays on npm.

Have these ready. The portal syncs tools from the connected server, so do not paste a hand-written tool list.

| Field | Value |
|---|---|
| Server URL | `https://mcp.synterai.com` |
| Name | Synter |
| Description | The canonical description above. Portal limits: name ≤ 100 characters, one-liner ≤ 200, description ≤ 2,000. The canonical description is within the one-liner limit. |
| Documentation | https://docs.synterai.com |
| Privacy policy | https://synterai.com/privacy |
| Homepage | https://synterai.com/mcp |
| Source | https://github.com/Synter-Media-AI/mcp-server |
| npm | `@synterai/mcp-server` |
| Support | hello@synterai.com |
| Auth | OAuth 2.1 for browser clients. Headless clients can send `X-Synter-Key`. Do not document `Authorization: Bearer syn_...` for the hosted MCP; REST and the SDKs use Bearer. |

The stdio package advertises **56 tools**, in the order asserted by `EXPECTED_TOOLS` in `test/stdio-tools-list.test.mjs`. Every tool has a `title` and either `readOnlyHint: true` or `destructiveHint: true`. The hosted server is what the portal will list; a few hosted names differ from stdio (`get_performance` vs `pull_<platform>_ads_performance`, `list_ad_accounts` vs `list_connected_accounts`). See the README section “Tool names: stdio package vs hosted server”.

`manifest.json` is a shorter catalog for the legacy manifest format. It is not the directory submission source. Its `run_tool` entry matches the stdio description: run a named backend tool. It is not a count of MCP tools.

Stdio tool names, grouped:

- Campaigns: `list_campaigns`, `create_search_campaign`, `create_display_campaign`, `create_pmax_campaign`, `create_meta_campaign`, `create_linkedin_campaign`, `create_reddit_campaign`, `pause_campaign`, `update_campaign_budget`, `optimize_budget`
- Performance: `get_performance`, `get_daily_spend`, `pacing_report`, `user_budget_pacing_report`
- Keywords and conversions: `add_keywords`, `add_negative_keywords`, `create_conversion`, `list_conversions`, `diagnose_tracking`
- Creative: `generate_image`, `generate_video`, `upload_image`
- Audiences: `stage_audience_artifact`, `sync_audience`, `manage_audience`
- Accounts and pages: `list_ad_accounts`, `list_landing_pages`
- Diagnostics: `inspect_agent_shield`, `verify_angstrom_claim`, `get_skill`, `get_llm_visibility`
- Organic posts: `get_organic_publishing_readiness`, `draft_organic_post`, `validate_organic_post`, `approve_organic_post`, `schedule_organic_post`, `publish_organic_post`, `cancel_scheduled_post`, `list_scheduled_posts`
- Prospecting: `prospector_get_pipeline_summary`, `prospector_get_campaigns`, `prospector_get_campaign`, `prospector_get_campaign_performance`, `prospector_get_leads`, `prospector_get_inbox_health`, `prospector_get_pending_replies`, `prospector_get_intro_paths`, `prospector_get_warm_intros`, `prospector_create_campaign`, `prospector_update_campaign_sequence`, `prospector_add_leads`, `prospector_create_reply`, `prospector_send_outreach_email`, `prospector_post_linkedin_document`, `prospector_post_linkedin_comment`
- Backend escape hatch: `run_tool`

Public coverage copy is **30+ ad platforms** (the canonical description). The local `platform` enum in `src/platform-routing.ts` is the named set `google`, `meta`, `linkedin`, `microsoft`, `reddit`, `tiktok`, `x`, `pinterest`, `snapchat`, `spotify`, `amazon_ads`, `amazon_dsp`, `the_trade_desk`, `openai`, `dv360`, `stackadapt`. Write and create depth varies by platform; the README table is the reference. Do not substitute an older count (7, 9, 27, 43) in a listing.

Pricing to state as published: MCP reads are free. Verified writes are $0.25 each, 0% of ad spend. Ad platforms bill media spend directly. Plans are Free, Solo, Scale, and Custom (https://synterai.com/pricing). `dry_run: true` previews a write without applying it.

Reviewer access (test account, populated ad accounts) is entered in the portal and is not stored in this repo.

## Versioning

Bump every version the validator compares, in one commit, before tagging:

- `package.json` `version`
- `server.json` `version` and `packages[].version`
- `manifest.json` `version`
- `plugin.json` and `.claude-plugin/plugin.json` `version`
- `gemini-extension.json` `version`
- `src/index.ts` `VERSION`

Patch for fixes, minor for new tools, major for breaking tool or config changes. Then `npm test`, `npm run validate:discovery`, npm publish, and only then `git tag vX.Y.Z && git push origin vX.Y.Z`.

## Troubleshooting

- **npm 403.** The account cannot publish `@synterai`. Ask an owner of that scope. Creating a `@syntermedia` org does not publish this package.
- **npm 404 just after publish.** Wait a few minutes, then retry `npm view`.
- **Registry 403 on namespace.** `server.json` `name` must be `io.github.Synter-Media-AI/...`, matching the GitHub owner’s case.
- **Registry workflow fails on npm view.** That version is not on npm yet. Publish npm before pushing the tag.
- **SDK resolves to 0.6.x.** `package.json` and the lockfile root have drifted. Set both to `^1.32.1` (or a newer 1.x range and a regenerated lockfile that still resolves 1.x) and re-run `npm ci`.
