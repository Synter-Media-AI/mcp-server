# Synter MCP Server

[![npm version](https://img.shields.io/npm/v/@synterai/mcp-server.svg)](https://www.npmjs.com/package/@synterai/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### The most complete MCP server for advertising.

Reporting across 19 ad platforms and full campaign creation on 14 of them (write actions on 16), spanning every major buying channel, with built-in confirmations for destructive actions.

Create campaigns. Adjust budgets. Pause underperformers. Generate creatives. Pull performance data. All through natural conversation, across Google, Meta, LinkedIn, Microsoft, Reddit, TikTok, X, and more.

**This is the first [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that gives AI agents a credit card.**

> **Note:** [`Synter-Media-AI/plugin`](https://github.com/Synter-Media-AI/plugin) is the canonical installable Claude plugin repo. The `.claude-plugin/` copy in this repo is not the install source.

---

## How Synter Compares

The official Google Ads MCP server is read-only by design: per Google's documentation, it is "strictly read-only" and "cannot modify bids, pause campaigns, or create new assets." Most third-party ad MCP servers cover a single platform. We built Synter to do both halves of the job, across every major buying channel, from one server.

| | Synter MCP | Official Google Ads MCP | Typical third-party ad MCPs |
|---|---|---|---|
| **Access** | Read on all 19 platforms, campaign creation on 14, write actions on 16 | Read-only (current release) | Often read-only or partial write |
| **Platforms** | 19 reporting, 14 with full campaign creation (lists below) | Google Ads only | Usually a single platform |
| **Create campaigns** | ✅ Google Search, Display, PMax, Meta, LinkedIn, Reddit, more via `run_tool` | ❌ | Rarely |
| **Budgets and pause** | ✅ | ❌ | Varies |
| **AI creative generation** | ✅ Images, video, copy | ❌ | ❌ |
| **Audience sync** | ✅ Google, Meta, LinkedIn, Microsoft, Reddit, TikTok, X | ❌ | ❌ |
| **Safety** | Confirmations for destructive actions | n/a (read-only) | Varies |
| **Open source** | ✅ MIT | ✅ | Varies |

**Reporting coverage (19 platforms):** Google Ads, Microsoft Ads (Bing), Meta (Facebook and Instagram), LinkedIn Ads, X (Twitter) Ads, Reddit Ads, TikTok Ads, Snapchat Ads, Pinterest Ads, Spotify Ads, Amazon Ads, Amazon DSP, Walmart Connect, Instacart Ads, Target Roundel, Criteo, The Trade Desk, Display & Video 360, and OpenAI Ads (ChatGPT).

**Full campaign creation (14 platforms):** Google Ads, Microsoft Ads, Meta, LinkedIn, X, Reddit, TikTok, Snapchat, Pinterest, Spotify, Amazon Ads (Sponsored Products, Brands, and Display), Amazon DSP, The Trade Desk, and OpenAI Ads. Display & Video 360 and StackAdapt additionally support write actions (pause, budget and line-item updates, audience upload) without campaign creation. The remaining 4 (Walmart Connect, Instacart, Target Roundel, and Criteo) are reporting-only today.

The `npx` package ships typed tools for the most common operations plus `run_tool` access to the full catalog of 140+ Synter tools. The remote server at `https://mcp.syntermedia.ai/mcp/` exposes the full hosted tool set, including performance pulls for every platform above.

For registry-style MCP discovery, [`server.json`](./server.json) is the machine-readable source of truth. Keep it aligned with [`package.json`](./package.json), [`manifest.json`](./manifest.json), and the setup examples in this README.

---

## ⚠️ Fair Warning

Your AI agent will be able to:
- **Create campaigns** that immediately start spending your budget
- **Adjust bids** that affect how much you pay per click
- **Pause campaigns** (sometimes that's a good thing)
- **Add keywords** that change who sees your ads
- **Generate creatives** and upload them to your accounts

We built in confirmations for destructive actions. But still, maybe don't give this to an agent you just met.

---

## Quick Start

### 1. Get Your API Key

Sign up at [syntermedia.ai](https://syntermedia.ai) and create an API key in the [Developer Settings](https://syntermedia.ai/developer).

### 2. Configure Your AI Client

**For Claude Desktop:** Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "synter": {
      "command": "npx",
      "args": ["@synterai/mcp-server"],
      "env": {
        "SYNTER_API_KEY": "syn_your_api_key_here"
      }
    }
  }
}
```

**For Cursor:** Add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "synter": {
      "command": "npx",
      "args": ["@synterai/mcp-server"],
      "env": {
        "SYNTER_API_KEY": "syn_your_api_key_here"
      }
    }
  }
}
```

**For Amp:** Add to `.amp/settings.json`:

```json
{
  "mcpServers": {
    "synter": {
      "command": "npx",
      "args": ["@synterai/mcp-server"],
      "env": {
        "SYNTER_API_KEY": "syn_your_api_key_here"
      }
    }
  }
}
```

**Remote (Streamable HTTP):** For ChatGPT, n8n, Zapier, or any MCP client that supports HTTP transport:

```
URL: https://mcp.syntermedia.ai/mcp/
Header: X-Synter-Key: syn_your_api_key_here
```

No local install needed. Works with any MCP client that supports [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) transport.

### 3. Start Using It

Restart your AI client and start chatting:

> "Show me all my Google Ads campaigns"

> "Create a search campaign for 'project management software' with a $50/day budget"

> "Pause the campaign that's overspending"

---

## Prefer a full plugin? (Claude Code / Claude Desktop)

This package is the raw MCP server. If you use **Claude Code** or **Claude Desktop**, the [**Synter plugin**](https://github.com/Synter-Media-AI/plugin) wraps this same server with ready-made skills (`/synter:launch`, `/synter:audience`, `/synter:optimize`, …), specialized agents, and an approval-before-spend safety hook:

```text
/plugin marketplace add Synter-Media-AI/plugin
/plugin install synter@synter
```

It also ships a headless [Claude Agent SDK](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk) runner for automation. See the [plugin repo](https://github.com/Synter-Media-AI/plugin) or the [Claude Plugin guide](https://docs.syntermedia.ai/guides/claude-plugin). Use this MCP package directly when you want just the tools, or are wiring another client.

---

## What Can Your Agent Do?

### 📊 Campaign Management

| Tool | Description |
|------|-------------|
| `list_campaigns` | List campaigns across all connected platforms |
| `create_search_campaign` | Create a Google Search campaign with keywords and ads |
| `create_display_campaign` | Create a Google Display campaign with images |
| `create_pmax_campaign` | Create a Performance Max campaign |
| `create_meta_campaign` | Create a Facebook/Instagram campaign |
| `create_linkedin_campaign` | Create a LinkedIn campaign for B2B |
| `create_reddit_campaign` | Create a Reddit campaign |
| `pause_campaign` | Pause any campaign |
| `update_campaign_budget` | Change daily budget |

### 📈 Performance & Analytics

| Tool | Description |
|------|-------------|
| `get_performance` | Get impressions, clicks, spend, conversions, ROAS |
| `get_daily_spend` | Daily spend breakdown by platform |

### 🎯 Keywords & Targeting

| Tool | Description |
|------|-------------|
| `add_keywords` | Add keywords to a campaign or ad group |
| `add_negative_keywords` | Block unwanted search terms |

### 🔄 Conversion Tracking

| Tool | Description |
|------|-------------|
| `create_conversion` | Set up a conversion action |
| `list_conversions` | List existing conversion actions |
| `diagnose_tracking` | Check if tracking is installed correctly |

### 🎨 Creative Generation

| Tool | Description |
|------|-------------|
| `generate_image` | AI-generate ad images |
| `generate_video` | AI-generate video ads |
| `upload_image` | Upload images as ad assets |

### 🔧 Utility

| Tool | Description |
|------|-------------|
| `list_ad_accounts` | List all connected ad accounts |
| `run_tool` | Run any of 140+ Synter tools directly |

---

## No Ads Experience? No Problem.

If you've never run ads before, here's what you need to know:

### What is a Campaign?

A **campaign** is like a project folder. It contains your ads, who sees them, and how much you spend.

```
Campaign: "Q1 Lead Generation"
├── Budget: $50/day
├── Targeting: USA, people searching "project management"
└── Ads: Headlines, descriptions, images
```

### What Platforms Can I Use?

| Platform | Best For | Min Budget |
|----------|----------|------------|
| **Google Ads** | People actively searching for your product | $10/day |
| **Meta (Facebook/Instagram)** | Visual products, broad audiences | $5/day |
| **LinkedIn** | B2B, enterprise, job seekers | $25/day |
| **Reddit** | Niche communities, tech-savvy users | $5/day |
| **Microsoft (Bing)** | Older demographics, B2B | $10/day |
| **TikTok** | Gen Z, entertainment, e-commerce | $20/day |

### Campaign Types Explained

**Search Campaigns:** Your ad shows when someone Googles specific keywords.
- *Example:* Someone searches "best CRM software" → Your ad appears

**Display Campaigns:** Image ads shown across websites and apps.
- *Example:* Banner ad on a news site

**Performance Max (PMax):** Google's AI shows your ads everywhere (Search, YouTube, Display, Gmail, Maps).
- *Example:* Google figures out the best placements for you

**Video Campaigns:** Video ads on YouTube and partner sites.
- *Example:* 15-second ad before a YouTube video

### Common Terms

| Term | What It Means |
|------|---------------|
| **Impressions** | How many times your ad was shown |
| **Clicks** | How many people clicked your ad |
| **CTR** | Click-through rate (clicks ÷ impressions × 100) |
| **CPC** | Cost per click |
| **Conversions** | Desired actions (signups, purchases, etc.) |
| **ROAS** | Return on ad spend (revenue ÷ spend) |

### First Campaign Checklist

Before creating your first campaign, you'll need:

1. ✅ A landing page URL where people will go when they click
2. ✅ An idea of who you want to reach (location, interests)
3. ✅ A daily budget you're comfortable with ($10-50 to start)
4. ✅ Some headlines and descriptions for your ad

**Pro tip:** Start with a Search campaign on Google. It's the easiest to understand and shows ads to people already looking for what you offer.

---

## Example Conversations

### Create Your First Campaign

> **You:** Create a Google Search campaign for my SaaS product. Target people searching for "team collaboration software" and "project management tools". Budget is $25/day. Landing page is https://myapp.com/signup

> **Agent:** I'll create a Search campaign with those keywords. What headlines should I use? Here are some suggestions:
> - "Team Collaboration Made Simple"
> - "Project Management for Modern Teams"
> - "Start Free - No Credit Card"

### Check Performance

> **You:** How are my campaigns doing this week?

> **Agent:** Here's your performance for the last 7 days:
>
> | Campaign | Spend | Clicks | Conversions | ROAS |
> |----------|-------|--------|-------------|------|
> | Brand Search | $142 | 89 | 12 | 4.2x |
> | Competitor Keywords | $98 | 45 | 3 | 1.5x |
> | Display Retargeting | $67 | 234 | 8 | 2.8x |
>
> The "Competitor Keywords" campaign is underperforming. Want me to pause it or adjust the targeting?

### Add Negative Keywords

> **You:** I'm getting clicks for "free project management" but we don't have a free tier. Block those.

> **Agent:** Added "free" as a negative keyword to your campaign. This will stop your ads from showing for any search containing "free".

### Generate Ad Creative

> **You:** I need a display ad image for a marketing automation product. Dark theme, professional, 1200x628.

> **Agent:** Generating your image...
>
> Created: "Marketing automation dashboard with data visualization on dark background"
> Asset saved and ready to use in your next Display campaign.

---

## Connect Your Ad Accounts

To manage ads on each platform, you'll need to connect your accounts in Synter:

1. Go to [syntermedia.ai/settings/credentials](https://syntermedia.ai/settings/credentials)
2. Click "Connect" next to each platform
3. Complete the OAuth flow
4. Your agent can now manage that platform

**Supported Platforms (19; ✅ = reporting + full campaign execution, 📊 = reporting):**
- Google Ads ✅
- Meta (Facebook/Instagram) ✅
- LinkedIn Ads ✅
- Microsoft Ads (Bing) ✅
- Reddit Ads ✅
- TikTok Ads ✅
- X (Twitter) Ads ✅
- Snapchat Ads ✅
- Pinterest Ads ✅
- Spotify Ads ✅
- Amazon DSP ✅
- The Trade Desk ✅
- Amazon Ads 📊
- Walmart Connect 📊
- Instacart Ads 📊
- Target Roundel 📊
- Criteo 📊
- Display & Video 360 📊
- OpenAI Ads (ChatGPT) 📊

---

## Advanced: Direct Tool Access

For power users, you can call any of 140+ Synter tools directly:

```
> Use run_tool to call google_ads_list_audiences
```

See the full tool list at [docs.syntermedia.ai/tools](https://docs.syntermedia.ai/tools) or ask your agent:

```
> What tools are available for LinkedIn Ads?
```

### Safe by Default: `execute` Dry-Runs Unless Told Otherwise

The universal `execute` tool never runs an action on the first call unless you opt in. By default (`dry_run: true`) it validates the request and stops there — nothing executes, nothing spends. Pass `dry_run: false` to actually run the action; for anything that spends money, do that only with the account owner's approval.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SYNTER_API_KEY` | Yes | Your Synter API key |
| `SYNTER_API_URL` | No | API URL override (default: https://syntermedia.ai) |

---

## Local Development

```bash
# Clone and install
git clone https://github.com/Synter-Media-AI/mcp-server.git
cd mcp-server
npm install

# Build
npm run build

# Run locally
SYNTER_API_KEY=syn_your_key_here node dist/index.js
```

---

## Troubleshooting

### "SYNTER_API_KEY not set"

Make sure your API key is in the `env` section of your MCP config. The key should start with `syn_`.

### "Invalid or expired API key"

1. Check that you copied the full key (they're long!)
2. Verify the key is active at [syntermedia.ai/developer](https://syntermedia.ai/developer)
3. Make sure the key has `tools:write` scope

### "No ad accounts connected"

You need to connect at least one ad platform:
1. Go to [syntermedia.ai/settings/credentials](https://syntermedia.ai/settings/credentials)
2. Click "Connect" next to Google Ads (or another platform)
3. Complete the OAuth authorization

### Tools aren't showing in Claude/Cursor

1. Restart your AI client completely (not just refresh)
2. Check the MCP server logs for errors
3. Verify the config file path and JSON syntax

---

## FAQ

### Is there an MCP server for Google Ads?

Yes, two kinds. Google ships an official Google Ads MCP server, which is read-only in its current release: it can query reports, metrics, and metadata, but per Google's documentation it "cannot modify bids, pause campaigns, or create new assets." Our MCP server covers Google Ads with both read and write: create Search, Display, and Performance Max campaigns, add keywords and negative keywords, adjust budgets, pause campaigns, manage Customer Match audiences, set up conversion tracking, and pull performance data. The same server reports across 18 other ad platforms and offers full campaign execution on 11 of them.

### Can Claude or ChatGPT manage my ad campaigns?

Yes. With the Synter MCP server connected, Claude (Claude Desktop, Claude Code), ChatGPT, Cursor, and any other MCP-compatible client can create campaigns, adjust budgets, pause underperformers, generate creatives, and sync audiences on 14 ad platforms (write actions on 16), and pull performance data across all 19. Claude and other stdio clients connect via `npx @synterai/mcp-server` with a `SYNTER_API_KEY`; ChatGPT and other HTTP clients connect to the remote server at `https://mcp.syntermedia.ai/mcp/` with an `X-Synter-Key` header. Destructive actions have built-in confirmations.

### What is the difference between the official Google Ads MCP and Synter?

Two things: write access and platform coverage. The official Google Ads MCP is read-only in its current release and covers Google Ads only. Synter reports across 19 platforms and offers full campaign creation on 14 of them, including Google Ads, Meta, LinkedIn, Microsoft, TikTok, Amazon Ads, Amazon DSP, OpenAI Ads, and The Trade Desk. If you only need Google Ads reporting, the official server is a solid choice. If you want an agent that can act on what it finds, on Google and everywhere else you advertise, that is what we built Synter for.

---

## Resources

- **Synter Manual:** [syntermedia.ai/manual](https://syntermedia.ai/manual)
- **API Documentation:** [docs.syntermedia.ai](https://docs.syntermedia.ai)
- **Claude Plugin:** [github.com/Synter-Media-AI/plugin](https://github.com/Synter-Media-AI/plugin) (skills, agents & this MCP for Claude Code / Desktop)
- **Tool Reference:** [docs.syntermedia.ai/tools](https://docs.syntermedia.ai/tools)
- **MCP Server Comparison:** [syntermedia.ai/blog/best-ad-platform-mcp-servers](https://syntermedia.ai/blog/best-ad-platform-mcp-servers)
- **Free Agent Skills (47 open-source):** [github.com/Synter-Media-AI/free-skills](https://github.com/Synter-Media-AI/free-skills) (also on [skills.sh](https://skills.sh/synter-media-ai/free-skills))
- **Support:** [hello@syntermedia.ai](mailto:hello@syntermedia.ai)

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <a href="https://syntermedia.ai">
    <img src="https://syntermedia.ai/logo.svg" alt="Synter" width="120" />
  </a>
  <br />
  <strong>The MCP extension they don't want you to use.</strong>
  <br />
  <em>Because AI agents with ad budgets change everything.</em>
</p>
