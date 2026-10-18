#!/usr/bin/env node
/**
 * Synter MCP Server
 *
 * Provides tools for AI agents to manage ad campaigns across
 * Google, Meta, LinkedIn, Microsoft, Reddit, TikTok, and more.
 *
 * Environment variables:
 * - SYNTER_API_KEY: Your Synter API key (get one at synterai.com/developer)
 * - SYNTER_API_URL: Optional API URL override (default: https://synterai.com)
 * - SYNTER_ARTIFACT_API_URL: Optional artifact API URL override (default: https://api.synterai.com)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import {
  ADVERTISED_PLATFORMS,
  LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM,
  GET_PERFORMANCE_SCRIPT_BY_PLATFORM,
  PERFORMANCE_CAMPAIGN_FILTER_PLATFORMS,
  PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM,
  UPDATE_BUDGET_SCRIPT_BY_PLATFORM,
  pauseCampaignArgs,
  updateBudgetArgs,
  resolveDateRangeArgs,
  requirePlatform,
  DAILY_SPEND_SCRIPT_BY_PLATFORM,
  own,
} from "./platform-routing.js";
import { isDemoMode, getSandboxToolResult } from "./demo-sandbox.js";

const SYNTER_API_KEY = process.env.SYNTER_API_KEY;
const SYNTER_API_URL = process.env.SYNTER_API_URL || "https://synterai.com";
const SYNTER_ARTIFACT_API_URL = process.env.SYNTER_ARTIFACT_API_URL || "https://api.synterai.com";

export const IS_READ_ONLY =
  process.env.SYNTER_READ_ONLY === "true" ||
  process.env.SYNTER_READ_ONLY === "1" ||
  process.argv.includes("--read-only");

export const IS_DEMO = isDemoMode(process.env, process.argv);

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`Synter MCP Server (@synterai/mcp-server)

Official MCP server connecting AI agents to 16 ad platforms:
Google, Meta, LinkedIn, Microsoft, Reddit, TikTok, X, Pinterest, Snapchat, Spotify, Amazon Ads, Amazon DSP, The Trade Desk, OpenAI Ads, DV360, and StackAdapt.

Usage:
  synter-mcp [options]
  npx @synterai/mcp-server [options]

Options:
  --demo       Run in zero-credential demo sandbox mode with realistic mock ad data
  --read-only  Disable all mutating tools and enforce strict read-only mode
  --version    Display version number
  --help, -h   Show this help message

Environment Variables:
  SYNTER_API_KEY     Your Synter API key from https://synterai.com/developer
  SYNTER_DEMO        Enable demo sandbox mode (true / 1)
  SYNTER_READ_ONLY   Enforce read-only mode (true / 1)
  SYNTER_API_URL     API URL override (default: https://synterai.com)
`);
  process.exit(0);
}

if (process.argv.includes("--version") || process.argv.includes("-v")) {
  console.log("1.4.7");
  process.exit(0);
}

// =============================================================================
// Tool Definitions
// =============================================================================

const tools: Tool[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // CAMPAIGN MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "list_campaigns",
    description:
      "List campaigns for ONE ad platform across all 16 ad platforms. `platform` is required -- this tool does not aggregate across platforms. Returns campaign name, status, budget, and performance metrics. 100% Free to Read ($0.00 / 0 credits — works out-of-the-box with zero configuration or API key; live write execution starts on the $20/month Solo plan).",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        platform: {
          type: "string",
          enum: [...ADVERTISED_PLATFORMS],
          description: "Ad platform to list campaigns for (required)",
        },
        status: {
          type: "string",
          enum: ["ENABLED", "PAUSED", "REMOVED"],
          description: "Filter by campaign status",
        },
        limit: {
          type: "number",
          description: "Maximum number of campaigns to return (default: 50)",
        },
      },
      required: ["platform"],
    },
  },
  {
    name: "create_search_campaign",
    description:
      "Create a Google Ads Search campaign with an ad group, responsive search ad, and keywords — all in one atomic request. " +
      "Supports `dry_run: true` ($0.00 / 0 credits, zero credentials required) to preview payload and policy checks. " +
      "Live execution passes the server-side Agent Shield safety gate (daily spend caps, paused-on-create default, human approval mode, and immutable workspace audit log) on the $20/month Solo plan ($20.00 included monthly credits, 0% ad-spend markup). " +
      "IMPORTANT — creative floor: supply 11-15 headlines (15 recommended, max 30 chars each) and 4 descriptions (max 90 chars each), " +
      "echoing your target keywords across at least 5 headlines. The API accepts as few as 3 headlines / 2 descriptions, but ads built " +
      "near that minimum score 'Poor' on Google Ad Strength, get throttled in the auction, and may be rejected by the platform — " +
      "treat 11 headlines / 4 descriptions as the real minimum. " +
      "Fewer than 3 headlines or fewer than 2 descriptions will cause the campaign to be rejected before any API call is made.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        campaign_name: {
          type: "string",
          description: "Name for the campaign",
        },
        daily_budget: {
          type: "number",
          description: "Daily budget in USD",
        },
        keywords: {
          type: "array",
          items: { type: "string" },
          minItems: 1,
          description: "Keywords to target (phrase match). Provide at least 1.",
        },
        headlines: {
          type: "array",
          items: { type: "string", maxLength: 30 },
          minItems: 3,
          maxItems: 15,
          description: "Headlines for the responsive search ad. Provide 11-15 (15 recommended), echoing the target keywords in at least 5. Hard minimum is 3, but fewer than 11 produces a 'Poor' Google Ad Strength rating and auction throttling. Each must be 30 characters or fewer.",
        },
        descriptions: {
          type: "array",
          items: { type: "string", maxLength: 90 },
          minItems: 2,
          maxItems: 4,
          description: "Descriptions for the responsive search ad. Provide all 4. Hard minimum is 2, but fewer than 4 weakens Ad Strength. Each must be 90 characters or fewer.",
        },
        final_url: {
          type: "string",
          description: "Landing page URL",
        },
        geo_targets: {
          type: "array",
          items: { type: "string" },
          description: "Geo target codes (e.g., '2840' for US, '2826' for UK)",
        },
        dry_run: {
          type: "boolean",
          description: "Preview the campaign payload and safety-gate validation without modifying live ad spend ($0.00 / 0 credits; works with zero credentials).",
        },
      },
      required: ["campaign_name", "daily_budget", "keywords", "headlines", "descriptions", "final_url"],
    },
  },
  {
    name: "create_display_campaign",
    description:
      "Create a Google Ads Display campaign with responsive display ads. Supports image uploads from URLs, `dry_run: true` ($0.00 / 0 credits, zero credentials required), and server-side safety gates (daily spend caps, paused-on-create default, approval mode, and audit log).",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        campaign_name: {
          type: "string",
          description: "Name for the campaign",
        },
        daily_budget: {
          type: "number",
          description: "Daily budget in USD",
        },
        landscape_image_url: {
          type: "string",
          description: "URL to 1200x628 landscape image",
        },
        square_image_url: {
          type: "string",
          description: "URL to 1200x1200 square image",
        },
        headlines: {
          type: "array",
          items: { type: "string" },
          description: "Headlines (1-5, max 30 chars each)",
        },
        descriptions: {
          type: "array",
          items: { type: "string" },
          description: "Descriptions (1-5, max 90 chars each)",
        },
        business_name: {
          type: "string",
          description: "Business name (max 25 chars)",
        },
        final_url: {
          type: "string",
          description: "Landing page URL",
        },
        geo_targets: {
          type: "array",
          items: { type: "string" },
          description: "Geo target codes",
        },
        dry_run: {
          type: "boolean",
          description: "Preview the campaign payload and safety-gate validation without modifying live ad spend ($0.00 / 0 credits; works with zero credentials).",
        },
      },
      required: ["campaign_name", "daily_budget", "headlines", "descriptions", "business_name", "final_url"],
    },
  },
  {
    name: "create_pmax_campaign",
    description:
      "Create a Google Ads Performance Max campaign. Requires images, headlines, descriptions, and a business name. Supports `dry_run: true` ($0.00 / 0 credits, zero credentials required) and server-side safety gates (daily spend caps, paused-on-create default, approval mode, and audit log).",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        campaign_name: {
          type: "string",
          description: "Name for the campaign",
        },
        daily_budget: {
          type: "number",
          description: "Daily budget in USD",
        },
        headlines: {
          type: "array",
          items: { type: "string" },
          description: "Headlines (3-15 accepted; provide 11+, 15 recommended — fewer produces a weak Ad Strength rating; max 30 chars each)",
        },
        long_headline: {
          type: "string",
          description: "Long headline (max 90 chars)",
        },
        descriptions: {
          type: "array",
          items: { type: "string" },
          description: "Descriptions (2-5 accepted; provide 4-5; max 90 chars each)",
        },
        business_name: {
          type: "string",
          description: "Business name (max 25 chars)",
        },
        final_url: {
          type: "string",
          description: "Landing page URL",
        },
        landscape_image_url: {
          type: "string",
          description: "URL to 1200x628 landscape image",
        },
        square_image_url: {
          type: "string",
          description: "URL to 1200x1200 square image",
        },
        logo_url: {
          type: "string",
          description: "URL to square logo (min 128x128)",
        },
        geo_targets: {
          type: "array",
          items: { type: "string" },
          description: "Geo target codes",
        },
        target_cpa: {
          type: "number",
          description: "Target CPA in USD (optional)",
        },
        dry_run: {
          type: "boolean",
          description: "Preview the campaign payload and safety-gate validation without modifying live ad spend ($0.00 / 0 credits; works with zero credentials).",
        },
      },
      required: ["campaign_name", "daily_budget", "headlines", "long_headline", "descriptions", "business_name", "final_url"],
    },
  },
  {
    name: "pause_campaign",
    description:
      "Pause a campaign by ID across all 16 connected ad platforms. Supports `dry_run: true` ($0.00 / 0 credits, zero credentials required). Live execution is audited in the workspace audit log ($0.05 / 2 credits on Solo $20/mo plan).",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        campaign_id: {
          type: "string",
          description: "Campaign ID (platform-specific format)",
        },
        platform: {
          type: "string",
          enum: [...ADVERTISED_PLATFORMS],
          description: "Ad platform",
        },
        dry_run: {
          type: "boolean",
          description: "Preview the pause operation without modifying live ad spend ($0.00 / 0 credits; works with zero credentials).",
        },
      },
      required: ["campaign_id", "platform"],
    },
  },
  {
    name: "update_campaign_budget",
    description:
      "Update the daily budget for a campaign across all 16 connected ad platforms. Supports `dry_run: true` ($0.00 / 0 credits, zero credentials required). Live execution passes the server-side Agent Shield safety gate (daily spend ceiling, max 2x budget-change multiplier, approval mode, and immutable audit log).",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        campaign_id: {
          type: "string",
          description: "Campaign ID",
        },
        platform: {
          type: "string",
          enum: [...ADVERTISED_PLATFORMS],
          description: "Ad platform",
        },
        daily_budget: {
          type: "number",
          description: "New daily budget in USD",
        },
        dry_run: {
          type: "boolean",
          description: "Preview the budget update and spend-cap check without modifying live ad spend ($0.00 / 0 credits; works with zero credentials).",
        },
      },
      required: ["campaign_id", "platform", "daily_budget"],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PERFORMANCE & ANALYTICS
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "get_performance",
    description:
      "Get performance metrics (impressions, clicks, spend, conversions, ROAS) for campaigns across any of the 16 ad platforms. Free read-only tool ($0.00 / 0 credits).",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        platform: {
          type: "string",
          enum: [...ADVERTISED_PLATFORMS],
          description: "Ad platform to report on (required)",
        },
        campaign_id: {
          type: "string",
          description: "Filter by specific campaign ID (optional)",
        },
        date_range: {
          type: "string",
          enum: ["TODAY", "YESTERDAY", "LAST_7_DAYS", "LAST_30_DAYS", "THIS_MONTH", "LAST_MONTH"],
          description: "Date range for metrics (default: LAST_7_DAYS)",
        },
      },
      required: ["platform"],
    },
  },
  {
    name: "get_daily_spend",
    description: "Get daily spend breakdown for ONE ad platform across any of the 16 ad platforms. `platform` is required -- this tool does not aggregate across platforms. Free read-only tool ($0.00 / 0 credits).",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        days: {
          type: "number",
          description: "Number of days to look back (default: 7)",
        },
        platform: {
          type: "string",
          enum: [...ADVERTISED_PLATFORMS],
          description: "Ad platform to report on (required)",
        },
      },
      required: ["platform"],
    },
  },
  {
    name: "pacing_report",
    description:
      "Return a deterministic budget-pacing snapshot for the current workspace across every connected ad platform and the overall portfolio (month-to-date spend, today's spend, expected spend to date, pacing percent, projected end-of-period spend, on_track/underspending/overspending/critical status, and off-pace warnings). Free read-only tool ($0.00 / 0 credits).",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "user_budget_pacing_report",
    description:
      "Return a deterministic per-user/trader budget ownership and pacing snapshot from saved workspace assignments (target budget, actual spend, expected spend, projected spend, variance, and pacing status). Free read-only tool ($0.00 / 0 credits).",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        include_archived: {
          type: "boolean",
          description: "Include archived assignments in the snapshot.",
        },
      },
    },
  },
  {
    name: "optimize_budget",
    description:
      "Recommend a cross-channel budget allocation across connected ad platforms using diminishing-returns modeling. Recommend-only (dry_run defaults to true); apply approved changes with update_campaign_budget. Free read-only recommendation tool ($0.00 / 0 credits).",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        total_budget: {
          type: "number",
          description: "Total daily budget in USD to allocate across channels",
        },
        target: {
          type: "string",
          enum: ["conversions", "roas"],
          description: "Optimization objective (default: conversions)",
        },
        constraints: {
          type: "string",
          description:
            "Optional JSON string with per-channel USD/day min/max bounds (e.g. '{\"google\": {\"min\": 500, \"max\": 2500}}')",
        },
        dry_run: {
          type: "boolean",
          description: "Recommend-only mode (default: true)",
        },
      },
      required: ["total_budget"],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // KEYWORDS
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "add_keywords",
    description: "Add keywords to a Google Ads campaign or ad group.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        ad_group_id: {
          type: "string",
          description: "Ad group ID to add keywords to",
        },
        keywords: {
          type: "array",
          items: { type: "string" },
          description: "Keywords to add",
        },
        match_type: {
          type: "string",
          enum: ["EXACT", "PHRASE", "BROAD"],
          description: "Keyword match type (default: PHRASE)",
        },
      },
      required: ["ad_group_id", "keywords"],
    },
  },
  {
    name: "add_negative_keywords",
    description:
      "Manage negative keywords in Google Ads across campaign, ad-group, shared negative list (create, add/remove terms, attach/detach campaigns), and account levels, with full post-change readback.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        campaign_id: {
          type: "string",
          description: "Campaign ID (or comma-separated campaign IDs)",
        },
        campaign_ids: {
          type: "array",
          items: { type: "string" },
          description: "Multiple Campaign IDs to apply negatives to",
        },
        all_enabled: {
          type: "boolean",
          description: "Apply to all enabled Search/Display campaigns",
        },
        ad_group_id: {
          type: "string",
          description: "Ad group ID for AD_GROUP level negatives",
        },
        level: {
          type: "string",
          enum: ["CAMPAIGN", "AD_GROUP", "SHARED_LIST", "ACCOUNT"],
          description: "Level to apply negatives (default: CAMPAIGN)",
        },
        shared_set_id: {
          type: "string",
          description: "Shared negative keyword list ID (SharedSet ID)",
        },
        shared_set_name: {
          type: "string",
          description: "Shared negative keyword list name (to create or look up by name)",
        },
        create_shared_set: {
          type: "boolean",
          description: "Create the shared negative keyword list if it does not already exist",
        },
        attach_campaign_ids: {
          type: "array",
          items: { type: "string" },
          description: "Campaign IDs to attach the shared negative list to",
        },
        detach_campaign_ids: {
          type: "array",
          items: { type: "string" },
          description: "Campaign IDs to detach the shared negative list from",
        },
        account_level: {
          type: "boolean",
          description: "Apply negative keywords at the Google Ads account (customer) level",
        },
        keywords: {
          type: "array",
          items: { type: "string" },
          description: "Negative keywords to add",
        },
        remove_keywords: {
          type: "array",
          items: { type: "string" },
          description: "Negative keywords to remove",
        },
        remove_criterion_ids: {
          type: "array",
          items: { type: "string" },
          description: "Negative keyword criterion IDs to remove",
        },
        match_type: {
          type: "string",
          enum: ["BROAD", "PHRASE", "EXACT"],
          description: "Negative keyword match type (default: BROAD)",
        },
        readback_only: {
          type: "boolean",
          description: "Read back all negative keywords (including shared-list attachments and account-level negatives) without mutating",
        },
        dry_run: {
          type: "boolean",
          description: "Preview changes without applying them",
        },
        account_id: {
          type: "string",
          description: "Optional Google Ads customer ID",
        },
        customer_id: {
          type: "string",
          description: "Optional Google Ads customer ID (alias of account_id)",
        },
      },
      required: [],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CONVERSION TRACKING
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "create_conversion",
    description:
      "Create a conversion action in Google Ads. Returns the conversion ID and label for GTM setup.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Name for the conversion action (e.g., 'Signup', 'Purchase')",
        },
        value: {
          type: "number",
          description: "Default conversion value in USD (optional)",
        },
        category: {
          type: "string",
          enum: ["PURCHASE", "SIGNUP", "LEAD", "PAGE_VIEW", "ADD_TO_CART", "DOWNLOAD", "OTHER"],
          description: "Conversion category (default: LEAD)",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "list_conversions",
    description: "List all conversion actions configured in Google Ads. Free read-only tool ($0.00 / 0 credits).",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "diagnose_tracking",
    description:
      "Check if conversion tracking is properly set up on a website. Verifies gtag.js, GTM, and pixel installation. Free read-only tool ($0.00 / 0 credits).",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        url: {
          type: "string",
          description: "Website URL to check",
        },
      },
      required: ["url"],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CREATIVE GENERATION
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "generate_image",
    description:
      "Generate an AI image for ad creatives using Imagen 4, Flux, or Stable Diffusion.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        prompt: {
          type: "string",
          description: "Image generation prompt (be specific about style, layout, colors)",
        },
        size: {
          type: "string",
          enum: ["1200x628", "1200x1200", "1080x1080", "1920x1080"],
          description: "Image dimensions (default: 1200x628 for display ads)",
        },
        provider: {
          type: "string",
          enum: ["imagen", "flux", "sdxl"],
          description: "AI provider (default: imagen)",
        },
        name: {
          type: "string",
          description: "Asset name for organization",
        },
      },
      required: ["prompt"],
    },
  },
  {
    name: "generate_video",
    description:
      "Generate an AI video ad using Veo, Runway, or Luma. Great for YouTube and social ads.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        concept: {
          type: "string",
          enum: ["pas", "aida", "before_after", "testimonial", "demo", "execute"],
          description: "Video concept framework (default: pas = Problem-Agitate-Solve)",
        },
        product_name: {
          type: "string",
          description: "Product or brand name",
        },
        target_audience: {
          type: "string",
          description: "Who is this video for?",
        },
        key_benefit: {
          type: "string",
          description: "Main value proposition",
        },
        duration: {
          type: "number",
          enum: [6, 8, 15, 30],
          description: "Video duration in seconds (default: 8)",
        },
        provider: {
          type: "string",
          enum: ["veo", "runway", "luma", "creatify"],
          description: "AI provider (default: veo)",
        },
      },
      required: ["product_name", "key_benefit"],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // META (FACEBOOK/INSTAGRAM) ADS
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "create_meta_campaign",
    description: "Create a Meta (Facebook/Instagram) advertising campaign.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Campaign name",
        },
        objective: {
          type: "string",
          enum: ["CONVERSIONS", "TRAFFIC", "LEADS", "AWARENESS", "ENGAGEMENT"],
          description: "Campaign objective",
        },
        daily_budget: {
          type: "number",
          description: "Daily budget in USD",
        },
      },
      required: ["name", "objective", "daily_budget"],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LINKEDIN ADS
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "create_linkedin_campaign",
    description: "Create a LinkedIn Ads campaign for B2B advertising.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Campaign name",
        },
        objective: {
          type: "string",
          enum: ["WEBSITE_VISIT", "LEAD_GENERATION", "ENGAGEMENT", "VIDEO_VIEW", "BRAND_AWARENESS"],
          description: "Campaign objective",
        },
        daily_budget: {
          type: "number",
          description: "Daily budget in USD",
        },
        group_id: {
          type: "string",
          description:
            "Campaign group ID the campaign belongs to (REQUIRED — LinkedIn campaigns cannot exist outside a group). List existing groups with linkedin_ads_get_campaign_groups.",
        },
        target_locations: {
          type: "array",
          items: { type: "string" },
          description: "Target locations, e.g. ['US','UK','CA']",
        },
        target_seniorities: {
          type: "array",
          items: { type: "string" },
          description: "Target seniorities, e.g. ['senior','manager','director','vp','cxo']",
        },
        target_functions: {
          type: "array",
          items: { type: "string" },
          description: "Target job functions, e.g. ['engineering','it','operations']",
        },
        target_audiences: {
          type: "array",
          items: { type: "string" },
          description:
            "Matched-audience segment IDs. Must be the adSegment id (list_audiences 'destination_segment_id'), NOT the dmpSegment id — a dmpSegment id fails with a bare HTTP 500.",
        },
      },
      // company_size / industry / job_function were advertised here but the
      // backend script declares no such flags; group_id, which it REQUIRES,
      // was not exposed at all. Every call this schema described was a 400.
      required: ["name", "group_id"],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // REDDIT ADS
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "create_reddit_campaign",
    description: "Create a Reddit Ads campaign for community-based advertising.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Campaign name",
        },
        objective: {
          type: "string",
          enum: ["TRAFFIC", "CONVERSIONS", "VIDEO_VIEWS", "APP_INSTALLS", "REACH"],
          description: "Campaign objective",
        },
        status: {
          type: "string",
          description: "Initial campaign status",
        },
        account_id: {
          type: "string",
          description: "Override the default Reddit ad account ID",
        },
      },
      // subreddits / interests / daily_budget were advertised here but Reddit
      // sets targeting AND budget on the AD GROUP, not the campaign — the
      // script declares no --subreddit/--interest and its own --daily-budget
      // help says "(Ignored)". Create the campaign, then the ad group.
      required: ["name", "objective"],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // AUDIENCE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "stage_audience_artifact",
    description:
      "Stage a hashed-PII payload (newline-delimited identifiers — SHA-256 emails, phones, or raw MAIDs) " +
      "in Synter's private artifact store and return an opaque artifact_id. Pass that id to " +
      "sync_audience via *_artifact_id parameters. No credits charged. Use this instead of " +
      "pasting hashed identifiers inline when you have more than ~500 entries.",
    annotations: { readOnlyHint: false },
    inputSchema: {
      type: "object" as const,
      properties: {
        body: {
          type: "string",
          description:
            "Newline-delimited identifiers, one per line. SHA-256 hex for emails/phones; raw uppercase UUIDs for MAIDs (IDFA/GAID).",
        },
        script_name: {
          type: "string",
          description:
            "Which script will consume this artifact. Defaults to 'meta_ads_create_audience'. " +
            "Use 'google_ads_create_customer_match' for Google, or other audience-sync script names.",
        },
        ttl_seconds: {
          type: "number",
          description: "How long the staged payload should live in seconds. Default 3600 (1 hour).",
        },
        i_have_consent: {
          type: "boolean",
          description:
            "Confirm the customer has lawful basis (GDPR Art. 6) and required consent under " +
            "CCPA / Meta Custom Audience Terms / Google Customer Match Policy for every " +
            "identifier in `body`. Soft-launch: omitting this flag logs a warning until " +
            "2026-05-21, after which staging is rejected with PII_CONSENT_REQUIRED. Pass " +
            "true only if your customer has obtained the required consents.",
        },
      },
      required: ["body"],
    },
  },
  {
    name: "sync_audience",
    description:
      "Upload an audience to an ad platform (Google, Meta, LinkedIn, Microsoft, Reddit, TikTok, X, StackAdapt). " +
      "Accepts inline hashed identifiers (hashed_emails, hashed_phones), raw mobile_ids (IDFA/GAID), " +
      "company_domains, a public csv_url, or *_artifact_id references staged via stage_audience_artifact. " +
      "Costs 10 credits on success.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        platform: {
          type: "string",
          enum: ["google", "meta", "linkedin", "microsoft", "reddit", "tiktok", "x", "stackadapt"],
          description: "Ad platform to upload to.",
        },
        audience_name: {
          type: "string",
          description: "Name for the audience as it should appear in the platform's UI.",
        },
        account_id: {
          type: "string",
          description: "Platform ad account id. Optional — defaults to the user's primary account on that platform.",
        },
        hashed_emails: {
          type: "string",
          description: "Comma-separated SHA-256 hashed emails (lowercase hex). For small batches; use hashed_emails_artifact_id for >500.",
        },
        hashed_emails_artifact_id: {
          type: "string",
          description: "Artifact id from stage_audience_artifact for SHA-256 hashed emails.",
        },
        hashed_phones: {
          type: "string",
          description: "Comma-separated SHA-256 hashed phones (E.164 format pre-hash). For small batches.",
        },
        hashed_phones_artifact_id: {
          type: "string",
          description: "Artifact id from stage_audience_artifact for SHA-256 hashed phones. Meta + most platforms; not supported by Google's customer match script today.",
        },
        mobile_ids: {
          type: "string",
          description: "Comma-separated raw mobile advertising IDs (IDFA / GAID, uppercase UUID). Meta and TikTok only. NOT hashed.",
        },
        mobile_ids_artifact_id: {
          type: "string",
          description: "Artifact id for raw mobile ids. Meta only.",
        },
        company_domains: {
          type: "string",
          description: "Comma-separated company domains for B2B account targeting (Google + LinkedIn).",
        },
        csv_url: {
          type: "string",
          description: "Public CSV URL with audience identifiers. Alternative to inline params / artifact ids.",
        },
        customer_file_source: {
          type: "string",
          description: "Meta only: USER_PROVIDED_ONLY (default), PARTNER_PROVIDED_ONLY, or BOTH_USER_AND_PARTNER_PROVIDED.",
        },
        i_have_consent: {
          type: "boolean",
          description:
            "Confirm the customer has lawful basis (GDPR Art. 6) and required consent under " +
            "CCPA / Meta Custom Audience Terms / Google Customer Match Policy for every " +
            "identifier in this audience. Soft-launch: omitting this flag logs a warning " +
            "until 2026-05-21, after which the upload is rejected with PII_CONSENT_REQUIRED. " +
            "Pass true only if your customer has obtained the required consents.",
        },
      },
      required: ["platform"],
    },
  },
  {
    name: "manage_audience",
    description:
      "Create, upload to, or list first-party audiences in Google Ads via the Data Manager API. " +
      "Supports Customer Match lists from emails, phone numbers, and company domains (B2B). " +
      "Use action='create' to build a new audience, 'upload' to append members to an existing one, " +
      "'list' to see all audiences, 'status' to check an upload job, or 'list-sources' to see " +
      "linked data sources (GA4, Merchant Center).",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        action: {
          type: "string",
          enum: ["create", "upload", "list", "status", "list-sources"],
          description:
            "create = new audience + upload members | upload = append to existing | " +
            "list = show all audiences | status = check upload job | " +
            "list-sources = show linked GA4/Merchant Center data sources",
        },
        name: {
          type: "string",
          description: "Audience name. Required for action=create. Required for action=upload unless audience_id is provided.",
        },
        emails: {
          type: "string",
          description: "Comma-separated email addresses. Hashed client-side before upload.",
        },
        phones: {
          type: "string",
          description: "Comma-separated phone numbers in E.164 format (e.g. +15551234567).",
        },
        company_domains: {
          type: "string",
          description: "Comma-separated company domains for B2B account targeting (e.g. acme.com,widgets.co).",
        },
        audience_id: {
          type: "string",
          description: "Numeric Google Ads audience ID. Alternative to name for action=upload.",
        },
        membership_lifespan: {
          type: "number",
          description: "Days to keep members in the audience. Default 540 (max 540).",
        },
        job_resource_name: {
          type: "string",
          description: "OfflineUserDataJob resource name. Required for action=status.",
        },
      },
      required: ["action"],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // UTILITY TOOLS
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "list_ad_accounts",
    description: "List all connected ad accounts across platforms.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "upload_image",
    description: "Upload an image as an asset for use in ads.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        image_url: {
          type: "string",
          description: "URL of the image to upload",
        },
        asset_name: {
          type: "string",
          description: "Name for the asset",
        },
        platform: {
          type: "string",
          enum: ["google", "meta", "linkedin"],
          description: "Target platform (default: google)",
        },
      },
      required: ["image_url", "asset_name"],
    },
  },
  {
    name: "run_tool",
    description:
      "Run any Synter tool by name. Use this for advanced operations not covered by other tools. See docs.synterai.com for full tool list.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        script_name: {
          type: "string",
          description: "Name of the tool to run (e.g., 'google_ads_list_audiences')",
        },
        args: {
          type: "array",
          items: { type: "string" },
          description: "Arguments to pass to the tool",
        },
        platform: {
          type: "string",
          description: "Platform for OAuth credentials (google, meta, linkedin, etc.)",
        },
      },
      required: ["script_name"],
    },
  },
  {
    name: "list_landing_pages",
    description: "List all landing pages for the authenticated workspace, including publish status, custom domain, and URLs.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "inspect_agent_shield",
    description:
      "Inspect Synter Agent Shield security guardrails: spend velocity limits, circuit breaker status, and PII protection fences. Free read-only security audit tool.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "verify_angstrom_claim",
    description:
      "Verify advertising claims, budget shifts, or campaign targets against Synter Ångström deterministic ground-truth verification model. Free claim verification tool.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        claim: {
          type: "string",
          description: "Campaign optimization claim, targeting rule, or creative copy to verify",
        },
      },
      required: ["claim"],
    },
  },
  {
    name: "get_skill",
    description:
      "Retrieve core advertising skill runbooks and playbooks (e.g. 'pmax-brand-cannibalization', 'search-hygiene-shield', 'marginal-cpa-budget-rebalancer', 'meta-asc-dark-pool-auditor', 'single-truth-attribution') or pass 'all' to list catalog. Free loadable operational knowledge for AI coding agents.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        skill: {
          type: "string",
          description: "Skill identifier (or 'all'/'list' to see catalog)",
        },
      },
    },
  },
  {
    name: "get_llm_visibility",
    description:
      "Query AI model visibility, Answer Engine Optimization (AEO) ranking, and brand share of voice across ChatGPT, Claude, Perplexity, and Gemini. Free read-only intelligence tool.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        topic: {
          type: "string",
          description: "Search topic or product category (default: 'AI Ad Operations & Multi-Platform MCP')",
        },
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ORGANIC SOCIAL PUBLISHING (Native Synter OAuth — LinkedIn, X, Reddit, Meta, TikTok, YouTube)
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "get_organic_publishing_readiness",
    description:
      "Check organic social publishing readiness and connected OAuth accounts across LinkedIn (personal & organization pages), X, Reddit, Meta, TikTok, and YouTube.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "draft_organic_post",
    description:
      "Create an organic social media post draft for LinkedIn, X, Reddit, Meta, TikTok, or YouTube with optional media attachments and first-comment link.",
    annotations: { readOnlyHint: false },
    inputSchema: {
      type: "object" as const,
      properties: {
        platform: {
          type: "string",
          enum: ["linkedin", "x", "reddit", "meta", "tiktok", "youtube"],
          description: "Target social platform",
        },
        body: {
          type: "string",
          description: "Post body copy",
        },
        title: {
          type: "string",
          description: "Optional post title (used by Reddit, YouTube, and LinkedIn articles/documents)",
        },
        first_comment: {
          type: "string",
          description: "Optional first comment to post immediately after publishing (e.g. link comment on LinkedIn)",
        },
        media_urls: {
          type: "array",
          items: { type: "string" },
          description: "Optional media URLs (images, video, or PDF document)",
        },
        author_type: {
          type: "string",
          enum: ["person", "organization"],
          description: "LinkedIn author type: 'person' (personal profile) or 'organization' (company page)",
        },
        dry_run: {
          type: "boolean",
          description: "Simulate without persisting draft",
        },
      },
      required: ["platform", "body"],
    },
  },
  {
    name: "validate_organic_post",
    description:
      "Validate an organic social post draft against platform character limits, media requirements, and content policies.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        post_id: {
          type: "string",
          description: "Organic post draft ID",
        },
      },
      required: ["post_id"],
    },
  },
  {
    name: "approve_organic_post",
    description:
      "Approve a validated organic social post draft so it can be scheduled or published.",
    annotations: { readOnlyHint: false },
    inputSchema: {
      type: "object" as const,
      properties: {
        post_id: {
          type: "string",
          description: "Organic post draft ID",
        },
        dry_run: {
          type: "boolean",
          description: "Preview approval without mutating state",
        },
      },
      required: ["post_id"],
    },
  },
  {
    name: "schedule_organic_post",
    description:
      "Schedule an approved organic social post for future publication.",
    annotations: { readOnlyHint: false },
    inputSchema: {
      type: "object" as const,
      properties: {
        post_id: {
          type: "string",
          description: "Approved organic post ID",
        },
        scheduled_for: {
          type: "string",
          description: "ISO-8601 UTC timestamp for publication (e.g. '2026-10-15T15:00:00Z')",
        },
        dry_run: {
          type: "boolean",
          description: "Preview schedule without mutating state",
        },
      },
      required: ["post_id", "scheduled_for"],
    },
  },
  {
    name: "publish_organic_post",
    description:
      "Immediately publish an approved organic social post to LinkedIn, X, Reddit, Meta, TikTok, or YouTube via Synter native OAuth.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        post_id: {
          type: "string",
          description: "Approved organic post ID to publish now",
        },
        dry_run: {
          type: "boolean",
          description: "Simulate publish without posting live",
        },
      },
      required: ["post_id"],
    },
  },
  {
    name: "cancel_scheduled_post",
    description:
      "Cancel a scheduled organic social post before it is published.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        post_id: {
          type: "string",
          description: "Scheduled organic post ID",
        },
        dry_run: {
          type: "boolean",
          description: "Simulate cancellation",
        },
      },
      required: ["post_id"],
    },
  },
  {
    name: "list_scheduled_posts",
    description:
      "List organic social posts across platforms filtered by lifecycle status.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        platform: {
          type: "string",
          enum: ["linkedin", "x", "reddit", "meta", "tiktok", "youtube"],
          description: "Optional platform filter",
        },
        status: {
          type: "string",
          enum: ["draft", "validated", "approved", "scheduled", "published", "failed", "cancelled"],
          description: "Optional status filter",
        },
        limit: {
          type: "number",
          description: "Maximum number of posts to return (default: 25)",
        },
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // OUTBOUND EMAIL, WARM INTROS & LINKEDIN OUTREACH
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "prospector_get_pipeline_summary",
    description:
      "Get an overview of outbound outreach health: active campaigns, total leads, emails sent, replies, and inbox warmup status.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "prospector_get_campaigns",
    description:
      "List outbound email outreach campaigns with status and volume metrics.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        status: {
          type: "string",
          description: "Optional status filter (e.g. 'active', 'draft', 'paused')",
        },
      },
    },
  },
  {
    name: "prospector_get_campaign",
    description:
      "Get full details and sequence configuration for a specific outbound outreach campaign.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        campaign_id: {
          type: "string",
          description: "Outbound campaign ID",
        },
      },
      required: ["campaign_id"],
    },
  },
  {
    name: "prospector_get_campaign_performance",
    description:
      "Get performance metrics (sent, opened, replied, bounced, interested) for an outbound campaign.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        campaign_id: {
          type: "string",
          description: "Outbound campaign ID",
        },
        start_date: {
          type: "string",
          description: "Optional start date YYYY-MM-DD",
        },
        end_date: {
          type: "string",
          description: "Optional end date YYYY-MM-DD",
        },
      },
      required: ["campaign_id"],
    },
  },
  {
    name: "prospector_get_leads",
    description:
      "Search or list prospects and leads in the outbound outreach database.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        search: {
          type: "string",
          description: "Optional search query (name, email, or company domain)",
        },
        page: {
          type: "number",
          description: "Page number (default: 1)",
        },
      },
    },
  },
  {
    name: "prospector_get_inbox_health",
    description:
      "Check sending email accounts, warmup scores, deliverability health, and daily send limits.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "prospector_get_pending_replies",
    description:
      "List pending inbound prospect replies with AI classification and draft responses awaiting approval.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        status: {
          type: "string",
          description: "Reply status filter (default: 'pending')",
        },
        limit: {
          type: "number",
          description: "Max replies to return (default: 25)",
        },
      },
    },
  },
  {
    name: "prospector_get_intro_paths",
    description:
      "Find warm introduction paths to a target company or domain through your 1st-degree LinkedIn connections.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        company_or_domain: {
          type: "string",
          description: "Target company name or domain (e.g. 'Rippling' or 'rippling.com')",
        },
      },
      required: ["company_or_domain"],
    },
  },
  {
    name: "prospector_get_warm_intros",
    description:
      "Discover ICP target prospects (CMOs, VPs Growth, CEOs, Hiring Managers) reachable via warm introductions from your 1st-degree LinkedIn network.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: {
          type: "number",
          description: "Maximum warm intro targets to return (default: 20)",
        },
        min_strength: {
          type: "number",
          description: "Minimum connection strength score 0-100 (default: 35)",
        },
      },
    },
  },
  {
    name: "prospector_create_campaign",
    description:
      "Create a new outbound email outreach campaign.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Campaign name",
        },
        max_emails_per_day: {
          type: "number",
          description: "Daily send cap (default: 50)",
        },
        dry_run: {
          type: "boolean",
          description: "Simulate campaign creation without mutating live state",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "prospector_update_campaign_sequence",
    description:
      "Set or replace the multi-step email sequence templates on an outbound outreach campaign.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        campaign_id: {
          type: "string",
          description: "Outbound campaign ID",
        },
        title: {
          type: "string",
          description: "Sequence title",
        },
        steps: {
          type: "array",
          description: "Ordered list of sequence steps ({ email_subject, email_body, wait_in_days, order })",
          items: { type: "object" },
        },
        dry_run: {
          type: "boolean",
          description: "Simulate sequence update without mutating live state",
        },
      },
      required: ["campaign_id", "title", "steps"],
    },
  },
  {
    name: "prospector_add_leads",
    description:
      "Add one or more leads to the outbound outreach database (and optionally assign to a campaign).",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        leads: {
          type: "array",
          description: "Array of lead objects ({ email, first_name, last_name, company_name, job_title })",
          items: { type: "object" },
        },
        campaign_id: {
          type: "string",
          description: "Optional campaign ID to attach leads to",
        },
        dry_run: {
          type: "boolean",
          description: "Simulate lead import without mutating live state",
        },
      },
      required: ["leads"],
    },
  },
  {
    name: "prospector_create_reply",
    description:
      "Approve and send a reply to an inbound prospect email thread.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        reply_id: {
          type: "string",
          description: "Pending reply ID to approve and send",
        },
        edited_text: {
          type: "string",
          description: "Optional edited reply body (uses AI draft if omitted)",
        },
        dry_run: {
          type: "boolean",
          description: "Simulate sending reply without dispatching email",
        },
      },
      required: ["reply_id"],
    },
  },
  {
    name: "prospector_send_outreach_email",
    description:
      "Send a 1:1 outreach or warm-introduction request email via native Microsoft 365 Exchange or Resend.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        to_email: {
          type: "string",
          description: "Recipient email address",
        },
        to_name: {
          type: "string",
          description: "Optional recipient display name",
        },
        subject: {
          type: "string",
          description: "Email subject line",
        },
        body_text: {
          type: "string",
          description: "Plain-text email body",
        },
        body_html: {
          type: "string",
          description: "Optional HTML email body",
        },
        dry_run: {
          type: "boolean",
          description: "Preview email without sending (default: false)",
        },
      },
      required: ["to_email", "subject", "body_text"],
    },
  },
  {
    name: "prospector_post_linkedin_document",
    description:
      "Publish a native LinkedIn PDF carousel / document post via Synter LinkedIn OAuth (supports personal profile or organization page and optional first comment).",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        text: {
          type: "string",
          description: "LinkedIn post commentary text",
        },
        document_url: {
          type: "string",
          description: "Public URL to the PDF document",
        },
        document_title: {
          type: "string",
          description: "Carousel / document title shown in the LinkedIn viewer",
        },
        author_type: {
          type: "string",
          enum: ["person", "organization"],
          description: "Publish as 'person' or 'organization' (default: 'person')",
        },
        first_comment: {
          type: "string",
          description: "Optional first comment to post immediately after publishing",
        },
        dry_run: {
          type: "boolean",
          description: "Validate and preview without publishing live",
        },
      },
      required: ["text", "document_url"],
    },
  },
  {
    name: "prospector_post_linkedin_comment",
    description:
      "Post a comment on a LinkedIn post (urn:li:share:... or urn:li:ugcPost:...) via Synter LinkedIn OAuth.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        post_id: {
          type: "string",
          description: "Target LinkedIn post URN (e.g. 'urn:li:share:7450034974610948096')",
        },
        text: {
          type: "string",
          description: "Comment text to publish",
        },
        author_type: {
          type: "string",
          enum: ["person", "organization"],
          description: "Comment as 'person' or 'organization' (default: 'person')",
        },
        dry_run: {
          type: "boolean",
          description: "Preview comment without posting live",
        },
      },
      required: ["post_id", "text"],
    },
  },
];

// =============================================================================
// API Helper
// =============================================================================

async function callSynterAPI(
  endpoint: string,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> {
  if (!SYNTER_API_KEY) {
    throw new Error(
      "SYNTER_API_KEY not set. Get your API key at https://synterai.com/developer or run with --demo for zero-credential sandbox mode."
    );
  }

  const response = await fetch(`${SYNTER_API_URL}/api/v1/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SYNTER_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json() as Record<string, unknown>;

  if (!response.ok) {
    if (response.status === 402 || data.error === "INSUFFICIENT_CREDITS") {
      return {
        success: false,
        ...data,
        checkoutUrls: {
          solo: `${SYNTER_API_URL}/sign-up?plan=developer&billing=monthly&source=mcp_low_balance`,
          scale: `${SYNTER_API_URL}/sign-up?plan=synter&billing=monthly&source=mcp_low_balance`,
        },
        upgradeHint: `Solo ($20/mo — $20.00 monthly credits): ${SYNTER_API_URL}/sign-up?plan=developer&billing=monthly&source=mcp_low_balance | Scale ($500/mo — $500.00 monthly credits): ${SYNTER_API_URL}/sign-up?plan=synter&billing=monthly&source=mcp_low_balance`,
      };
    }
    const errorMsg = (data.error as string) || (data.message as string) || `API error: ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

async function callSynterAPIGet(
  endpoint: string
): Promise<Record<string, unknown>> {
  if (!SYNTER_API_KEY) {
    throw new Error(
      "SYNTER_API_KEY not set. Get your API key at https://synterai.com/developer or run with --demo for zero-credential sandbox mode."
    );
  }

  const response = await fetch(`${SYNTER_API_URL}/api/v1/${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SYNTER_API_KEY}`,
    },
  });

  const data = await response.json() as Record<string, unknown>;

  if (!response.ok) {
    if (response.status === 402 || data.error === "INSUFFICIENT_CREDITS") {
      return {
        success: false,
        ...data,
        checkoutUrls: {
          solo: `${SYNTER_API_URL}/sign-up?plan=developer&billing=monthly&source=mcp_low_balance`,
          scale: `${SYNTER_API_URL}/sign-up?plan=synter&billing=monthly&source=mcp_low_balance`,
        },
        upgradeHint: `Solo ($20/mo — $20.00 monthly credits): ${SYNTER_API_URL}/sign-up?plan=developer&billing=monthly&source=mcp_low_balance | Scale ($500/mo — $500.00 monthly credits): ${SYNTER_API_URL}/sign-up?plan=synter&billing=monthly&source=mcp_low_balance`,
      };
    }
    const errorMsg = (data.error as string) || (data.message as string) || `API error: ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

async function callSynterMcpTool(
  toolName: string,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> {
  if (!SYNTER_API_KEY) {
    throw new Error(
      "SYNTER_API_KEY not set. Get your API key at https://synterai.com/developer or run with --demo for zero-credential sandbox mode."
    );
  }

  const response = await fetch(`${SYNTER_API_URL}/api/mcp/tools/${toolName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SYNTER_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as Record<string, unknown>;
  if (!response.ok) {
    const errorMsg =
      (data.error as string) ||
      (data.message as string) ||
      `MCP tool error: ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

async function callSynterProspectorTool(
  backendToolName: string,
  toolArgs: Record<string, unknown>
): Promise<Record<string, unknown>> {
  if (!SYNTER_API_KEY) {
    throw new Error(
      "SYNTER_API_KEY not set. Get your API key at https://synterai.com/developer or run with --demo for zero-credential sandbox mode."
    );
  }

  const endpoint = `${SYNTER_API_URL}/api/mcp/prospector`;
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
    Authorization: `Bearer ${SYNTER_API_KEY}`,
  };

  const initRes = await fetch(endpoint, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "synter-mcp-stdio", version: "1.4.7" },
      },
    }),
  });

  const sessionId = initRes.headers.get("mcp-session-id");
  const sessionHeaders: Record<string, string> = sessionId
    ? { ...baseHeaders, "mcp-session-id": sessionId }
    : baseHeaders;

  await fetch(endpoint, {
    method: "POST",
    headers: sessionHeaders,
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "notifications/initialized",
      params: {},
    }),
  }).catch(() => undefined);

  const callRes = await fetch(endpoint, {
    method: "POST",
    headers: sessionHeaders,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: backendToolName,
        arguments: toolArgs,
      },
    }),
  });

  const rawText = await callRes.text();
  let rpcPayload: Record<string, any> | null = null;
  for (const line of rawText.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("data:")) {
      const dataStr = trimmed.slice(5).trim();
      if (dataStr) {
        try {
          rpcPayload = JSON.parse(dataStr);
        } catch {
          // ignore non-JSON SSE lines
        }
      }
    }
  }
  if (!rpcPayload) {
    try {
      rpcPayload = JSON.parse(rawText);
    } catch {
      throw new Error(`Prospector MCP error (${callRes.status}): ${rawText.slice(0, 200)}`);
    }
  }

  if (!callRes.ok || rpcPayload?.error) {
    const msg =
      rpcPayload?.error?.message ||
      rpcPayload?.error ||
      rpcPayload?.message ||
      `Prospector MCP error: ${callRes.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }

  const contentBlocks = rpcPayload?.result?.content;
  if (Array.isArray(contentBlocks) && contentBlocks[0]?.text) {
    try {
      return JSON.parse(contentBlocks[0].text) as Record<string, unknown>;
    } catch {
      return { result: contentBlocks[0].text };
    }
  }

  return (rpcPayload?.result as Record<string, unknown>) || { ok: true };
}

const ORGANIC_MCP_TOOLS = new Set([
  "get_organic_publishing_readiness",
  "draft_organic_post",
  "validate_organic_post",
  "approve_organic_post",
  "schedule_organic_post",
  "publish_organic_post",
  "cancel_scheduled_post",
  "list_scheduled_posts",
]);

const PROSPECTOR_MCP_TOOL_MAP: Record<
  string,
  { backendTool: string; mapArgs?: (args: Record<string, unknown>) => Record<string, unknown> }
> = {
  prospector_get_pipeline_summary: { backendTool: "get_pipeline_summary" },
  prospector_get_campaigns: { backendTool: "list_campaigns" },
  prospector_get_campaign: { backendTool: "get_campaign" },
  prospector_get_campaign_performance: { backendTool: "get_campaign_stats" },
  prospector_get_leads: { backendTool: "list_leads" },
  prospector_get_inbox_health: { backendTool: "get_inbox_health" },
  prospector_get_pending_replies: { backendTool: "get_pending_replies" },
  prospector_get_intro_paths: { backendTool: "get_intro_paths_for_company" },
  prospector_get_warm_intros: { backendTool: "find_warm_intros_to_icp" },
  prospector_create_campaign: { backendTool: "create_campaign" },
  prospector_update_campaign_sequence: { backendTool: "create_sequence_steps" },
  prospector_add_leads: {
    backendTool: "create_lead",
    mapArgs: (a) => {
      const leads = Array.isArray(a.leads) ? (a.leads as Record<string, unknown>[]) : [];
      const first = leads[0] || {};
      return {
        email: first.email || a.email,
        first_name: first.first_name || a.first_name,
        last_name: first.last_name || a.last_name,
        company_name: first.company_name || a.company_name,
        job_title: first.job_title || a.job_title,
        campaign_id: a.campaign_id,
      };
    },
  },
  prospector_create_reply: { backendTool: "approve_and_send_reply" },
  prospector_send_outreach_email: { backendTool: "send_outreach_email" },
  prospector_post_linkedin_document: { backendTool: "post_linkedin_document" },
  prospector_post_linkedin_comment: { backendTool: "post_linkedin_comment" },
};

async function stageAudienceArtifact(
  body: string,
  scriptName: string,
  ttlSeconds?: number,
  iHaveConsent?: boolean
): Promise<Record<string, unknown>> {
  if (!SYNTER_API_KEY) {
    throw new Error(
      "SYNTER_API_KEY not set. Get your API key at https://synterai.com/developer or run with --demo for zero-credential sandbox mode."
    );
  }

  if (iHaveConsent === undefined) {
    // SYN-PII-CONSENT: soft-launch through 2026-05-21. Mirror the backend
    // warning behavior locally so callers see the same notice without
    // round-tripping.
    console.warn(
      "stage_audience_artifact: i_have_consent not set — please pass `i_have_consent: true` " +
      "to confirm lawful basis under GDPR/CCPA + Meta + Google Customer Match terms. " +
      "After 2026-05-21 this will be required."
    );
  }

  const payload: Record<string, unknown> = { body, script_name: scriptName };
  if (ttlSeconds !== undefined) payload.ttl_seconds = ttlSeconds;
  if (iHaveConsent !== undefined) payload.i_have_consent = iHaveConsent;

  const response = await fetch(
    `${SYNTER_ARTIFACT_API_URL}/artifacts/audience-sync-input`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Synter-Key": SYNTER_API_KEY,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json() as Record<string, unknown>;

  if (!response.ok) {
    const errorMsg = (data.error as string) || (data.message as string) || `Staging error: ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const SYNC_AUDIENCE_SCRIPT_BY_PLATFORM: Record<string, string> = {
  google: "google_ads_create_customer_match",
  meta: "meta_ads_create_audience",
  linkedin: "linkedin_ads_create_matched_audience",
  microsoft: "microsoft_ads_create_audience",
  reddit: "reddit_ads_create_audience",
  tiktok: "tiktok_ads_create_audience",
  x: "x_ads_create_audience",
  stackadapt: "stackadapt_create_audience",
};

function buildSyncAudienceArgs(args: Record<string, unknown>): string[] {
  const platform = String(args.platform || "").toLowerCase();
  const cliArgs: string[] = [];
  if (args.audience_name) cliArgs.push("--name", String(args.audience_name));
  if (args.account_id) {
    cliArgs.push(platform === "stackadapt" ? "--advertiser-id" : "--account-id", String(args.account_id));
  }
  if (args.hashed_emails) {
    cliArgs.push(platform === "stackadapt" ? "--emails" : "--hashed-emails", String(args.hashed_emails));
  }
  if (args.hashed_emails_artifact_id) cliArgs.push("--hashed-emails-artifact-id", String(args.hashed_emails_artifact_id));
  if (args.hashed_phones) cliArgs.push("--hashed-phones", String(args.hashed_phones));
  if (args.hashed_phones_artifact_id) cliArgs.push("--hashed-phones-artifact-id", String(args.hashed_phones_artifact_id));
  if (args.phones_artifact_id && (platform === "google" || platform === "meta")) {
    cliArgs.push("--phones-artifact-id", String(args.phones_artifact_id));
  }
  if (args.mobile_ids) cliArgs.push("--mobile-ids", String(args.mobile_ids));
  if (args.mobile_ids_artifact_id && platform === "meta") {
    cliArgs.push("--mobile-ids-artifact-id", String(args.mobile_ids_artifact_id));
  }
  if (args.company_domains) cliArgs.push("--company-domains", String(args.company_domains));
  if (args.csv_url) cliArgs.push("--csv-url", String(args.csv_url));
  if (args.customer_file_source && platform === "meta") {
    cliArgs.push("--customer-file-source", String(args.customer_file_source));
  }
  if (platform === "meta") cliArgs.push("--subtype", "CUSTOM");
  return cliArgs;
}

// =============================================================================
// Tool Handlers
// =============================================================================

type ToolArgs = Record<string, unknown>;

async function handleTool(
  name: string,
  args: ToolArgs
): Promise<Record<string, unknown>> {
  const toolDef = tools.find((t) => t.name === name);
  if (!toolDef) {
    throw new Error(`Unknown tool: ${name}`);
  }

  if (IS_DEMO || args.dry_run === true) {
    return {
      ...getSandboxToolResult(name, args),
      ...(args.dry_run === true ? { dry_run: true, cost_credits: 0, cost_usd: "$0.00" } : {}),
    };
  }

  const isReadOnlyTool = (toolDef.annotations as any)?.readOnlyHint === true;

  // Free zero-credential read/audit tools: work even when SYNTER_API_KEY is not set
  if (
    name === "inspect_agent_shield" ||
    name === "verify_angstrom_claim" ||
    name === "get_skill" ||
    name === "get_llm_visibility"
  ) {
    if (SYNTER_API_KEY) {
      try {
        return await callSynterAPI(`tools/${name}`, args);
      } catch {
        // Fall back to built-in local client-side evaluation
        return getSandboxToolResult(name, args);
      }
    }
    return getSandboxToolResult(name, args);
  }

  // Tools that bypass the standard /api/v1/tools/run dispatcher.
  if (name === "stage_audience_artifact") {
    const body = args.body as string;
    if (!body || typeof body !== "string") {
      throw new Error("stage_audience_artifact requires a 'body' string with newline-delimited identifiers.");
    }
    const scriptName = (args.script_name as string) || "meta_ads_create_audience";
    const ttl = typeof args.ttl_seconds === "number" ? (args.ttl_seconds as number) : undefined;
    const iHaveConsent = typeof args.i_have_consent === "boolean" ? (args.i_have_consent as boolean) : undefined;
    return stageAudienceArtifact(body, scriptName, ttl, iHaveConsent);
  }

  if (name === "sync_audience") {
    const platform = String(args.platform || "").toLowerCase();
    const script = SYNC_AUDIENCE_SCRIPT_BY_PLATFORM[platform];
    if (!script) {
      throw new Error(
        `sync_audience: unsupported platform "${platform}". Supported: ${Object.keys(SYNC_AUDIENCE_SCRIPT_BY_PLATFORM).join(", ")}`
      );
    }
    if (args.i_have_consent === undefined) {
      console.warn(
        "sync_audience: i_have_consent not set — please pass `i_have_consent: true` " +
        "to confirm lawful basis under GDPR/CCPA + Meta + Google Customer Match terms. " +
        "After 2026-05-21 this will be required."
      );
    }
    return callSynterAPI("tools/run", {
      script_name: script,
      args: buildSyncAudienceArgs(args),
      platform,
      // Forwarded so the backend route can enforce; the script-CLI layer
      // ignores unknown top-level fields.
      i_have_consent: args.i_have_consent,
    });
  }

  if (name === "list_landing_pages") {
    if (!SYNTER_API_KEY) {
      return getSandboxToolResult(name, args);
    }
    return callSynterAPIGet("landing-pages");
  }

  if (ORGANIC_MCP_TOOLS.has(name)) {
    if (!SYNTER_API_KEY && isReadOnlyTool) {
      return getSandboxToolResult(name, args);
    }
    return callSynterMcpTool(name, args);
  }

  if (Object.prototype.hasOwnProperty.call(PROSPECTOR_MCP_TOOL_MAP, name)) {
    if (!SYNTER_API_KEY && isReadOnlyTool) {
      return getSandboxToolResult(name, args);
    }
    const spec = PROSPECTOR_MCP_TOOL_MAP[name];
    const mappedArgs = spec.mapArgs ? spec.mapArgs(args) : args;
    return callSynterProspectorTool(spec.backendTool, mappedArgs);
  }

  if (name === "list_campaigns") {
    // platform is required: the silent Google fallback contradicted this
    // tool's own "lists all if not specified" description. See requirePlatform.
    const platform = requirePlatform(
      "list_campaigns",
      args.platform,
      LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM,
    );
    if (!SYNTER_API_KEY) {
      return getSandboxToolResult(name, args);
    }
    const script = LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM[platform];
    const cliArgs: string[] = [];
    if (args.status) cliArgs.push("--status", args.status as string);
    if (args.limit) cliArgs.push("--limit", String(args.limit));
    return callSynterAPI("tools/run", {
      script_name: script,
      args: cliArgs,
      platform,
    });
  }

  if (name === "get_performance") {
    // Same fix shape as list_campaigns above (real per-platform script), plus
    // date_range resolution -- none of the scripts accept a named date_range,
    // so resolveDateRangeArgs converts it to the flags they do declare.
    const platform = requirePlatform(
      "get_performance",
      args.platform,
      GET_PERFORMANCE_SCRIPT_BY_PLATFORM,
    );
    const script = GET_PERFORMANCE_SCRIPT_BY_PLATFORM[platform];
    const cliArgs: string[] = [];
    if (args.campaign_id) {
      if (!PERFORMANCE_CAMPAIGN_FILTER_PLATFORMS.has(platform)) {
        throw new Error(
          `get_performance: campaign_id filtering is not supported for platform "${platform}" ` +
          `(supported: ${[...PERFORMANCE_CAMPAIGN_FILTER_PLATFORMS].join(", ")}). ` +
          `Re-run without campaign_id to get account-level performance, or filter the results yourself.`
        );
      }
      cliArgs.push("--campaign-id", args.campaign_id as string);
    }
    if (args.date_range) {
      cliArgs.push(...resolveDateRangeArgs(args.date_range as string, new Date(), platform));
    }
    if (!SYNTER_API_KEY) {
      return getSandboxToolResult(name, args);
    }
    return callSynterAPI("tools/run", {
      script_name: script,
      args: cliArgs,
      platform,
    });
  }

  if (name === "get_daily_spend") {
    // get_account_daily_spend is one unified script taking its own --platform
    // flag. It used to default to google when the caller omitted platform,
    // while the tool described itself as covering "all connected ad accounts".
    // Handled here rather than in the toolMappings literal below because that
    // literal is built eagerly on every dispatch -- a throwing requirePlatform
    // inside it would reject unrelated tool calls.
    const platform = requirePlatform(
      "get_daily_spend",
      args.platform,
      DAILY_SPEND_SCRIPT_BY_PLATFORM,
    );
    if (!SYNTER_API_KEY) {
      return getSandboxToolResult(name, args);
    }
    const cliArgs: string[] = ["--platform", platform.toUpperCase()];
    if (args.days) cliArgs.push("--days", String(args.days));
    return callSynterAPI("tools/run", {
      script_name: DAILY_SPEND_SCRIPT_BY_PLATFORM[platform],
      args: cliArgs,
      platform,
    });
  }

  if (name === "pause_campaign" || name === "update_campaign_budget") {
    const table =
      name === "pause_campaign"
        ? PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM
        : UPDATE_BUDGET_SCRIPT_BY_PLATFORM;
    const rawPlatform = typeof args.platform === "string" ? args.platform.trim().toLowerCase().replace(/-/g, "_") : "";
    let platform = rawPlatform;
    try {
      platform = requirePlatform(name, args.platform, table);
    } catch {
      throw new Error(
        `${name}: platform is required and must be one of ${Object.keys(table).join(", ")}` +
        (rawPlatform ? ` (got "${rawPlatform}")` : "")
      );
    }
    const script = own(table, platform)!;
    const campaignId = args.campaign_id as string;
    const cliArgs =
      name === "pause_campaign"
        ? pauseCampaignArgs(platform, campaignId)
        : updateBudgetArgs(campaignId, args.daily_budget as number, platform);
    return callSynterAPI("tools/run", {
      script_name: script,
      args: cliArgs,
      platform,
    });
  }

  // Map tool names to script names and handle parameters
  const toolMappings: Record<string, { script: string; platform?: string; argMapper?: (args: ToolArgs) => string[] }> = {
    // Campaign management
    create_search_campaign: {
      script: "google_ads_create_search_campaign",
      platform: "google",
      argMapper: (a) => {
        const cliArgs: string[] = [
          "--campaign-name", a.campaign_name as string,
          "--daily-budget", String(a.daily_budget),
          "--final-url", a.final_url as string,
        ];
        (a.keywords as string[] || []).forEach((k) => cliArgs.push("--keyword", k));
        (a.headlines as string[] || []).forEach((h) => cliArgs.push("--headline", h));
        (a.descriptions as string[] || []).forEach((d) => cliArgs.push("--description", d));
        (a.geo_targets as string[] || []).forEach((g) => cliArgs.push("--geo-targets", g));
        return cliArgs;
      },
    },
    create_display_campaign: {
      script: "google_ads_create_display_campaign",
      platform: "google",
      argMapper: (a) => {
        const cliArgs: string[] = [
          "--campaign-name", a.campaign_name as string,
          "--daily-budget", String(a.daily_budget),
          "--business-name", a.business_name as string,
          "--final-url", a.final_url as string,
        ];
        if (a.landscape_image_url) cliArgs.push("--landscape-image", a.landscape_image_url as string);
        if (a.square_image_url) cliArgs.push("--square-image", a.square_image_url as string);
        (a.headlines as string[] || []).forEach((h) => cliArgs.push("--headline", h));
        (a.descriptions as string[] || []).forEach((d) => cliArgs.push("--description", d));
        (a.geo_targets as string[] || []).forEach((g) => cliArgs.push("--geo-targets", g));
        return cliArgs;
      },
    },
    create_pmax_campaign: {
      script: "google_ads_create_pmax_campaign",
      platform: "google",
      argMapper: (a) => {
        const cliArgs: string[] = [
          "--campaign-name", a.campaign_name as string,
          "--daily-budget", String(a.daily_budget),
          "--business-name", a.business_name as string,
          "--final-url", a.final_url as string,
          "--long-headline", a.long_headline as string,
        ];
        if (a.landscape_image_url) cliArgs.push("--landscape-image-url", a.landscape_image_url as string);
        if (a.square_image_url) cliArgs.push("--square-image-url", a.square_image_url as string);
        if (a.logo_url) cliArgs.push("--logo-url", a.logo_url as string);
        if (a.target_cpa) cliArgs.push("--target-cpa", String(a.target_cpa));
        (a.headlines as string[] || []).forEach((h) => cliArgs.push("--headline", h));
        (a.descriptions as string[] || []).forEach((d) => cliArgs.push("--description", d));
        (a.geo_targets as string[] || []).forEach((g) => cliArgs.push("--geo-targets", g));
        return cliArgs;
      },
    },
    // Performance & Budget Pacing
    pacing_report: {
      script: "pacing_report",
      argMapper: () => [],
    },
    user_budget_pacing_report: {
      script: "user_budget_pacing_report",
      argMapper: (a) => (a.include_archived ? ["--include-archived"] : []),
    },
    optimize_budget: {
      script: "optimize_budget",
      argMapper: (a) => {
        const cliArgs: string[] = [
          "--total-budget",
          String(a.total_budget),
          "--target",
          String(a.target || "conversions"),
        ];
        if (a.constraints) cliArgs.push("--constraints", String(a.constraints));
        return cliArgs;
      },
    },

    // Keywords
    add_keywords: {
      script: "google_ads_add_keywords",
      platform: "google",
      argMapper: (a) => {
        const cliArgs: string[] = ["--ad-group-id", a.ad_group_id as string];
        (a.keywords as string[] || []).forEach((k) => cliArgs.push("--keyword", k));
        if (a.match_type) cliArgs.push("--match-type", a.match_type as string);
        return cliArgs;
      },
    },
    add_negative_keywords: {
      script: "google_ads_add_negative_keywords",
      platform: "google",
      argMapper: (a) => {
        const cliArgs: string[] = [];
        if (a.campaign_id) cliArgs.push("--campaign-id", String(a.campaign_id));
        const campaignIds = (a.campaign_ids as string[]) || [];
        if (campaignIds.length) cliArgs.push("--campaign-ids", campaignIds.join(","));
        if (a.all_enabled) cliArgs.push("--all-enabled");
        if (a.ad_group_id) cliArgs.push("--ad-group-id", String(a.ad_group_id));
        if (a.level) cliArgs.push("--level", String(a.level));
        if (a.shared_set_id) cliArgs.push("--shared-set-id", String(a.shared_set_id));
        if (a.shared_set_name) cliArgs.push("--shared-set-name", String(a.shared_set_name));
        if (a.create_shared_set) cliArgs.push("--create-shared-set");
        const attachIds = (a.attach_campaign_ids as string[]) || [];
        if (attachIds.length) cliArgs.push("--attach-campaign-ids", attachIds.join(","));
        const detachIds = (a.detach_campaign_ids as string[]) || [];
        if (detachIds.length) cliArgs.push("--detach-campaign-ids", detachIds.join(","));
        if (a.account_level) cliArgs.push("--account-level");
        const keywords = (a.keywords as string[]) || [];
        if (keywords.length) cliArgs.push("--keywords", keywords.join(","));
        const removeKeywords = (a.remove_keywords as string[]) || [];
        if (removeKeywords.length) cliArgs.push("--remove-keywords", removeKeywords.join(","));
        const removeCriterionIds = (a.remove_criterion_ids as string[]) || [];
        if (removeCriterionIds.length) cliArgs.push("--remove-criterion-ids", removeCriterionIds.join(","));
        if (a.match_type) cliArgs.push("--match-type", String(a.match_type));
        if (a.readback_only) cliArgs.push("--readback-only");
        if (a.dry_run) cliArgs.push("--dry-run");
        const cid = a.customer_id || a.account_id;
        if (cid) cliArgs.push("--customer-id", String(cid));
        return cliArgs;
      },
    },

    // Conversions
    create_conversion: {
      script: "google_ads_create_conversion",
      platform: "google",
      argMapper: (a) => {
        const cliArgs: string[] = ["--name", a.name as string];
        if (a.value) cliArgs.push("--value", String(a.value));
        if (a.category) cliArgs.push("--category", a.category as string);
        return cliArgs;
      },
    },
    list_conversions: {
      script: "google_ads_list_conversions",
      platform: "google",
      argMapper: () => [],
    },
    diagnose_tracking: {
      script: "diagnose_conversion_tracking",
      // The script declares NO argparse options — it reads the account from the
      // environment. --url was rejected, and because the backend preflight
      // fails open for a no-flag script the call SUCCEEDED and returned a
      // diagnosis of a different account than the url named.
      argMapper: () => [],
    },

    // Creative generation
    generate_image: {
      script: "generate_image",
      argMapper: (a) => {
        const cliArgs: string[] = ["--prompt", a.prompt as string];
        if (a.size) cliArgs.push("--size", a.size as string);
        if (a.provider) cliArgs.push("--provider", a.provider as string);
        if (a.name) cliArgs.push("--name", a.name as string);
        return cliArgs;
      },
    },
    generate_video: {
      script: "generate_video_ad",
      argMapper: (a) => {
        const cliArgs: string[] = [
          "--product", a.product_name as string,
          "--benefit", a.key_benefit as string,
        ];
        if (a.concept) cliArgs.push("--concept", a.concept as string);
        // generate_video_ad declares --target-audience, not --audience.
        if (a.target_audience) cliArgs.push("--target-audience", a.target_audience as string);
        if (a.duration) cliArgs.push("--duration", String(a.duration));
        if (a.provider) cliArgs.push("--provider", a.provider as string);
        return cliArgs;
      },
    },

    // Meta
    create_meta_campaign: {
      script: "meta_ads_create_campaign",
      platform: "meta",
      argMapper: (a) => [
        "--name", a.name as string,
        "--objective", a.objective as string,
        "--daily-budget", String(a.daily_budget),
      ],
    },

    // LinkedIn
    create_linkedin_campaign: {
      script: "linkedin_ads_create_campaign_complete",
      platform: "linkedin",
      argMapper: (a) => {
        // linkedin_ads_create_campaign_complete REQUIRES --group-id (a campaign
        // group must exist first) and declares no --company-size/--industry/
        // --job-function. Its real targeting surface is the --target-* family,
        // comma-separated. The old shape could not produce one successful call.
        if (!a.group_id) {
          throw new Error(
            "create_linkedin_campaign requires group_id: LinkedIn campaigns must belong to a campaign group. " +
            "Create one first, or list existing groups with linkedin_ads_get_campaign_groups."
          );
        }
        const cliArgs: string[] = [
          "--name", a.name as string,
          "--group-id", a.group_id as string,
        ];
        if (a.objective) cliArgs.push("--objective", a.objective as string);
        if (a.daily_budget) cliArgs.push("--daily-budget", String(a.daily_budget));
        const csv = (v: unknown) => (v as string[]).join(",");
        if ((a.target_locations as string[])?.length) cliArgs.push("--target-locations", csv(a.target_locations));
        if ((a.target_seniorities as string[])?.length) cliArgs.push("--target-seniorities", csv(a.target_seniorities));
        if ((a.target_functions as string[])?.length) cliArgs.push("--target-functions", csv(a.target_functions));
        if ((a.target_audiences as string[])?.length) cliArgs.push("--target-audiences", csv(a.target_audiences));
        return cliArgs;
      },
    },

    // Reddit
    create_reddit_campaign: {
      script: "reddit_ads_create_campaign",
      platform: "reddit",
      argMapper: (a) => {
        // reddit_ads_create_campaign has no --subreddit or --interest: Reddit
        // sets targeting AND budget on the ad group, and the script's own
        // --daily-budget help says "(Ignored)". All three are dropped rather
        // than sent as flags that 400 or values that silently do nothing.
        const cliArgs: string[] = [
          "--name", a.name as string,
          "--objective", a.objective as string,
        ];
        if (a.status) cliArgs.push("--status", a.status as string);
        if (a.account_id) cliArgs.push("--account-id", a.account_id as string);
        return cliArgs;
      },
    },

    // Audience management
    manage_audience: {
      script: "google_ads_data_manager",
      platform: "google",
      argMapper: (a) => {
        const cliArgs: string[] = ["--action", a.action as string];
        if (a.name) cliArgs.push("--name", a.name as string);
        if (a.emails) cliArgs.push("--emails", a.emails as string);
        if (a.phones) cliArgs.push("--phones", a.phones as string);
        if (a.company_domains) cliArgs.push("--company-domains", a.company_domains as string);
        if (a.audience_id) cliArgs.push("--audience-id", a.audience_id as string);
        if (a.membership_lifespan) cliArgs.push("--membership-lifespan", String(a.membership_lifespan));
        if (a.job_resource_name) cliArgs.push("--job-resource-name", a.job_resource_name as string);
        return cliArgs;
      },
    },

    // Utility
    list_ad_accounts: {
      script: "google_ads_list_customers",
      platform: "google",
      argMapper: () => [],
    },
    upload_image: {
      script: "google_ads_upload_image_asset",
      platform: "google",
      argMapper: (a) => [
        "--image-url", a.image_url as string,
        "--asset-name", a.asset_name as string,
      ],
    },
    run_tool: {
      script: args.script_name as string,
      platform: (args.platform as string) || undefined,
      argMapper: (a) => (a.args as string[]) || [],
    },
  };

  const mapping = toolMappings[name];
  if (!mapping) {
    throw new Error(`Unknown tool: ${name}`);
  }

  const scriptArgs = mapping.argMapper ? mapping.argMapper(args) : [];

  if (!SYNTER_API_KEY && isReadOnlyTool && !(name === "list_ad_accounts" && Object.keys(args).length === 0)) {
    return getSandboxToolResult(name, args);
  }
  
  return callSynterAPI("tools/run", {
    script_name: mapping.script,
    args: scriptArgs,
    platform: typeof mapping.platform === "function" 
      ? mapping.platform 
      : mapping.platform || (args.platform as string),
  });
}

// =============================================================================
// Main Server
// =============================================================================

async function main() {
  const server = new Server(
    {
      name: "synter-mcp",
      version: "1.4.7",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // List available tools (filtered to read-only tools when read-only mode is active)
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: IS_READ_ONLY
      ? tools.filter((t) => (t.annotations as any)?.readOnlyHint === true)
      : tools,
  }));

  // List free knowledge & security resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [
      {
        uri: "synter://agent-shield/policies",
        name: "Synter Agent Shield Active Guardrails",
        description: "Active spend velocity limits, circuit breaker settings, and PII protection invariants.",
        mimeType: "application/json",
      },
      {
        uri: "synter://angstrom/rubric",
        name: "Synter Ångström Ground-Truth Verification Standard",
        description: "Deterministic rubric and verification criteria for ad claims, platform APIs, and conversion tracking.",
        mimeType: "text/markdown",
      },
      {
        uri: "synter://skills/catalog",
        name: "Synter Agent Skills Catalog",
        description: "Directory of core advertising playbooks (PMax cannibalization, search hygiene, marginal CPA rebalancing, Meta ASC dark pool, attribution).",
        mimeType: "application/json",
      },
      {
        uri: "synter://pricing/coverage",
        name: "Verified Pricing and Platform Coverage Reference",
        description: "Canonical pricing tiers ($0.00 free to read across all 16 ad platforms, then SOLO $20/mo with $20.00 claimable monthly credits, SCALE $500/mo, 0% ad spend fee) and 16-platform matrix.",
        mimeType: "text/markdown",
      },
    ],
  }));

  // Read resource contents
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    if (uri === "synter://agent-shield/policies") {
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(
              {
                status: "ENFORCING",
                guardrails: {
                  max_daily_budget_multiplier: 2.0,
                  daily_spend_velocity_cap_usd: 5000.0,
                  anomalous_cpa_circuit_breaker: "PAUSE_IMMEDIATELY",
                  pii_sanitization: "STRICT_ZERO_UNHASHED",
                },
                policies: [
                  "Never execute mutations without explicit user consent or dry-run evaluation",
                  "Mandatory post-write provider readback on all campaign and budget changes",
                  "Enforce Google RSA 11-headline / 4-description creative floor",
                  "Auto-pause campaigns when CPA exceeds 3x threshold",
                ],
              },
              null,
              2
            ),
          },
        ],
      };
    }
    if (uri === "synter://angstrom/rubric") {
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: `# Synter Ångström Ground-Truth Verification Standard

Ångström provides deterministic ground-truth verification of advertising operations:
1. API Capability: Every tool call corresponds to verified, live ad network endpoints.
2. Tag Readiness: Conversion tracking and tags must be active before deploying paid traffic.
3. Budget Safety Floor: Budgets must meet network-specific floors ($5-$10/day) and remain within account caps.
4. Creative Compliance: Zero prohibited claims, strict headline/description minimums (11/4 for Google RSA).
5. Post-Write Readback: All state mutations must be independently verified by re-reading the remote provider state.`,
          },
        ],
      };
    }
    if (uri === "synter://skills/catalog") {
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(
              {
                catalog: [
                  { id: "pmax-brand-cannibalization", name: "Google PMax Brand Cannibalization Shield" },
                  { id: "search-hygiene-shield", name: "Search Term Waste & Hygiene Shield" },
                  { id: "marginal-cpa-budget-rebalancer", name: "Marginal CPA Cross-Channel Budget Rebalancer" },
                  { id: "meta-asc-dark-pool-auditor", name: "Meta Advantage+ Shopping Dark Pool Auditor" },
                  { id: "single-truth-attribution", name: "Single-Truth Multi-Touch Attribution" },
                  { id: "executive-media-plan", name: "Executive Multi-Tab Media Plan" },
                  { id: "campaign-trafficking-inputs", name: "Campaign Trafficking & Ad Copy Workbook" },
                  { id: "digital-media-strategy-sow", name: "Digital Media & GTM Campaign Strategy SOW" },
                ],
              },
              null,
              2
            ),
          },
        ],
      };
    }
    if (uri === "synter://pricing/coverage") {
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: `# Synter Verified Pricing & 16-Platform Matrix

## 100% Free to Read ($0.00 / month — 0 credits)
- Campaign listing across all 16 ad platforms (list_campaigns)
- Performance metrics across all 16 ad platforms (get_performance)
- Daily spend time-series breakdown (get_daily_spend)
- Cross-channel budget pacing and trader ownership (pacing_report, user_budget_pacing_report, optimize_budget)
- Conversion tracking diagnostics (diagnose_tracking, list_conversions)
- Agent Shield security inspection (inspect_agent_shield)
- Synter Ångström claim verification (verify_angstrom_claim)
- Agent skills catalog and execution runbooks (get_skill)
- LLM visibility and AEO ranking reads (get_llm_visibility)

## Subscription Plans for Write Execution ($20 / month Solo)
- SOLO: $20/month ($200/year), 1 seat, includes $20.00/mo claimable credits for live campaign creation, budget updates, pausing, and audience sync across all 16 ad platforms
- SCALE: $500/month ($5,000/year), 5 seats, includes $500.00/mo claimable credits for teams and agencies
- CUSTOM: Sales-led enterprise contracts with custom seats and credit allocations
- Media Spend Markup: 0% (Synter does not charge a percentage of your ad spend)

## Platform Matrix (16 Ad Platforms)
- 16 Direct Execution: Google, Meta, LinkedIn, Microsoft, Reddit, TikTok, X, Pinterest, Snapchat, Spotify, Amazon Ads, Amazon DSP, The Trade Desk, OpenAI Ads, DV360, StackAdapt
- 11 Extended Catalog: FreeWheel, CM360, Walmart Connect, Instacart, Target Roundel, Criteo, SA360, Samsung Ads, Taboola, Outbrain, Apple Search Ads`,
          },
        ],
      };
    }
    throw new Error(`Resource not found: ${uri}`);
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (IS_READ_ONLY) {
      const toolDef = tools.find((t) => t.name === name);
      if (!toolDef || (toolDef.annotations as any)?.readOnlyHint !== true) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Tool '${name}' is disabled in read-only mode (SYNTER_READ_ONLY / --read-only active). Remove --read-only or set SYNTER_READ_ONLY=false to enable mutations.`,
            },
          ],
          isError: true,
        };
      }
    }

    try {
      const result = await handleTool(name, (args || {}) as ToolArgs);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Connect via stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error(
    `Synter MCP server running on stdio${IS_DEMO ? " (DEMO SANDBOX mode active: zero credentials required)" : ""}${IS_READ_ONLY ? " (READ-ONLY mode active)" : ""}`
  );
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
