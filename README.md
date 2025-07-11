# JSON Query MCP

A Model Context Protocol (MCP) server that provides powerful JSON querying and schema generation capabilities. Built with the official TypeScript SDK for MCP servers and clients.

## What is this?

This MCP server allows you to query JSON files using JSONPath expressions and generate JSON schemas. It's designed to work with AI assistants like Claude to provide seamless JSON data analysis and manipulation capabilities.

## Why use this?

- **Seamless AI Integration**: Works directly with AI assistants through the Model Context Protocol
- **Powerful Querying**: Use JSONPath expressions to extract specific data from complex JSON structures
- **Schema Generation**: automatically generate JSON schemas from your data files
- **Flexible Configuration**: Support for default file paths to simplify repeated operations
- **Type Safety**: Built with TypeScript for robust error handling and type checking

## Features

- **JSONPath Querying**: Query JSON data using familiar JSONPath syntax (similar to jq)
- **Schema Generation**: Generate JSON schemas from existing JSON files
- **Default File Path**: Configure a default JSON file to avoid specifying paths repeatedly
- **Error Handling**: Comprehensive error messages for debugging
- **MCP Standard**: Built on the official Model Context Protocol specification

## Installation

```bash
npm install @berrydev-ai/json-query-mcp
```

## Usage

### Basic Usage

Start the server with a default JSON file:

```bash
npx json-query-mcp /path/to/your/data.json
```

Or start without a default file:

```bash
npx json-query-mcp
```

### Configuration with Claude Desktop

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "json-query": {
      "command": "npx",
      "args": ["@berrydev-ai/json-query-mcp", "/path/to/your/data.json"]
    }
  }
}
```

### Configuration without Default File

```json
{
  "mcpServers": {
    "json-query": {
      "command": "npx",
      "args": ["@berrydev-ai/json-query-mcp"]
    }
  }
}
```

## Available Tools

### query-json

Query JSON data using JSONPath expressions.

**Parameters:**
- `filePath` (optional): Path to JSON file. If not provided, uses the default path configured when starting the server.
- `query` (optional): JSONPath expression to execute. If empty, returns the entire JSON.

**Examples:**
```javascript
// Get all book titles
query: "$.store.book[*].title"

// Get books under $10
query: "$.store.book[?(@.price < 10)]"

// Get the first book
query: "$.store.book[0]"

// Get all manager names from divisions
query: "$.organization.divisions.*.manager.name"
```

### generate-schema

Generate a JSON schema from a JSON file.

**Parameters:**
- `filePath` (optional): Path to JSON file. If not provided, uses the default path configured when starting the server.

**Example Output:**
```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "number" },
    "active": { "type": "boolean" }
  },
  "required": ["name", "age"]
}
```

## JSONPath Syntax

This server supports standard JSONPath expressions:

| Expression | Description |
|------------|-------------|
| `$` | Root element |
| `@` | Current element |
| `.` or `[]` | Child operator |
| `..` | Recursive descent |
| `*` | Wildcard |
| `[n]` | Array index |
| `[start:end]` | Array slice |
| `[?()]` | Filter expression |

### Common JSONPath Examples

```javascript
// Basic property access
"$.name"                    // Get name property
"$.users[0].email"          // Get first user's email
"$.products[*].price"       // Get all product prices

// Array operations
"$.items[0,1]"              // Get first two items
"$.items[1:3]"              // Get items 1-2 (slice)
"$.items[-1]"               // Get last item

// Filtering
"$.products[?(@.price > 100)]"           // Products over $100
"$.users[?(@.active == true)]"           // Active users
"$.orders[?(@.status == 'pending')]"     // Pending orders

// Recursive search
"$..price"                  // All price properties anywhere
"$..book[?(@.isbn)]"        // All books with ISBN
```

## Default File Path Feature

When you start the server with a default file path, you can omit the `filePath` parameter from tool calls:

```bash
# Start with default file
npx json-query-mcp /data/products.json

# Now you can query without specifying the file path
# The tools will automatically use /data/products.json
```

This is particularly useful when:
- Working with a single JSON file repeatedly
- Integrating with AI assistants that make multiple queries
- Simplifying configuration for end users

## Error Handling

The server provides detailed error messages for common issues:

- **File not found**: When the specified JSON file doesn't exist
- **Invalid JSON**: When the file contains malformed JSON
- **Invalid JSONPath**: When the query expression is malformed
- **No path configured**: When no file path is provided and no default is set

## Development

### Building from Source

```bash
git clone https://github.com/berrydev-ai/json-mcp-server.git
cd json-mcp-server
npm install
npm run build
```

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Development Mode

```bash
npm run dev
```

## Requirements

- Node.js 18 or higher
- TypeScript 5.0 or higher

## Dependencies

- `@modelcontextprotocol/sdk`: Official MCP TypeScript SDK
- `jsonpath-plus`: JSONPath implementation
- `zod`: Schema validation
- `generate-json-schema`: JSON schema generation

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please file an issue on the [GitHub repository](https://github.com/berrydev-ai/json-mcp-server/issues).
