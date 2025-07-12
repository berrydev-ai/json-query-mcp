## Deployment Guide

### Prerequisites
- GitHub CLI (`gh`) installed and authenticated
- NPM account with appropriate permissions
- Repository secrets configured:
  - `NPM_TOKEN`: NPM authentication token with publish permissions

### Release Process

1. **Create GitHub Release**
   ```bash
   gh release create v1.0.0 --title "v1.0.0" --notes-file CHANGELOG.md --latest
   ```

2. **Automatic NPM Publishing**
   The GitHub Action will automatically:
   - Install dependencies (`npm ci`)
   - Build the project (`npm run build`)
   - Run tests (`npm test`)
   - Run linter (`npm run lint`)
   - Publish to NPM with provenance (`npm publish --provenance`)

### Manual Deployment (if needed)

If you need to deploy manually:

```bash
# Build the project
npm run build

# Run quality checks
npm run lint
npm test

# Publish to NPM
npm publish --provenance
```

### Using the Published Package

After deployment, users can install and use the package:

```bash
# Install globally
npm install -g @berrydev-ai/json-query-mcp

# Or install locally
npm install @berrydev-ai/json-query-mcp
```

### MCP Server Usage

```bash
# Run as standalone server
json-query-mcp /path/to/your/data.json

# Or use with Node.js
node node_modules/@berrydev-ai/json-query-mcp/dist/index.js /path/to/data.json
```

### Integration with MCP Clients

Add to your MCP client configuration:

```json
{
  "servers": {
    "json-query": {
      "command": "json-query-mcp",
      "args": ["/path/to/your/data.json"]
    }
  }
}
```
