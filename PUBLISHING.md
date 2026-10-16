# Publishing Synter MCP Server

## Prerequisites

1. **npm account** with access to publish to `@syntermedia` organization
2. **Anthropic Directory submission** form access

---

## Step 1: Publish to npm

### First-time Setup

```bash
# 1. Create the @syntermedia organization (if not exists)
# Go to: https://www.npmjs.com/org/create
# Organization name: syntermedia

# 2. Login to npm
npm login
# Enter your npm username, password, and email
# If you have 2FA, enter the code when prompted

# 3. Verify you're logged in
npm whoami
# Should output your npm username
```

### Publish the Package

```bash
cd packages/mcp-server

# Build and publish
npm run build
npm publish --access public

# Or use the shortcut
npm run publish:npm
```

### Verify Publication

```bash
# Check the package is live
npm view @synterai/mcp-server

# Test installation
npx -y @synterai/mcp-server
# Should fail with "SYNTER_API_KEY not set" (expected)
```

---

## Step 2: Submit to Anthropic Connectors Directory

### Submission Form

Go to: https://docs.google.com/forms/d/e/1FAIpQLScIL_8v3bvSNhKOT5Xj0Nt3oCv_lbpbmBPTRGNT1QqVj5RbKw/viewform

### Required Information

| Field | Value |
|-------|-------|
| **MCP Server Name** | Synter |
| **npm Package** | `@synterai/mcp-server` |
| **Description** | Manage ad campaigns across Google, Meta, LinkedIn, Microsoft, Reddit, TikTok with AI. Create campaigns, adjust budgets, add keywords, generate creatives, and pull performance metrics. |
| **Author/Org** | Synter Media |
| **GitHub URL** | https://github.com/Synter-Media-AI/mcp-server |
| **Documentation** | https://syntermedia.ai/manual |
| **Categories** | Marketing, Advertising, Analytics |

### Tool List for Submission

```
Campaign Management:
- list_campaigns - List campaigns across all connected platforms
- create_search_campaign - Create Google Search campaigns with keywords
- create_display_campaign - Create Google Display campaigns with images
- create_pmax_campaign - Create Performance Max campaigns
- create_meta_campaign - Create Facebook/Instagram campaigns
- create_linkedin_campaign - Create LinkedIn B2B campaigns
- create_reddit_campaign - Create Reddit community campaigns
- pause_campaign - Pause any campaign
- update_campaign_budget - Adjust daily budgets

Performance & Analytics:
- get_performance - Get impressions, clicks, spend, conversions, ROAS
- get_daily_spend - Daily spend breakdown by platform

Keywords & Targeting:
- add_keywords - Add keywords to campaigns
- add_negative_keywords - Block unwanted search terms

Conversion Tracking:
- create_conversion - Set up conversion actions
- list_conversions - List existing conversions
- diagnose_tracking - Check if tracking is installed

Creative Generation:
- generate_image - AI-generate ad images (Imagen 4, Flux, SDXL)
- generate_video - AI-generate video ads (Veo, Runway, Luma)
- upload_image - Upload images as ad assets

Utility:
- list_ad_accounts - List all connected ad accounts
- run_tool - Run any of 140+ Synter tools directly
```

### Manifest for Directory

The manifest is already configured in `manifest.json` following Anthropic's v0.2 format.

---

## Step 3: Post-Publication Tasks

### Update Synter Docs

Add the MCP server to:
- [ ] https://syntermedia.ai/manual (add MCP section)
- [ ] https://docs.syntermedia.ai (add setup guide)
- [ ] https://syntermedia.ai/developer (link to npm package)

### Create Demo Video

Use the `recording-demo-videos` skill to create a video showing:
1. Getting an API key from syntermedia.ai/developer
2. Adding the MCP server to Claude Desktop config
3. Asking Claude to "list my campaigns"
4. Creating a new campaign with natural language

### Announce

- [ ] Post on X/Twitter
- [ ] Post on LinkedIn
- [ ] Add to Product Hunt (if applicable)

---

## Versioning

Use semantic versioning:
- **Patch (1.0.x)**: Bug fixes
- **Minor (1.x.0)**: New tools, features
- **Major (x.0.0)**: Breaking changes

To release a new version:

```bash
cd packages/mcp-server

# Update version
npm version patch  # or minor, major

# Publish
npm publish --access public

# Push tags
git push --tags
```

---

## Troubleshooting

### "npm ERR! 403 Forbidden"

You don't have permission to publish to @syntermedia. Either:
1. Create the organization at npmjs.com/org/create
2. Or ask an admin to add you to the organization

### "npm ERR! 404 Not Found" after publish

The package takes 1-5 minutes to propagate. Wait and try again.

### Package shows old version

Clear npm cache: `npm cache clean --force`
