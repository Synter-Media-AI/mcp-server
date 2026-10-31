import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import * as readline from "node:readline";
import { AD_PLATFORM_COUNT } from "./platform-count.js";

const SYNTER_MCP_URL = "https://mcp.synterai.com";
const SOLO_CHECKOUT_URL =
  "https://synterai.com/sign-up?plan=developer&billing=monthly&source=mcp_installer";
const SCALE_CHECKOUT_URL =
  "https://synterai.com/sign-up?plan=synter&billing=monthly&source=mcp_installer";

interface ConfigTarget {
  name: string;
  scope: "workspace" | "global";
  getPath: () => string;
  format: (apiKey: string) => Record<string, unknown>;
  wrapperKey?: string;
}

const CONFIG_TARGETS: ConfigTarget[] = [
  {
    name: "Claude Code",
    scope: "workspace",
    getPath: () => path.join(process.cwd(), ".mcp.json"),
    format: (apiKey) => ({
      type: "http",
      url: SYNTER_MCP_URL,
      ...(apiKey ? { headers: { "X-Synter-Key": apiKey } } : {}),
    }),
  },
  {
    name: "Cursor (Workspace)",
    scope: "workspace",
    getPath: () => path.join(process.cwd(), ".cursor", "mcp.json"),
    format: (apiKey) => ({
      url: SYNTER_MCP_URL,
      ...(apiKey ? { headers: { "X-Synter-Key": apiKey } } : {}),
    }),
  },
  {
    name: "Google Antigravity",
    scope: "workspace",
    getPath: () => path.join(process.cwd(), ".agents", "mcp_config.json"),
    format: (apiKey) => ({
      serverUrl: SYNTER_MCP_URL,
      ...(apiKey ? { headers: { "X-Synter-Key": apiKey } } : {}),
    }),
  },
  {
    name: "Windsurf / Codeium",
    scope: "global",
    getPath: () =>
      path.join(os.homedir(), ".codeium", "windsurf", "mcp_config.json"),
    format: (apiKey) => ({
      serverUrl: SYNTER_MCP_URL,
      ...(apiKey ? { headers: { "X-Synter-Key": apiKey } } : {}),
    }),
  },
  {
    name: "VS Code Cline",
    scope: "global",
    getPath: () => {
      const isMac = process.platform === "darwin";
      const isWin = process.platform === "win32";
      if (isMac) {
        return path.join(
          os.homedir(),
          "Library",
          "Application Support",
          "Code",
          "User",
          "globalStorage",
          "saoudrizwan.claude-dev",
          "settings",
          "cline_mcp_settings.json",
        );
      }
      if (isWin) {
        return path.join(
          process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"),
          "Code",
          "User",
          "globalStorage",
          "saoudrizwan.claude-dev",
          "settings",
          "cline_mcp_settings.json",
        );
      }
      return path.join(
        os.homedir(),
        ".config",
        "Code",
        "User",
        "globalStorage",
        "saoudrizwan.claude-dev",
        "settings",
        "cline_mcp_settings.json",
      );
    },
    format: (apiKey) => ({
      url: SYNTER_MCP_URL,
      ...(apiKey ? { headers: { "X-Synter-Key": apiKey } } : {}),
    }),
  },
  {
    name: "Zed Editor",
    scope: "global",
    getPath: () => path.join(os.homedir(), ".config", "zed", "settings.json"),
    wrapperKey: "context_servers",
    format: (apiKey) => ({
      url: SYNTER_MCP_URL,
      ...(apiKey ? { headers: { "X-Synter-Key": apiKey } } : {}),
    }),
  },
];

function safeJsonParse(content: string): Record<string, any> {
  try {
    return JSON.parse(content);
  } catch {
    return {};
  }
}

function updateConfigFile(target: ConfigTarget, apiKey: string): boolean {
  const targetPath = target.getPath();
  const dir = path.dirname(targetPath);

  if (target.scope === "global" && !fs.existsSync(dir)) {
    return false;
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let config: Record<string, any> = {};
  if (fs.existsSync(targetPath)) {
    const raw = fs.readFileSync(targetPath, "utf-8");
    config = safeJsonParse(raw);
  }

  const key = target.wrapperKey || "mcpServers";
  if (!config[key] || typeof config[key] !== "object") {
    config[key] = {};
  }

  config[key].synter = target.format(apiKey);

  fs.writeFileSync(targetPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
  return true;
}

export async function runInstaller(): Promise<void> {
  console.log("\n=======================================================");
  console.log(`   Synter MCP Agent Installer (${AD_PLATFORM_COUNT} Ad Platforms)       `);
  console.log("=======================================================\n");

  const args = process.argv.slice(2);
  let apiKey = process.env.SYNTER_API_KEY || "";

  const keyIdx = args.findIndex(
    (arg) => arg === "--api-key" || arg.startsWith("--api-key="),
  );
  if (keyIdx !== -1) {
    const suppliedKey =
      args[keyIdx] === "--api-key"
        ? args[keyIdx + 1]
        : args[keyIdx].slice("--api-key=".length);
    if (!suppliedKey?.trim() || suppliedKey.startsWith("--")) {
      throw new Error(
        "--api-key requires a full key. Omit it to use native OAuth.",
      );
    }
    apiKey = suppliedKey;
  }

  const isNonInteractive =
    args.includes("--yes") ||
    args.includes("-y") ||
    args.includes("--non-interactive") ||
    process.env.CI === "true";

  if (!apiKey && process.stdin.isTTY && !isNonInteractive) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    apiKey = await new Promise<string>((resolve) => {
      rl.question(
        "Enter your Synter API Key (starts with syn_) [leave blank for native OAuth]: ",
        (ans) => {
          rl.close();
          resolve(ans.trim());
        },
      );
    });
  }

  // Match the hosted server's prefix/length floor and generated key alphabet.
  // Never write unresolved templates or truncated key prefixes into configs.
  if (
    apiKey &&
    (!apiKey.startsWith("syn_") ||
      apiKey.length < 20 ||
      /[^A-Za-z0-9_-]/.test(apiKey))
  ) {
    throw new Error(
      "Invalid Synter API key. Supply the full key, or unset SYNTER_API_KEY and omit --api-key to use native OAuth. No configuration files were changed.",
    );
  }

  console.log("\nDetecting and configuring AI coding editors...");
  let configuredCount = 0;

  for (const target of CONFIG_TARGETS) {
    try {
      const targetPath = target.getPath();
      const updated = updateConfigFile(target, apiKey);
      if (updated) {
        const displayPath =
          target.scope === "workspace"
            ? path.relative(process.cwd(), targetPath)
            : targetPath;
        console.log(`  [OK] ${target.name} -> ${displayPath}`);
        configuredCount++;
      }
    } catch (err: any) {
      console.warn(`  [!] Could not configure ${target.name}: ${err.message}`);
    }
  }

  console.log(`\nSuccessfully configured ${configuredCount} environment(s)!`);
  console.log("\nNext Steps:");
  console.log("  1. Restart your editor or agent session.");
  if (!apiKey) {
    console.log(
      "     Connect Synter in your editor's MCP settings and complete native OAuth sign-in.",
    );
  }
  console.log("  2. In your agent prompt, ask:");
  console.log(
    '     "Show 7-day spend and CPA across all connected ad accounts."',
  );
  console.log("  3. Self-serve plans for live campaign execution:");
  console.log(
    `     - Verified writes ($0.25 per verified write, 0% of ad spend): ${SOLO_CHECKOUT_URL}`,
  );
  console.log(
    `     - SCALE ($500/mo — $500.00 monthly credits): ${SCALE_CHECKOUT_URL}`,
  );
  console.log("  4. Documentation: https://docs.synterai.com/quickstart\n");
}
