#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { HostedMcpClient } from "./hosted-client.js";

const client = new HostedMcpClient({
  endpoint: process.env.SYNTER_MCP_URL || "https://mcp.syntermedia.ai/mcp/",
  apiKey: process.env.SYNTER_API_KEY,
});

async function main(): Promise<void> {
  if (!process.env.SYNTER_API_KEY) {
    throw new Error(
      "SYNTER_API_KEY is required for the stdio bridge. Use browser OAuth with https://mcp.syntermedia.ai/mcp/ instead, or create an API key at https://syntermedia.ai/developer.",
    );
  }
  const catalog = await client.listTools();
  const server = new Server(
    {
      name: "synter-ads",
      title: "Synter",
      version: "1.3.0",
      icons: [
        {
          src: "https://syntermedia.ai/brand/android-chrome-192x192.png",
          mimeType: "image/png",
          sizes: ["192x192"],
        },
      ],
    },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: await client.listTools(),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      return await client.callTool(
        request.params.name,
        (request.params.arguments || {}) as Record<string, unknown>,
      );
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  });

  await server.connect(new StdioServerTransport());
  console.error(`Synter MCP server running on stdio (${catalog.length} tools)`);
}

main().catch((error) => {
  console.error("Fatal error:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
