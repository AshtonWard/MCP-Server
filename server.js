import { Server } from '@modelcontextprotocol/server';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new Server({
  tools: tools.map(tool => ({
    name: tool.name,
    description: tool.description || "",
    inputSchema: tool.schema,
    handler: tool.handler
  }))
});

// Dynamically load all tools from /tools
const toolsDir = path.join(__dirname, "tools");
const toolFiles = fs.readdirSync(toolsDir);

for (const file of toolFiles) {
  const toolPath = path.join(toolsDir, file);
  const toolModule = await import(toolPath);

  if (!toolModule.default) continue;

  const tool = toolModule.default;

  // Register tool
  server.setTool(tool.name, tool.schema, tool.handler);
}

server.connect(new StdioServerTransport());
console.log("MCP server running...");
