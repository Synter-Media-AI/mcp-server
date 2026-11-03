# Synter

Synter (https://synterai.com) is an MCP server that lets agents report on and make approved changes to ad campaigns across 30+ ad platforms, including Google Ads, Meta, LinkedIn, Microsoft, Reddit, TikTok, X, Amazon, and programmatic DSPs.

## Connection

- Hosted MCP: `https://mcp.synterai.com` (Streamable HTTP).
- Auth: OAuth browser sign-in, or the `X-Synter-Key: syn_...` header for headless use. Do not send `Authorization: Bearer syn_...` to the hosted MCP yet; REST/SDKs use Bearer.
- Users connect their ad accounts at https://synterai.com/integrations.

## Key tools

- Reads: `list_ad_accounts`, `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `diagnose_tracking`.
- Writes: `create_search_campaign`, `create_meta_campaign`, `create_linkedin_campaign`, `pause_campaign`, `update_campaign_budget`, `add_keywords`.

Start with read tools for reports. Use `dry_run: true` to preview a write before running it live.

## Safety

- New campaigns are created paused; nothing spends until someone enables them.
- Confirm the account, budget, and action with the user before any live write.
- Workspace spend caps, launch preflight, post-write readback, and an audit log apply to writes.

## Pricing

Reading your own ad accounts is free. Actions start at $0.25. Audiences, creative and other add-ons are priced per use. $20/month minimum. 0% of ad spend. Plans: Free, Solo, Scale, Custom (https://synterai.com/pricing).
