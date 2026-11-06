# Product Hunt listing draft — Synter MCP

Draft listing copy for a future launch. It replaces the March 2026 kit. Use the README if a fact here and the README ever disagree.

## Listing

### Name

```text
Synter MCP
```

### Taglines (under 60 characters)

- `Ad reports and approved changes across 30+ platforms` (52)
- `Open-source MCP server for cross-platform ad reports` (52)
- `Reports and campaign changes for 30+ ad platforms` (49)

### Short description

```text
Synter is an open-source MCP server for ad performance reports and approved campaign changes across 30+ ad platforms. Connect Claude, Cursor, ChatGPT, or any MCP client to https://mcp.synterai.com (OAuth), or run npx -y @synterai/mcp-server locally.

MCP reads are free. A verified write is $0.25, and Synter takes 0% of ad spend. Ad platforms bill media spend directly. Pass dry_run to preview a change before it is applied.
```

### Categories

Developer Tools, Artificial Intelligence, Marketing.

### Links

- Website: https://synterai.com/mcp
- Docs: https://docs.synterai.com
- GitHub: https://github.com/Synter-Media-AI/mcp-server
- Hosted MCP: `https://mcp.synterai.com`
- npm: `@synterai/mcp-server`
- Pricing: https://synterai.com/pricing
- Privacy: https://synterai.com/privacy

## What to show

1. **Reports.** `list_campaigns`, `get_performance`, `get_daily_spend`, and `pacing_report` for one platform per call. `platform` is required.
2. **Previews.** `dry_run: true` on campaign create, pause, budget update, and negative keywords. A preview does not change the ad account.
3. **Writes when asked.** Search, Display, Performance Max, Meta, LinkedIn, and Reddit create tools, plus `pause_campaign`, `update_campaign_budget`, keywords, and audience sync.
4. **Local safety switches.** `--read-only` / `SYNTER_READ_ONLY=true` removes mutating tools. `--demo` / `SYNTER_DEMO=true` returns sandbox data with no API key.

## Platforms

Public coverage copy is **30+ ad platforms** (hosted MCP).

The local npm `platform` enum, from `src/platform-routing.ts`:

| Platform | |
|---|---|
| Search and social | Google Ads, Microsoft Ads, Meta (Facebook and Instagram), LinkedIn Ads, X Ads, Reddit Ads, TikTok Ads, Snapchat Ads, Pinterest Ads |
| Other | Spotify Ads, Amazon Ads, Amazon DSP, The Trade Desk, OpenAI Ads, Display & Video 360, StackAdapt |

Write and create depth varies by platform API. The README table is the reference. Do not add networks that are not in that table.

## First comment draft

```markdown
Synter MCP is the open-source server we use for cross-platform ad reports and campaign changes.

Hosted, with browser sign-in:

https://mcp.synterai.com

Claude Code:

claude mcp add --transport http synter-ads https://mcp.synterai.com

Local stdio:

npx -y @synterai/mcp-server

Reads (performance, daily spend, pacing, tracking checks) are free. A verified write is $0.25, and we take 0% of ad spend. Use dry_run before a live change. Pass --read-only to expose only read tools, or --demo to try the sandbox with no API key.

Source: https://github.com/Synter-Media-AI/mcp-server
Docs: https://docs.synterai.com
```

## Gallery

The March 2026 gallery images were removed. They showed a retired domain, a 7+ / 9+ platform count, and a credit-card headline. New images need to use synterai.com, the 30+ coverage line, and the published price. The remaining file in `product-hunt/` is the Synter logo, `thumbnail-240x240.png`.
