#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { loadJsonFile } from './jsonManager.js';
import { executeQuery } from './queryProcessor.js';

const QueryJsonArgsSchema = z.object({
  filePath: z.string(),
  query: z.string().optional().default(''),
});

class JsonMcpServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'json-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'json-file://products.json',
            name: 'Products JSON',
            description: 'Sample products data (test-data/products.json)',
            mimeType: 'application/json',
          },
          {
            uri: 'json-file://employees.json',
            name: 'Employees JSON',
            description: 'Sample employees data (test-data/employees.json)',
            mimeType: 'application/json',
          },
          {
            uri: 'json-file://sales.json',
            name: 'Sales JSON',
            description: 'Sample sales data (test-data/sales.json)',
            mimeType: 'application/json',
          },
          {
            uri: 'json-file://simple-array.json',
            name: 'Simple Array JSON',
            description: 'Simple array data (test-data/simple-array.json)',
            mimeType: 'application/json',
          },
          {
            uri: 'json-file://config.json',
            name: 'Config JSON',
            description: 'Configuration data (test-data/config.json)',
            mimeType: 'application/json',
          },
          {
            uri: 'json-file://nested-deep.json',
            name: 'Nested Deep JSON',
            description: 'Deep nested structure data (test-data/nested-deep.json)',
            mimeType: 'application/json',
          },
        ],
      };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      
      if (!uri.startsWith('json-file://')) {
        throw new McpError(ErrorCode.InvalidRequest, `Unsupported URI: ${uri}`);
      }

      const filePath = uri.replace('json-file://', '');
      
      try {
        const data = await loadJsonFile(filePath);
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to load JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });

    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'query-json',
            description: 'Query JSON data with filters, sorting, and basic operations',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: {
                  type: 'string',
                  description: 'Path to the JSON file to query (can be absolute or relative)',
                },
                query: {
                  type: 'string',
                  description: 'Query string (e.g., "filter by category = electronics", "sort by price desc")',
                },
              },
              required: ['filePath'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (name === 'query-json') {
        const parsed = QueryJsonArgsSchema.parse(args);
        const { filePath, query } = parsed;

        try {
          const data = await loadJsonFile(filePath);
          const results = executeQuery(data, query);
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(results, null, 2),
              },
            ],
          };
        } catch (error) {
          throw new McpError(
            ErrorCode.InternalError,
            `Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }

      throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${name}`);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('JSON MCP Server running on stdio');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new JsonMcpServer();
  server.run().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}