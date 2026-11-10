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

for (const relativePath of ["plugin.json", ".claude-plugin/plugin.json"]) {
  invariant(
    readJson(relativePath).version === packageJson.version,
    `${relativePath} version must match package.json version ${packageJson.version}`,
  );
}

const packageLock = readJson("package-lock.json");
invariant(
  packageLock.version === packageJson.version && packageLock.packages?.[""]?.version === packageJson.version,
  "package-lock.json package versions must match package.json",
);

invariant(
  serverJson.name === packageJson.mcpName,
  `server.json name ${serverJson.name} must match package.json mcpName ${packageJson.mcpName}`,
);

invariant(
  serverJson.version === packageJson.version,
  `server.json version ${serverJson.version} must match package.json version ${packageJson.version}`,
);

const LEAD =
  "Open-source MCP server for running ads with AI agents across 43 ad platforms (16 in local stdio): free reads ($0.00/mo), $20/mo Solo ($20/mo usage value included; $0.05-$0.25 writes), 0% of ad spend.";

invariant(
  serverJson.description === LEAD,
  `server.json description must match canonical registry description, got: ${JSON.stringify(serverJson.description)}`,
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

const CANONICAL_REMOTE = "https://mcp.synterai.com";

const primaryRemote = serverJson.remotes?.find(
  (remote) => remote.type === "streamable-http" && remote.url === CANONICAL_REMOTE,
);

invariant(
  primaryRemote,
  `server.json must advertise the canonical hosted MCP endpoint ${CANONICAL_REMOTE}`,
);

invariant(
  !(primaryRemote.headers ?? []).some((header) => header.name === "X-Synter-Key"),
  "server.json remote must not advertise an X-Synter-Key header (hosted auth is OAuth)",
);
invariant(serverJson.status !== "deprecated", "server.json must not be deprecated");

const geminiExtension = readJson("gemini-extension.json");

invariant(
  geminiExtension.version === packageJson.version,
  `gemini-extension.json version ${geminiExtension.version} must match package.json version ${packageJson.version}`,
);
invariant(
  geminiExtension.mcpServers?.["synter-ads"]?.httpUrl === CANONICAL_REMOTE,
  `gemini-extension.json must point mcpServers.synter-ads.httpUrl at ${CANONICAL_REMOTE}`,
);

const publicDocs = ["README.md", ".mcp.json"];

for (const relativePath of publicDocs) {
  const text = readText(relativePath);

  invariant(
    !text.includes('"command": "mcp-proxy"'),
    `${relativePath} still references the deprecated mcp-proxy Claude Desktop configuration`,
  );
}

const readme = readText("README.md");

invariant(
  serverJson.websiteUrl === "https://synterai.com/mcp",
  "server.json websiteUrl must point to https://synterai.com/mcp",
);

invariant(
  readme.includes(CANONICAL_REMOTE),
  `README.md must document the canonical hosted MCP endpoint ${CANONICAL_REMOTE}`,
);
const discoveryManifests = [
  "server.json", "package.json", "manifest.json", "plugin.json",
  ".claude-plugin/plugin.json", "gemini-extension.json", "glama.json", "smithery.yaml",
];
for (const relativePath of discoveryManifests) {
  const text = readText(relativePath);
  invariant(
    text.includes(LEAD),
    `${relativePath} must include canonical LEAD`,
  );
}

invariant(
  readme.includes(LEAD),
  "README.md must include canonical LEAD",
);

invariant(
  packageJson.description === LEAD,
  `package.json description must match canonical LEAD, got: ${JSON.stringify(packageJson.description)}`,
);
invariant(
  packageJson.keywords.includes("ad-reporting") &&
    packageJson.keywords.includes("roas") &&
    packageJson.keywords.includes("marketing-analytics"),
  "package.json keywords must include ad-reporting, roas, marketing-analytics",
);

const allMetadataFiles = [...discoveryManifests, "AGENTS.md", "llms.txt", "GEMINI.md", "skills/synter-ads/SKILL.md"];
for (const relativePath of allMetadataFiles) {
  const text = readText(relativePath);
  const match = text.match(/\b(14|19|21|30\+)\s+(ad(vertising)?\s+)?platforms\b/i);
  invariant(!match, `${relativePath} has a stale platform count (${match?.[0]})`);
  invariant(
    !text.includes("syntermedia.ai"),
    `${relativePath} must not reference syntermedia.ai; use synterai.com`,
  );
  invariant(
    !text.includes("1.4.7") && !text.includes("1.5.0"),
    `${relativePath} must match published npm version ${packageJson.version} (found stale 1.4.7 or 1.5.0)`,
  );
}

const SERVER_JSON_MAX_LENGTHS = {
  name: 200,
  title: 100,
  version: 255,
};

for (const [field, max] of Object.entries(SERVER_JSON_MAX_LENGTHS)) {
  const value = serverJson[field];
  if (typeof value !== "string") continue;
  invariant(
    value.length <= max,
    `server.json ${field} is ${value.length} characters; the registry schema caps it at ${max}. Value: ${JSON.stringify(value)}`,
  );
}

for (const icon of serverJson.icons ?? []) {
  invariant(
    typeof icon.src !== "string" || icon.src.length <= 255,
    `server.json icon src is ${icon.src.length} characters; the registry schema caps it at 255`,
  );
}

{
  const repoUrl = serverJson.repository?.url ?? "";
  const match = repoUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/);
  invariant(
    match,
    `server.json repository.url must be a https://github.com/<owner>/<repo> URL; got ${JSON.stringify(repoUrl)}`,
  );
  const owner = match[1];
  const expectedNamespace = `io.github.${owner}`;
  const actualNamespace = serverJson.name.split("/")[0];
  invariant(
    actualNamespace === expectedNamespace,
    `server.json name namespace is ${actualNamespace} but the GitHub owner in repository.url is ${owner}, ` +
      `so the registry will only authorize ${expectedNamespace}/*.`,
  );
}

invariant(
  packageJson.mcpName === serverJson.name,
  `package.json mcpName ${packageJson.mcpName} must equal server.json name ${serverJson.name}`,
);

console.log("Public Synter MCP discovery metadata is internally consistent.");
