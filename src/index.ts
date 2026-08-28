#!/usr/bin/env node
/**
 * Synter MCP Server
 *
 * Provides tools for AI agents to manage ad campaigns across
 * Google, Meta, LinkedIn, Microsoft, Reddit, TikTok, and more.
 *
 * Environment variables:
 * - SYNTER_API_KEY: Your Synter API key (get one at syntermedia.ai/developer)
 * - SYNTER_API_URL: Optional API URL override (default: https://syntermedia.ai)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import {
  LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM,
  GET_PERFORMANCE_SCRIPT_BY_PLATFORM,
  PERFORMANCE_CAMPAIGN_FILTER_PLATFORMS,
  PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM,
  UPDATE_BUDGET_SCRIPT_BY_PLATFORM,
  pauseCampaignArgs,
  updateBudgetArgs,
  resolveDateRangeArgs,
} from "./platform-routing.js";

const SYNTER_API_KEY = process.env.SYNTER_API_KEY;
const SYNTER_API_URL = process.env.SYNTER_API_URL || "https://syntermedia.ai";
const SYNTER_ARTIFACT_API_URL = process.env.SYNTER_ARTIFACT_API_URL || "https://api.syntermedia.ai";

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
      "List all campaigns across connected ad platforms. Returns campaign name, status, budget, and performance metrics.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        platform: {
          type: "string",
          enum: ["google", "meta", "linkedin", "microsoft", "reddit", "tiktok", "x"],
          description: "Filter by platform (optional - lists all if not specified)",
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
    },
  },
  {
    name: "create_search_campaign",
    description:
      "Create a Google Ads Search campaign with an ad group, responsive search ad, and keywords — all in one atomic request. " +
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
      },
      required: ["campaign_name", "daily_budget", "keywords", "headlines", "descriptions", "final_url"],
    },
  },
  {
    name: "create_display_campaign",
    description:
      "Create a Google Ads Display campaign with responsive display ads. Supports image uploads from URLs.",
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
      },
      required: ["campaign_name", "daily_budget", "headlines", "descriptions", "business_name", "final_url"],
    },
  },
  {
    name: "create_pmax_campaign",
    description:
      "Create a Google Ads Performance Max campaign. Requires images, headlines, descriptions, and a business name.",
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
      },
      required: ["campaign_name", "daily_budget", "headlines", "long_headline", "descriptions", "business_name", "final_url"],
    },
  },
  {
    name: "pause_campaign",
    description: "Pause a campaign by ID. Works across all connected platforms.",
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
          enum: ["google", "meta", "linkedin", "microsoft", "reddit", "tiktok", "x"],
          description: "Ad platform",
        },
      },
      required: ["campaign_id", "platform"],
    },
  },
  {
    name: "update_campaign_budget",
    description: "Update the daily budget for a campaign.",
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
          enum: ["google", "meta", "linkedin", "microsoft", "reddit", "tiktok", "x"],
          description: "Ad platform",
        },
        daily_budget: {
          type: "number",
          description: "New daily budget in USD",
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
      "Get performance metrics (impressions, clicks, spend, conversions, ROAS) for campaigns.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        platform: {
          type: "string",
          enum: ["google", "meta", "linkedin", "microsoft", "reddit", "tiktok", "x"],
          description: "Filter by platform (optional)",
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
    },
  },
  {
    name: "get_daily_spend",
    description: "Get daily spend breakdown across all connected ad accounts.",
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
          enum: ["google", "meta", "linkedin", "microsoft", "reddit", "tiktok", "x"],
          description: "Filter by platform (optional)",
        },
      },
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
    description: "Add negative keywords to block unwanted search terms.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        campaign_id: {
          type: "string",
          description: "Campaign ID",
        },
        keywords: {
          type: "array",
          items: { type: "string" },
          description: "Negative keywords to add",
        },
        level: {
          type: "string",
          enum: ["CAMPAIGN", "AD_GROUP"],
          description: "Level to apply negatives (default: CAMPAIGN)",
        },
      },
      required: ["campaign_id", "keywords"],
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
    description: "List all conversion actions configured in Google Ads.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "diagnose_tracking",
    description:
      "Check if conversion tracking is properly set up on a website. Verifies gtag.js, GTM, and pixel installation.",
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
      "sync_audience via *_artifact_id parameters. FREE — no credits charged. Use this instead of " +
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
      "Upload an audience to an ad platform (Google, Meta, LinkedIn, Microsoft, Reddit, TikTok, X). " +
      "Accepts inline hashed identifiers (hashed_emails, hashed_phones), raw mobile_ids (IDFA/GAID), " +
      "company_domains, a public csv_url, or *_artifact_id references staged via stage_audience_artifact. " +
      "Costs 10 credits on success.",
    annotations: { destructiveHint: true },
    inputSchema: {
      type: "object" as const,
      properties: {
        platform: {
          type: "string",
          enum: ["google", "meta", "linkedin", "microsoft", "reddit", "tiktok", "x"],
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
      "Run any Synter tool by name. Use this for advanced operations not covered by other tools. See docs.syntermedia.ai for full tool list.",
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
      "SYNTER_API_KEY not set. Get your API key at https://syntermedia.ai/developer"
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
      "SYNTER_API_KEY not set. Get your API key at https://syntermedia.ai/developer"
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
    const errorMsg = (data.error as string) || (data.message as string) || `API error: ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

async function stageAudienceArtifact(
  body: string,
  scriptName: string,
  ttlSeconds?: number,
  iHaveConsent?: boolean
): Promise<Record<string, unknown>> {
  if (!SYNTER_API_KEY) {
    throw new Error(
      "SYNTER_API_KEY not set. Get your API key at https://syntermedia.ai/developer"
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
};

function buildSyncAudienceArgs(args: Record<string, unknown>): string[] {
  const platform = String(args.platform || "").toLowerCase();
  const cliArgs: string[] = [];
  if (args.audience_name) cliArgs.push("--name", String(args.audience_name));
  if (args.account_id) cliArgs.push("--account-id", String(args.account_id));
  if (args.hashed_emails) cliArgs.push("--hashed-emails", String(args.hashed_emails));
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
    return callSynterAPIGet("landing-pages");
  }

  if (name === "list_campaigns") {
    // Explicit platform routes to that platform's real script (the confirmed
    // fix). NOTE: an omitted platform still only queries Google, not "all
    // connected platforms" as the tool description promises — aggregating
    // across every connected platform is a larger, separate feature gap this
    // fix does not attempt; left as Google-only to preserve prior behavior
    // for existing callers that don't pass platform.
    const platform = ((args.platform as string) || "google").toLowerCase();
    const script = LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM[platform];
    if (!script) {
      throw new Error(
        `list_campaigns: unsupported platform "${platform}". Supported: ${Object.keys(LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM).join(", ")}`
      );
    }
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
    // date_range -> --days conversion since none of the scripts accept
    // date_range directly (see DATE_RANGE_TO_DAYS comment).
    const platform = ((args.platform as string) || "google").toLowerCase();
    const script = GET_PERFORMANCE_SCRIPT_BY_PLATFORM[platform];
    if (!script) {
      throw new Error(
        `get_performance: unsupported platform "${platform}". Supported: ${Object.keys(GET_PERFORMANCE_SCRIPT_BY_PLATFORM).join(", ")}`
      );
    }
    const cliArgs: string[] = [];
    // Only pull_google_ads and pull_x_ads declare --campaign-id. Previously a
    // campaign_id passed for any other platform was silently dropped and the
    // caller got account-wide totals back as if they were one campaign's.
    // Refuse instead: a wrong number that looks right is worse than an error.
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
      cliArgs.push(...resolveDateRangeArgs(args.date_range as string));
    }
    return callSynterAPI("tools/run", {
      script_name: script,
      args: cliArgs,
      platform,
    });
  }

  if (name === "pause_campaign" || name === "update_campaign_budget") {
    // Both tools require `platform` and advertise all 7, but used to hardcode
    // the Google script and discard the caller's value — so "pause this Reddit
    // campaign" issued a Google pause. platform is REQUIRED in both schemas,
    // so there is no legacy default to preserve here: an omitted or unknown
    // platform is a caller error, not a reason to guess Google.
    const platform = ((args.platform as string) || "").toLowerCase();
    const table =
      name === "pause_campaign"
        ? PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM
        : UPDATE_BUDGET_SCRIPT_BY_PLATFORM;
    const script = table[platform];
    if (!script) {
      throw new Error(
        `${name}: platform is required and must be one of ${Object.keys(table).join(", ")}` +
        (platform ? ` (got "${platform}")` : "")
      );
    }
    const campaignId = args.campaign_id as string;
    const cliArgs =
      name === "pause_campaign"
        ? pauseCampaignArgs(platform, campaignId)
        : updateBudgetArgs(campaignId, args.daily_budget as number);
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
    // Performance
    get_daily_spend: {
      // get_account_daily_spend is a single unified script that already takes
      // its own --platform flag (GOOGLE/META/LINKEDIN/MICROSOFT/REDDIT/X) — the
      // bug here was never forwarding the caller's platform argument at all
      // (it was silently dropped, so the backend received no --platform and
      // fell back to whatever its own default is, regardless of what the tool
      // schema advertised accepting). Omitted platform still defaults to
      // google to preserve prior behavior for existing callers.
      script: "get_account_daily_spend",
      platform: (args.platform as string) || "google",
      argMapper: (a) => {
        const cliArgs: string[] = [
          "--platform", ((a.platform as string) || "google").toUpperCase(),
        ];
        if (a.days) cliArgs.push("--days", String(a.days));
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
        // google_ads_add_negative_keywords takes ONE comma-separated
        // --keywords (unlike the create-campaign scripts' repeated --keyword)
        // and has no --level at all.
        const cliArgs: string[] = ["--campaign-id", a.campaign_id as string];
        const keywords = (a.keywords as string[]) || [];
        if (keywords.length) cliArgs.push("--keywords", keywords.join(","));
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
      version: "1.2.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

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

  console.error("Synter MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
