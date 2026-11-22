> **1-Click Setup**: [Connect Amazon Ads & Get Your Synter MCP](https://synterai.com/mcp/amazon/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_amazon) · [Download Amazon Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/amazon) · [Live Platform Guide](https://synterai.com/mcp/amazon)
# Amazon Ads MCP Server

> Audit ACoS, TACoS, and Sponsored Products, Brands, and Display campaigns directly from Claude, Cursor, and Codex.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/amazon
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/amazon/connect
- **Download & Install Page**: https://synterai.com/mcp/amazon/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/amazon
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Amazon Advertising API v3
- **Capability Scope**: Reporting + full campaign creation
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_amazon_ads_performance`

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

## Amazon Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_amazon_ads_performance` | Read | $0.00 (Free) | Pull spend, impressions, clicks, attributed sales, units sold, and ACoS. |
| `pull_amazon_dsp_performance` | Read | $0.00 (Free) | Query Amazon DSP programmatic order and line-item delivery metrics. |
| `audit_campaign_waste` | Read | $0.00 (Free) | Surface search queries and targets driving spend with zero attributed orders. |
| `add_negative_keywords` | Write (approval-gated) | SOLO / SCALE | Add NEGATIVE_EXACT or NEGATIVE_PHRASE terms to seal spend leaks. |
| `update_campaign_budget` | Write (approval-gated) | SOLO / SCALE | Adjust daily campaign budgets safely against ACoS goals. |
| `create_campaign_plan` | Write (approval-gated) | SOLO / SCALE | Stage Sponsored Products or Brands campaign hierarchy as PAUSED. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Amazon Ads Prompts

1. `Pull our Amazon Ads performance for the past 14 days and highlight campaigns with ACoS above 30%.`
2. `Compare Sponsored Products ROAS against Amazon DSP programmatic orders over the past 30 days.`

## Frequently Asked Questions

### Are Amazon negative keywords supported with match types?

Yes. Synter supports NEGATIVE_EXACT and NEGATIVE_PHRASE match types per Amazon Ads SDK standards.

### Can I query Amazon DSP programmatic line items with the same connection?

Yes. Both pull_amazon_ads_performance and pull_amazon_dsp_performance are available through https://mcp.synterai.com.
