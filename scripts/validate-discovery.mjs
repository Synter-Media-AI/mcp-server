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

// Registry schema limits on server.json. These were checked nowhere until a
// publish attempt on 2026-08-04 was rejected with
//   422 body.description: expected length <= 100
// after every internal-consistency check above had passed. The registry is the
// wrong place to discover this: a rejected publish burns a CI run, and the
// operator has to read an HTTP error to learn a field is too long. Worse, a
// version cannot be un-published, so anything that DOES get through is
// permanent.
//
// Mirrored from static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json
// (definitions.ServerDetail). Hardcoded rather than fetched so this stays
// offline-runnable and deterministic; if the registry relaxes a limit, the worst
// case is that we are stricter than required.
const SERVER_JSON_MAX_LENGTHS = {
  name: 200,
  description: 100,
  title: 100,
  version: 255,
};

for (const [field, max] of Object.entries(SERVER_JSON_MAX_LENGTHS)) {
  const value = serverJson[field];
  if (typeof value !== "string") continue; // absent optional fields are fine
  invariant(
    value.length <= max,
    `server.json ${field} is ${value.length} characters; the registry schema caps it at ${max}. ` +
      `The registry rejects the publish with a 422, so this must be fixed here. Value: ${JSON.stringify(value)}`,
  );
}

for (const icon of serverJson.icons ?? []) {
  invariant(
    typeof icon.src !== "string" || icon.src.length <= 255,
    `server.json icon src is ${icon.src.length} characters; the registry schema caps it at 255`,
  );
}

// The io.github.* namespace must match the GitHub owner EXACTLY, including case.
//
// Learned from a 403 on run 30937139623, after the description fix had cleared
// every other check:
//
//   You have permission to publish: io.github.Synter-Media-AI/*
//   Attempting to publish: io.github.synter-media-ai/synter-ads
//
// Namespace authorization is derived from the org that owns the OIDC token and is
// case-sensitive, so the lowercase reverse-DNS form most examples use is simply
// wrong for an org whose name carries capitals. Nothing local caught it, so the
// only way to find out was to burn a publish run.
//
// Derived from repository.url rather than hardcoded, so renaming the org cannot
// leave a stale literal behind.
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
      `so the registry will only authorize ${expectedNamespace}/*. This is CASE-SENSITIVE — a lowercased ` +
      `namespace is rejected with 403 even though the schema pattern permits it.`,
  );
}

// The registry proves npm ownership by comparing the PUBLISHED package's mcpName
// against server.json's name, so these two must agree before a publish is even
// worth attempting. (They can still both be right here and disagree with what is
// live on npm — see PUBLISHING.md for why npm must ship first.)
invariant(
  packageJson.mcpName === serverJson.name,
  `package.json mcpName ${packageJson.mcpName} must equal server.json name ${serverJson.name}`,
);

console.log("Public Synter MCP discovery metadata is internally consistent.");
