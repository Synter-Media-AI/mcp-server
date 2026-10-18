---
name: synter-ads
description: Technical reference for @synterai/mcp-server (v1.4.7), covering hosted OAuth, local stdio, platform coverage, readback, workspace spend limits, launch preflight, and the audit log.
---

# `@synterai/mcp-server` (v1.4.7) engineering reference

Package: `@synterai/mcp-server@1.4.7` (MIT license, [source](https://github.com/Synter-Media-AI/mcp-server)).

## Hosted access

Use `https://mcp.synterai.com` with Streamable HTTP and OAuth 2.1 browser sign-in. No API key is needed for hosted access.

```json
{"mcpServers":{"synter-ads":{"url":"https://mcp.synterai.com"}}}
```

Free to read; writes from $20/mo (Solo). See [pricing](https://synterai.com/pricing) and the [MCP overview](https://docs.synterai.com/mcp/overview).

## Platform coverage

Reads across 43 ad platforms; 16 with verified write and create; write/create depth varies by platform API.

The local npm/stdio package's `platform` enum covers these 16 core platforms:

`google`, `meta`, `linkedin`, `microsoft`, `reddit`, `tiktok`, `x`, `pinterest`, `snapchat`, `spotify`, `amazon_ads`, `amazon_dsp`, `the_trade_desk`, `openai`, `dv360`, `stackadapt`.

Amazon DSP has limited create support. Spotify Ads, Amazon Ads, and OpenAI Ads have limited write support. The Trade Desk and Display & Video 360 have limited write and create support. The full 43 are read through the hosted endpoint; see the [README platform table](../../README.md#supported-ad-platforms) and [integrations](https://synterai.com/integrations).

## Local stdio and verification

For clients that need stdio, use `npx -y @synterai/mcp-server@1.4.7`. For live account access, configure `SYNTER_API_KEY` from [Developer Settings](https://synterai.com/developer). Use `--demo` for mock data without credentials; sandbox responses do not verify live account state.

Use `tools/list` to inspect the available tool names and schemas. Pass `--read-only` or set `SYNTER_READ_ONLY=true` to remove mutating tools and block writes locally. Use `dry_run: true` only where the tool schema supports it.

## Safety and readback

Synter provides workspace spend limits, launch preflight, readback, and an audit log. Client confirmations depend on the MCP client and its configuration.

Before a live write, verify the workspace, ad account, platform, destination, and budget. Run launch preflight, then read back the result and report the observed provider state. Keep sandbox previews distinct from live verification.
