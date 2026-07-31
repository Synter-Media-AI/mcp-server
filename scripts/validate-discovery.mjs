import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const packageJson = readJson("package.json");
const serverJson = readJson("server.json");
const manifestJson = readJson("manifest.json");

invariant(
  serverJson.name === packageJson.mcpName,
  `server.json name ${serverJson.name} must match package.json mcpName ${packageJson.mcpName}`,
);

invariant(
  serverJson.version === packageJson.version,
  `server.json version ${serverJson.version} must match package.json version ${packageJson.version}`,
);

invariant(
  manifestJson.version === packageJson.version,
  `manifest.json version ${manifestJson.version} must match package.json version ${packageJson.version}`,
);

const npmPackage = serverJson.packages?.find(
  (pkg) => pkg.registryType === "npm" && pkg.identifier === packageJson.name,
);

invariant(npmPackage, `server.json must include npm package metadata for ${packageJson.name}`);
invariant(
  npmPackage.version === packageJson.version,
  `server.json npm package version ${npmPackage.version} must match package.json version ${packageJson.version}`,
);
invariant(
  npmPackage.transport?.type === "stdio",
  "server.json npm package transport must be stdio",
);
invariant(
  npmPackage.environmentVariables?.some((env) => env.name === "SYNTER_API_KEY" && env.isRequired),
  "server.json npm package must declare SYNTER_API_KEY as required",
);

const primaryRemote = serverJson.remotes?.find(
  (remote) => remote.type === "streamable-http" && remote.url === "https://mcp.syntermedia.ai/mcp/",
);

invariant(
  primaryRemote,
  "server.json must advertise the canonical hosted MCP endpoint https://mcp.syntermedia.ai/mcp/",
);

invariant(
  primaryRemote.headers?.some((header) => header.name === "X-Synter-Key" && header.isRequired),
  "server.json remote must document the required X-Synter-Key header",
);

const publicDocs = ["README.md", ".mcp.json"];

for (const relativePath of publicDocs) {
  const text = readText(relativePath);

  invariant(
    !text.includes('"command": "mcp-proxy"'),
    `${relativePath} still references the deprecated mcp-proxy Claude Desktop configuration`,
  );
}

invariant(
  readText("README.md").includes("https://mcp.syntermedia.ai/mcp/"),
  "README.md must document the canonical hosted MCP endpoint https://mcp.syntermedia.ai/mcp/",
);

console.log("Public Synter MCP discovery metadata is internally consistent.");
