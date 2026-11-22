> **1-Click Setup**: [Connect Amazon DSP & Get Your Synter MCP](https://synterai.com/mcp/amazon-dsp/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_amazon-dsp) · [Download Amazon DSP MCP Kit (.zip)](https://synterai.com/api/mcp/kit/amazon-dsp) · [Live Platform Guide](https://synterai.com/mcp/amazon-dsp)
# Amazon DSP MCP Server

> Connect Claude, Cursor, and Codex to Amazon DSP for $0.00 programmatic order reporting, retail audience insights, and governed media execution.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/amazon-dsp
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/amazon-dsp/connect
- **Download & Install Page**: https://synterai.com/mcp/amazon-dsp/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/amazon-dsp
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Amazon Advertising DSP API
- **Capability Scope**: Reporting + governed order workflows
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_amazon_dsp_performance`

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

## Amazon DSP MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_amazon_dsp_performance` | Read | $0.00 (Free) | Pull Amazon DSP programmatic impressions, spend, eCPM, detail page views, and attributed sales. |
| `pull_amazon_ads_performance` | Read | $0.00 (Free) | Pull Sponsored Products, Brands, and Display performance alongside DSP orders. |
| `list_campaigns` | Read | $0.00 (Free) | List Amazon DSP orders and Sponsored campaigns. |
| `create_campaign_plan` | Write (approval-gated) | SOLO / SCALE | Stage PAUSED Amazon campaign plans for operator review. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Amazon DSP Prompts

1. `Pull Amazon DSP performance for the last 14 days and compare ROAS against Amazon Sponsored Products.`

## Frequently Asked Questions

### Can I query both Amazon DSP and Amazon Sponsored Ads in one session?

Yes. Both pull_amazon_dsp_performance and pull_amazon_ads_performance are exposed on https://mcp.synterai.com at $0.00 per read.
