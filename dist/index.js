#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ErrorCode, ListResourcesRequestSchema, ListToolsRequestSchema, McpError, ReadResourceRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const generateJsonSchema = require("generate-json-schema");
import { loadJsonFile } from "./jsonManager.js";
import { executeQuery } from "./queryProcessor.js";
const QueryJsonArgsSchema = z.object({
    filePath: z.string().optional(),
    query: z.string().optional().default(""),
});
const GenerateSchemaArgsSchema = z.object({
    filePath: z.string().optional(),
});
class JsonQueryMCP {
    server;
    defaultFilePath;
    constructor(defaultFilePath) {
        this.defaultFilePath = defaultFilePath;
        this.server = new Server({
            name: "@berrydev-ai/json-query-mcp",
            version: "1.0.0",
        }, {
            capabilities: {
                resources: {},
                tools: {},
            },
        });
        this.setupHandlers();
    }
    async getDefaultFileSchema() {
        if (!this.defaultFilePath) {
            return null;
        }
        try {
            const data = await loadJsonFile(this.defaultFilePath);
            return generateJsonSchema(data);
        }
        catch (error) {
            console.error(`Failed to generate schema for default file: ${error}`);
            return null;
        }
    }
    setupHandlers() {
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
            return {
                resources: [],
            };
        });
        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
            const { uri } = request.params;
            if (!uri.startsWith("json-file://")) {
                throw new McpError(ErrorCode.InvalidRequest, `Unsupported URI: ${uri}`);
            }
            const filePath = uri.replace("json-file://", "");
            try {
                const data = await loadJsonFile(filePath);
                return {
                    contents: [
                        {
                            uri,
                            mimeType: "application/json",
                            text: JSON.stringify(data, null, 2),
                        },
                    ],
                };
            }
            catch (error) {
                throw new McpError(ErrorCode.InternalError, `Failed to load JSON file: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        });
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            const defaultFileSchema = await this.getDefaultFileSchema();
            let queryDescription = "Query JSON data using JSONPath expressions (similar to jq)";
            if (this.defaultFilePath && defaultFileSchema) {
                queryDescription += `\n\nDefault file: ${this.defaultFilePath}\nData structure schema:\n${JSON.stringify(defaultFileSchema, null, 2)}`;
            }
            return {
                tools: [
                    {
                        name: "query-json",
                        description: queryDescription,
                        inputSchema: {
                            type: "object",
                            properties: {
                                filePath: {
                                    type: "string",
                                    description: "Path to the JSON file to query (can be absolute or relative). If not provided, uses the default path configured for the server.",
                                },
                                query: {
                                    type: "string",
                                    description: 'JSONPath expression (e.g., "$.store.book[*].title", "$.organization.divisions.*.manager.name")',
                                },
                            },
                            required: [],
                        },
                    },
                    {
                        name: "generate-schema",
                        description: "Generate JSON Schema from a JSON file",
                        inputSchema: {
                            type: "object",
                            properties: {
                                filePath: {
                                    type: "string",
                                    description: "Path to the JSON file to generate schema for (can be absolute or relative). If not provided, uses the default path configured for the server.",
                                },
                            },
                            required: [],
                        },
                    },
                ],
            };
        });
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            if (name === "query-json") {
                const parsed = QueryJsonArgsSchema.parse(args);
                const { filePath, query } = parsed;
                const actualFilePath = filePath || this.defaultFilePath;
                if (!actualFilePath) {
                    throw new McpError(ErrorCode.InvalidRequest, "No file path provided and no default path configured");
                }
                try {
                    const data = await loadJsonFile(actualFilePath);
                    const results = executeQuery(data, query);
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(results, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    throw new McpError(ErrorCode.InternalError, `Query failed: ${error instanceof Error ? error.message : "Unknown error"}`);
                }
            }
            if (name === "generate-schema") {
                const parsed = GenerateSchemaArgsSchema.parse(args);
                const { filePath } = parsed;
                const actualFilePath = filePath || this.defaultFilePath;
                if (!actualFilePath) {
                    throw new McpError(ErrorCode.InvalidRequest, "No file path provided and no default path configured");
                }
                try {
                    const data = await loadJsonFile(actualFilePath);
                    const schema = generateJsonSchema(data);
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(schema, null, 2),
                            },
                        ],
                    };
                }
                catch (error) {
                    throw new McpError(ErrorCode.InternalError, `Schema generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
                }
            }
            throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${name}`);
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error(`JSON Query MCP Server running on stdio (PID: ${process.pid})`);
    }
}
if (import.meta.url === `file://${process.argv[1]}`) {
    const defaultFilePath = process.argv[2];
    const server = new JsonQueryMCP(defaultFilePath);
    server.run().catch((error) => {
        console.error("Server error:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map