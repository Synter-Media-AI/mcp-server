# Changelog

## 1.3.0 (unreleased)

### Security

- Upgraded `@modelcontextprotocol/sdk` from `^0.6.0` to `^1.32.1`. This clears the high-severity advisory
  [GHSA-w48q-cv73-mx4w](https://github.com/advisories/GHSA-w48q-cv73-mx4w) (SDK `<1.24.0` does not enable DNS
  rebinding protection by default) that `npm audit` reported against 1.2.4. `npm audit --omit=dev` now reports
  0 vulnerabilities.
- The server still uses the SDK's low-level `Server` with stdio transport. Tool names, input schemas, output
  format and environment variables are unchanged; a new test boots the built server with the 1.x client and
  asserts the same 25 tool names.
- Node.js `>=18` is unchanged (the SDK requires `>=18`); the suite passes on Node 18 and current Node.

### Changed

- Default API host is now `https://synterai.com` and the default artifact host is `https://api.synterai.com`
  (both previously pointed at the legacy domain). The new and legacy hosts serve the same API. `SYNTER_API_URL`
  and `SYNTER_ARTIFACT_API_URL` still override them.
- Error messages and the `run_tool` description point to synterai.com.
- Hosted MCP endpoint is `https://mcp.synterai.com` (root, matching the OAuth protected-resource identifier).

### Added

- **Free Diagnostic Read Tier ($0.00 / 0 credits)**: Connecting ad accounts and inspecting campaigns, pulling performance metrics, and checking conversion tracking across all platforms is 100% free with zero credits deducted and no credit card required.
- **Client-Side Read-Only Mode (`SYNTER_READ_ONLY=true` / `--read-only`)**: When active, all mutating tools (`create_`, `update_`, `pause_`, `enable_`, `sync_audience`) are completely unregistered from the tool manifest, and any mutation attempts are rejected locally with actionable error messages.
- **Architecture, Security & Privacy Documentation**: Added comprehensive architecture diagrams, token encryption statements (AES-256 via KMS), immutable audit logging standards, and a zero model-training guarantee.
- **Synter Ångström Grounded Output Verification**: Real-time readback probes against live provider APIs (Google Ads, Meta, LinkedIn, etc.) to verify delivery state, servability (`RUNNABLE`), and budget constraints, preventing AI agents from hallucinating campaign status.
- Competitive comparison in README evaluating Synter against Google's read-only MCP, AdCP (Ad Context Protocol schema spec), and Pipeboard (single-channel proxy).
- Transparent subscription tier documentation for write execution (SOLO $20/mo with $20.00 claimable credits, SCALE $500/mo with $500.00 claimable credits, CUSTOM enterprise).

### Metadata

- `package.json`: description leads with "Official Synter MCP server" and "16 ad platforms";
  homepage `https://synterai.com/mcp`; author `Synter <hello@synterai.com>`.
- `manifest.json` and `.claude-plugin/plugin.json`: synterai.com author/homepage; versions aligned to 1.3.0
  across `package.json`, `server.json` (top level and `packages[]`), `manifest.json`, `gemini-extension.json` and
  the server's reported version.
- README: documents the stdio vs hosted tool names and `SYNTER_ARTIFACT_API_URL`; `list_campaigns` described
  as per-platform, matching its required `platform` argument.
