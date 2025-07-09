# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a JSON MCP (Model Context Protocol) server that provides a RESTful API for querying and filtering JSON files stored in a local directory. The server is built using the official TypeScript SDK for Model Context Protocol servers and clients.

## Implementation Plan

### MCP Components
- **Resources**: `json-files`, `json-file://{filename}`, `json-schema://{filename}`
- **Tools**: `query-json`, `analyze-json`, `search-json`
- **Prompts**: `data-analysis`, `json-query-builder`

### Core Architecture
```
src/
├── index.ts          # Main server entry point
├── jsonManager.ts    # JSON file operations
├── queryProcessor.ts # Query execution engine
└── utils.ts         # Utility functions
```

### Development Commands
Once implemented, typical commands will include:
- `npm install` - Install dependencies including @modelcontextprotocol/sdk
- `npm run build` - Build TypeScript code
- `npm run dev` - Run server in development mode
- `npm test` - Run tests
- `npm run lint` - Run linting
- `npm start` - Start the MCP server

### Key Dependencies
- `@modelcontextprotocol/sdk` - MCP TypeScript SDK
- `zod` - Schema validation
- `typescript` - TypeScript compiler
- Node.js v18+ required

### Development Notes
- Server uses stdio transport by default for CLI integration
- Supports natural language queries converted to JSONPath
- Implements file system monitoring for dynamic resource updates
- Includes security measures for path traversal protection
- Query examples: "top 10 products", "average price by category"

## Build & Test Commands

```sh
npm run build        # Build ESM and CJS versions
npm run lint         # Run ESLint
npm test             # Run all tests
npx jest path/to/file.test.ts  # Run specific test file
npx jest -t "test name"        # Run tests matching pattern
```

## Code Style Guidelines

- **TypeScript**: Strict type checking, ES modules, explicit return types
- **Naming**: PascalCase for classes/types, camelCase for functions/variables
- **Files**: Lowercase with hyphens, test files with `.test.ts` suffix
- **Imports**: ES module style, include `.js` extension, group imports logically
- **Error Handling**: Use TypeScript's strict mode, explicit error checking in tests
- **Formatting**: 2-space indentation, semicolons required, single quotes preferred
- **Testing**: Co-locate tests with source files, use descriptive test names
- **Comments**: JSDoc for public APIs, inline comments for complex logic

## Project Structure

- `/src`: Source code with client, server, and shared modules
- Tests alongside source files with `.test.ts` suffix
- Node.js >= 18 required
