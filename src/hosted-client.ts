import { Ajv, type ErrorObject, type ValidateFunction } from "ajv";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

type JsonObject = Record<string, unknown>;
type ToolResult = JsonObject;
type FetchLike = typeof fetch;

interface RpcResponse {
  jsonrpc?: string;
  id?: string | number | null;
  result?: JsonObject;
  error?: { code?: number; message?: string; data?: unknown };
}

interface HostedMcpClientOptions {
  endpoint?: string;
  apiKey?: string;
  fetch?: FetchLike;
  discoveryTimeoutMs?: number;
  callTimeoutMs?: number;
  maxCatalogPages?: number;
  catalogTtlMs?: number;
}

interface LegacyAlias {
  tool: Tool;
  target: string;
  mapArguments: (args: JsonObject) => JsonObject;
}

const PLATFORMS = ["google", "meta", "linkedin", "microsoft", "reddit", "tiktok", "x"] as const;
const PERFORMANCE_TOOLS: Record<string, string> = Object.fromEntries(
  PLATFORMS.map((platform) => [platform, `pull_${platform}_ads_performance`]),
);

const legacyAliases: LegacyAlias[] = [
  {
    tool: {
      name: "get_performance",
      description: "Legacy compatibility wrapper. Forwards to the hosted platform performance tool; explicit account identity is supported and hosted truncation/warnings are preserved.",
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: "object",
        properties: {
          platform: { type: "string", enum: PLATFORMS },
          account_id: { type: "string", minLength: 1 },
          account_name: { type: "string", minLength: 1 },
          campaign_id: { type: "string", minLength: 1 },
          date_range: {
            type: "string",
            enum: ["TODAY", "YESTERDAY", "LAST_7_DAYS", "LAST_14_DAYS", "LAST_30_DAYS", "LAST_90_DAYS", "LAST_180_DAYS", "LAST_365_DAYS", "LAST_2_YEARS", "LAST_3_YEARS"],
          },
          days: { type: "integer", minimum: 1, maximum: 1095 },
          start_date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
          end_date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
        },
        required: ["platform"],
        additionalProperties: false,
      },
    },
    target: "__platform_performance__",
    mapArguments: ({ platform: _platform, date_range, ...args }) => ({
      ...args,
      ...(date_range ? { date_range: String(date_range).toLowerCase() } : {}),
    }),
  },
  {
    tool: {
      name: "get_daily_spend",
      description: "Legacy compatibility wrapper for one account and one date. Requires the hosted backend's platform, account_id, and YYYY-MM-DD date contract.",
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: "object",
        properties: {
          platform: { type: "string", enum: PLATFORMS },
          account_id: { type: "string", minLength: 1 },
          date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
        },
        required: ["platform", "account_id", "date"],
        additionalProperties: false,
      },
    },
    target: "execute",
    mapArguments: (args) => ({
      action: "get_account_daily_spend",
      platform: args.platform,
      account_id: args.account_id,
      args: [
        "--platform", String(args.platform).toUpperCase(),
        "--account-id", String(args.account_id),
        "--date", String(args.date),
      ],
    }),
  },
  {
    tool: {
      name: "list_ad_accounts",
      description: "Legacy compatibility wrapper for all connected ad-platform accounts. Uses hosted cross-platform discovery and exposes its pagination controls.",
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: "object",
        properties: {
          page: { type: "integer", minimum: 1, default: 1 },
          limit: { type: "integer", minimum: 1, maximum: 100, default: 50 },
          platform: { type: "string", minLength: 1 },
          offset: { type: "integer", minimum: 0 },
        },
        additionalProperties: false,
      },
    },
    target: "list_connected_accounts",
    mapArguments: (args) => args,
  },
  {
    tool: {
      name: "run_tool",
      description: "Legacy compatibility wrapper for the hosted execute tool. Calls execute immediately unless dry_run is true.",
      annotations: { destructiveHint: true },
      inputSchema: {
        type: "object",
        properties: {
          script_name: { type: "string", minLength: 1 },
          args: { type: "array", items: { type: "string" } },
          platform: { type: "string", minLength: 1 },
          account_id: { type: "string", minLength: 1 },
          dry_run: { type: "boolean", default: false },
        },
        required: ["script_name"],
        additionalProperties: false,
      },
    },
    target: "execute",
    mapArguments: ({ script_name, ...args }) => ({ action: script_name, ...args }),
  },
];

function formatValidationErrors(errors: ErrorObject[] | null | undefined): string {
  return (errors || [])
    .map((error) => `${error.instancePath || "/"} ${error.message || "is invalid"}`)
    .join("; ");
}

function errorDetail(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const body = value as JsonObject;
  for (const key of ["message", "error", "detail"]) {
    if (typeof body[key] === "string" && body[key]) return body[key] as string;
  }
  return undefined;
}

function parseRpcResponse(text: string): RpcResponse {
  const trimmed = text.trim();
  if (/^data:/m.test(trimmed)) {
    const messages = trimmed
      .split(/\n\n+/)
      .map((event) => event.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n"))
      .filter(Boolean);
    if (messages.length !== 1) {
      throw new Error(`expected one SSE message, received ${messages.length}`);
    }
    return JSON.parse(messages[0]) as RpcResponse;
  }
  return JSON.parse(trimmed) as RpcResponse;
}

function strictInputSchema(schema: Tool["inputSchema"]): Tool["inputSchema"] {
  if (
    schema.type === "object" &&
    schema.properties &&
    schema.additionalProperties === undefined
  ) {
    return { ...schema, additionalProperties: false };
  }
  return schema;
}

export class HostedMcpClient {
  private readonly endpoint: string;
  private readonly apiKey?: string;
  private readonly fetchImpl: FetchLike;
  private readonly discoveryTimeoutMs: number;
  private readonly callTimeoutMs: number;
  private readonly maxCatalogPages: number;
  private readonly catalogTtlMs: number;
  private readonly ajv = new Ajv({ allErrors: true, strict: false });
  private catalog?: Tool[];
  private catalogExpiresAt = 0;
  private validators = new Map<string, ValidateFunction>();
  private aliases = new Map<string, LegacyAlias>();
  private requestId = 0;

  constructor(options: HostedMcpClientOptions = {}) {
    this.endpoint = options.endpoint || "https://mcp.syntermedia.ai/mcp/";
    this.apiKey = options.apiKey;
    this.fetchImpl = options.fetch || fetch;
    this.discoveryTimeoutMs = options.discoveryTimeoutMs ?? 15_000;
    this.callTimeoutMs = options.callTimeoutMs ?? 120_000;
    this.maxCatalogPages = options.maxCatalogPages ?? 20;
    this.catalogTtlMs = options.catalogTtlMs ?? 300_000;
  }

  async listTools(forceRefresh = false): Promise<Tool[]> {
    if (!forceRefresh && this.catalog && Date.now() < this.catalogExpiresAt) {
      return this.catalog;
    }

    const hosted: Tool[] = [];
    const names = new Set<string>();
    let cursor: string | undefined;
    for (let page = 0; page < this.maxCatalogPages; page += 1) {
      const result = await this.rpc("tools/list", cursor ? { cursor } : {}, this.discoveryTimeoutMs);
      if (!Array.isArray(result.tools)) {
        throw new Error("Hosted MCP tools/list returned no tools array.");
      }
      for (const candidate of result.tools) {
        const tool = candidate as Tool;
        if (!tool || typeof tool.name !== "string" || !tool.inputSchema) {
          throw new Error("Hosted MCP returned a malformed tool definition.");
        }
        if (names.has(tool.name)) throw new Error(`Hosted MCP returned duplicate tool name: ${tool.name}`);
        names.add(tool.name);
        hosted.push(tool);
      }
      cursor = typeof result.nextCursor === "string" && result.nextCursor ? result.nextCursor : undefined;
      if (!cursor) break;
      if (page === this.maxCatalogPages - 1) {
        throw new Error(`Hosted MCP catalog exceeded the ${this.maxCatalogPages}-page safety limit.`);
      }
    }

    this.aliases = new Map(
      legacyAliases.filter((alias) => !names.has(alias.tool.name)).map((alias) => [alias.tool.name, alias]),
    );
    const catalog = [...hosted, ...[...this.aliases.values()].map((alias) => alias.tool)];
    this.validators.clear();
    for (const tool of catalog) {
      try {
        this.validators.set(tool.name, this.ajv.compile(strictInputSchema(tool.inputSchema)));
      } catch (error) {
        throw new Error(`Invalid hosted schema for ${tool.name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    this.catalog = catalog;
    this.catalogExpiresAt = Date.now() + this.catalogTtlMs;
    return catalog;
  }

  async callTool(name: string, args: JsonObject = {}): Promise<ToolResult> {
    const tools = await this.listTools();
    const tool = tools.find((candidate) => candidate.name === name);
    if (!tool) throw new Error(`Unknown tool "${name}". Refresh tools/list and use a discovered tool name.`);
    const validate = this.validators.get(name);
    if (!validate || !validate(args)) {
      throw new Error(`${name}: invalid arguments: ${formatValidationErrors(validate?.errors)}`);
    }

    const alias = this.aliases.get(name);
    let target = alias?.target || name;
    if (target === "__platform_performance__") {
      target = PERFORMANCE_TOOLS[String(args.platform)];
    }
    const forwardedArgs = alias ? alias.mapArguments(args) : args;
    if (alias) {
      const targetValidator = this.validators.get(target);
      if (!targetValidator) {
        throw new Error(`${name}: hosted target "${target}" is not available.`);
      }
      if (!targetValidator(forwardedArgs)) {
        throw new Error(`${name}: arguments are not supported by hosted target ${target}: ${formatValidationErrors(targetValidator.errors)}`);
      }
    }
    return this.rpc("tools/call", { name: target, arguments: forwardedArgs }, this.callTimeoutMs) as Promise<ToolResult>;
  }

  private async rpc(method: string, params: JsonObject, timeoutMs: number): Promise<JsonObject> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let response: Response;
    let text: string;
    try {
      response = await this.fetchImpl(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
          ...(this.apiKey ? { "X-Synter-Key": this.apiKey } : {}),
        },
        body: JSON.stringify({ jsonrpc: "2.0", id: ++this.requestId, method, params }),
        signal: controller.signal,
      });
      text = await response.text();
    } catch (error) {
      if (controller.signal.aborted) throw new Error(`Hosted MCP ${method} timed out after ${timeoutMs}ms.`);
      throw new Error(`Hosted MCP ${method} request failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      clearTimeout(timer);
    }

    let payload: RpcResponse;
    try {
      payload = parseRpcResponse(text);
    } catch {
      throw new Error(`Hosted MCP ${method} returned HTTP ${response.status} with a non-JSON response.`);
    }
    if (!response.ok) {
      const retryAfter = response.headers.get("retry-after");
      const detail = payload.error?.message || errorDetail(payload) || response.statusText || "request failed";
      throw new Error(`Hosted MCP ${method} failed (HTTP ${response.status}): ${detail}${retryAfter ? ` Retry after ${retryAfter}.` : ""}`);
    }
    if (payload.error) {
      const data = errorDetail(payload.error.data);
      throw new Error(`Hosted MCP ${method} error ${payload.error.code ?? "unknown"}: ${payload.error.message || data || "request failed"}`);
    }
    if (!payload.result || typeof payload.result !== "object") {
      throw new Error(`Hosted MCP ${method} returned no result.`);
    }
    return payload.result;
  }
}
