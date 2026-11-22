> **1-Click Setup**: [Connect Meta Ads & Get Your Synter MCP](https://synterai.com/mcp/meta/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_meta) · [Download Meta Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/meta) · [Live Platform Guide](https://synterai.com/mcp/meta)
# Meta Ads MCP Server (Facebook & Instagram)

> Connect Claude, Cursor, and Codex to Meta Ads for $0.00 read-only reporting, Reels and Feed audits, Conversions API checks, and two-phase ABO/CBO execution.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/meta
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/meta/connect
- **Download & Install Page**: https://synterai.com/mcp/meta/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/meta
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Meta Graph API v21.0+
- **Capability Scope**: Reporting + full campaign creation
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_meta_ads_performance`

## 1-Command Client Setup

### Claude Code
```bash
claude mcp add --transport http --scope user synter-ads https://mcp.synterai.com
```

### OpenAI Codex
```bash
codex mcp add synter-ads --url https://mcp.synterai.com
codex mcp login synter-ads
```

### Cursor / Claude Desktop (`mcp.json`)
```json
{
  "mcpServers": {
    "synter-ads": {
      "url": "https://mcp.synterai.com"
    }
  }
}
```

- **Cursor 1-Click Install**: cursor://anysphere.cursor-deeplink/mcp/install?name=synter-ads&config=eyJ1cmwiOiJodHRwczovL21jcC5zeW50ZXJhaS5jb20ifQ==
- **VS Code 1-Click Install**: vscode:mcp/install?%7B%22name%22%3A%22synter-ads%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.synterai.com%22%7D
- **Local npm package (optional stdio fallback)**: `npx -y @synterai/mcp-server@1.4.6`

## Meta Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_meta_ads_performance` | Read | $0.00 (Free) | Pull spend, impressions, clicks, CPC, CPM, ROAS, and conversion events across Facebook and Instagram. |
| `get_campaign_observation` | Read | $0.00 (Free) | Inspect pacing shifts, placement CPM spikes, and creative fatigue across active Meta ad sets. |
| `get_pixel_health` | Read | $0.00 (Free) | Audit Conversions API datasets, browser pixel delivery, and event deduplication. |
| `list_campaigns` | Read | $0.00 (Free) | List active and paused Meta campaigns, daily budgets, and delivery status. |
| `meta_ads_create_ad` | Write (approval-gated) | SOLO / SCALE | Create a PAUSED Meta ad binding uploaded creative assets and destination UTMs to an ad set. |
| `create_campaign_plan` | Write (approval-gated) | SOLO / SCALE | Stage complete ABO/CBO campaign hierarchies as PAUSED reviewable drafts. |
| `execute_campaign_plan` | Write (approval-gated) | SOLO / SCALE | Launch an approved campaign plan using a single-use execute_token. |
| `update_campaign_budget` | Write (approval-gated) | SOLO / SCALE | Adjust daily budgets with automated spend-velocity guardrails. |
| `pause_campaign` | Write (approval-gated) | SOLO / SCALE | Immediately stop spending on an underperforming Meta campaign. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Meta Ads Prompts

1. `Pull our Meta Ads performance for the last 14 days and flag ad sets spending above target CPA with zero purchases.`
2. `Inspect our Meta pixel and Conversions API health and verify event_id deduplication.`
3. `Stage a PAUSED Meta ABO concept-testing campaign with three ad creative variants and a $50/day cap.`

## Frequently Asked Questions

### Is Meta Ads MCP really free to read?

Yes. All own-account reporting, metrics, ad set inspections, and tracking audits across Meta Ads cost $0.00. Synter charges 0% of ad spend.

### How does Synter prevent accidental ad spend in Meta?

All campaign creation tools default to PAUSED status. Live deployment requires explicit operator confirmation with an execute_token, followed by get_ad_readback verification.

### Does Synter require running a local Python server?

No. Synter provides one hosted endpoint (https://mcp.synterai.com) connecting Meta Ads alongside 43+ ad platforms with browser OAuth.
