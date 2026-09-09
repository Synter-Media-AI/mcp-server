# Synter MCP Server

[![npm version](https://img.shields.io/npm/v/@synterai/mcp-server.svg)](https://www.npmjs.com/package/@synterai/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Synter](https://syntermedia.ai/brand/android-chrome-192x192.png)

Synter is an agentic advertising platform. This package exposes Synter's complete hosted MCP tool catalog over stdio, including each tool's current schema, title, annotations, and native result envelope. The catalog is discovered at runtime rather than copied into this repository.

Synter's broader ecosystem covers 27 advertising platforms. Actual typed capabilities are the tools returned by `tools/list`; support differs by platform and operation, so the 27-platform ecosystem should not be read as a promise that every tool works on every platform.

## Choose an installation

### Hosted MCP: browser OAuth

Use the hosted endpoint when your MCP client supports Streamable HTTP and OAuth:

```text
https://mcp.syntermedia.ai/mcp/
```

The client should open Synter's browser OAuth flow. Do not paste an API key or OAuth token into chat. No local package is needed.

### npm stdio bridge: API key

Use this package when your client needs stdio. Set `SYNTER_API_KEY`; the bridge authenticates to the hosted MCP and forwards tool calls without translating canonical tool names or result envelopes.

```json
{
  "mcpServers": {
    "synter": {
      "command": "npx",
      "args": ["-y", "@synterai/mcp-server"],
      "env": {
        "SYNTER_API_KEY": "syn_your_api_key_here"
      }
    }
  }
}
```

Get an API key from [Synter Developer Settings](https://syntermedia.ai/developer). `SYNTER_MCP_URL` may override the hosted endpoint for testing or private deployments.

## Tool behavior

- The stdio bridge discovers every hosted tool and follows bounded `tools/list` cursors.
- Canonical tool calls are forwarded to the identically named hosted handler.
- JSON Schema validation runs locally before any network call.
- Hosted `content`, `structuredContent`, `isError`, truncation flags, warnings, and account identifiers are returned unchanged.
- `list_campaigns` and hosted performance tools accept explicit account selectors where their discovered schemas advertise them.
- Read results can be bounded by provider or output limits. Treat `truncated`, warnings, cursors, and pagination fields as authoritative; absence of a cursor is not a promise of exhaustive data.

Four collision-free wrappers preserve common names from older stdio releases:

| Wrapper | Hosted route |
|---|---|
| `get_performance` | `pull_<platform>_ads_performance` |
| `get_daily_spend` | `execute(get_account_daily_spend)` with required platform, account, and date |
| `list_ad_accounts` | `list_connected_accounts` across platforms, with pagination |
| `run_tool` | `execute` |

If a future hosted catalog defines one of those names, the hosted definition wins and the wrapper is not added.

## Claude plugin

The separate [Synter plugin](https://github.com/Synter-Media-AI/plugin) adds skills, agents, and approval guidance:

```text
/plugin marketplace add Synter-Media-AI/plugin
/plugin install synter@synter
```

See the [Synter manual](https://syntermedia.ai/manual) and [Claude plugin guide](https://docs.syntermedia.ai/guides/claude-plugin).

## Development

```bash
npm install
npm run build
npm test
npm run validate:discovery
npm pack
```

Tests use a captured 196-tool hosted catalog and mocked HTTP. They exercise every catalog entry, including write tools, without issuing real writes or spend.

## Safety

Some hosted tools create campaigns, change budgets, publish assets, or perform other external mutations. Follow each tool's discovered annotations and your client's approval controls. This bridge does not disable or bypass hosted authorization or approval protections.

MIT licensed. See [LICENSE](./LICENSE).
