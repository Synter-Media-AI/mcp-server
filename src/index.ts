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

const SYNTER_API_KEY = process.env.SYNTER_API_KEY;
const SYNTER_API_URL = process.env.SYNTER_API_URL || "https://syntermedia.ai";

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
      "Create a Google Ads Search campaign with keywords. Sets up campaign, ad group, keywords, and responsive search ads.",
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
          description: "Keywords to target (will be added as phrase match)",
        },
        headlines: {
          type: "array",
          items: { type: "string" },
          description: "Headlines for the responsive search ad (3-15, max 30 chars each)",
        },
        descriptions: {
          type: "array",
          items: { type: "string" },
          description: "Descriptions for the responsive search ad (2-4, max 90 chars each)",
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
          description: "Headlines (3-15, max 30 chars each)",
        },
        long_headline: {
          type: "string",
          description: "Long headline (max 90 chars)",
        },
        descriptions: {
          type: "array",
          items: { type: "string" },
          description: "Descriptions (2-5, max 90 chars each)",
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
        target_company_sizes: {
          type: "array",
          items: { type: "string" },
          enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10001+"],
          description: "Target company sizes",
        },
        target_industries: {
          type: "array",
          items: { type: "string" },
          description: "Target industries (LinkedIn industry codes)",
        },
        target_job_functions: {
          type: "array",
          items: { type: "string" },
          description: "Target job functions (e.g., 'Marketing', 'Engineering', 'Sales')",
        },
      },
      required: ["name", "objective", "daily_budget"],
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
        daily_budget: {
          type: "number",
          description: "Daily budget in USD",
        },
        subreddits: {
          type: "array",
          items: { type: "string" },
          description: "Subreddits to target (optional - omit for interest-based targeting)",
        },
        interests: {
          type: "array",
          items: { type: "string" },
          description: "Interest categories to target",
        },
      },
      required: ["name", "objective", "daily_budget"],
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

// =============================================================================
// Tool Handlers
// =============================================================================

type ToolArgs = Record<string, unknown>;

async function handleTool(
  name: string,
  args: ToolArgs
): Promise<Record<string, unknown>> {
  // Map tool names to script names and handle parameters
  const toolMappings: Record<string, { script: string; platform?: string; argMapper?: (args: ToolArgs) => string[] }> = {
    // Campaign management
    list_campaigns: {
      script: "google_ads_list_campaigns",
      platform: (args.platform as string) || "google",
      argMapper: (a) => {
        const cliArgs: string[] = [];
        if (a.status) cliArgs.push("--status", a.status as string);
        if (a.limit) cliArgs.push("--limit", String(a.limit));
        return cliArgs;
      },
    },
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
    pause_campaign: {
      script: "pause_campaign",
      platform: "google",
      argMapper: (a) => ["--campaign-id", a.campaign_id as string],
    },
    update_campaign_budget: {
      script: "update_campaign_budget",
      platform: "google",
      argMapper: (a) => [
        "--campaign-id", a.campaign_id as string,
        "--budget", String(a.daily_budget),
      ],
    },

    // Performance
    get_performance: {
      script: "pull_google_ads_data",
      platform: "google",
      argMapper: (a) => {
        const cliArgs: string[] = [];
        if (a.campaign_id) cliArgs.push("--campaign-id", a.campaign_id as string);
        if (a.date_range) cliArgs.push("--date-range", a.date_range as string);
        return cliArgs;
      },
    },
    get_daily_spend: {
      script: "get_account_daily_spend",
      platform: "google",
      argMapper: (a) => {
        const cliArgs: string[] = [];
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
        const cliArgs: string[] = ["--campaign-id", a.campaign_id as string];
        (a.keywords as string[] || []).forEach((k) => cliArgs.push("--keyword", k));
        if (a.level) cliArgs.push("--level", a.level as string);
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
      argMapper: (a) => ["--url", a.url as string],
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
        if (a.target_audience) cliArgs.push("--audience", a.target_audience as string);
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
        const cliArgs: string[] = [
          "--name", a.name as string,
          "--objective", a.objective as string,
          "--daily-budget", String(a.daily_budget),
        ];
        (a.target_company_sizes as string[] || []).forEach((s) => cliArgs.push("--company-size", s));
        (a.target_industries as string[] || []).forEach((i) => cliArgs.push("--industry", i));
        (a.target_job_functions as string[] || []).forEach((j) => cliArgs.push("--job-function", j));
        return cliArgs;
      },
    },

    // Reddit
    create_reddit_campaign: {
      script: "reddit_ads_create_campaign",
      platform: "reddit",
      argMapper: (a) => {
        const cliArgs: string[] = [
          "--name", a.name as string,
          "--objective", a.objective as string,
          "--daily-budget", String(a.daily_budget),
        ];
        (a.subreddits as string[] || []).forEach((s) => cliArgs.push("--subreddit", s));
        (a.interests as string[] || []).forEach((i) => cliArgs.push("--interest", i));
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
      version: "1.0.7",
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
