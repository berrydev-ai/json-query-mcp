# Test Data Files

This directory contains various JSON files with different structures and complexities to test the JSON MCP Server functionality.

## File Descriptions

### 1. `products.json`
- **Structure**: Array of product objects
- **Complexity**: Medium
- **Features**: Nested objects, arrays, multiple data types
- **Use cases**: E-commerce queries, filtering, sorting, aggregations
- **Sample queries**: 
  - "Find products under $50"
  - "Top 5 highest rated products"
  - "Products in electronics category"
  - "Average price by category"

### 2. `employees.json`
- **Structure**: Array of employee objects
- **Complexity**: High
- **Features**: Deeply nested objects, arrays, complex relationships
- **Use cases**: HR analytics, organizational queries, performance analysis
- **Sample queries**:
  - "Employees in Engineering department"
  - "Average salary by department"
  - "Active employees with projects"
  - "Performance ratings above 4.5"

### 3. `sales.json`
- **Structure**: Single object with nested regional data
- **Complexity**: High
- **Features**: Multi-level nesting, hierarchical data structure
- **Use cases**: Sales analytics, regional comparisons, revenue analysis
- **Sample queries**:
  - "Total revenue by region"
  - "Q4 performance across all regions"
  - "Top performing sales team members"
  - "Product revenue breakdown"

### 4. `simple-array.json`
- **Structure**: Simple array of strings
- **Complexity**: Low
- **Features**: Basic array structure
- **Use cases**: Basic querying, filtering, sorting
- **Sample queries**:
  - "All items"
  - "Items starting with 'a'"
  - "Count of items"
  - "Sort alphabetically"

### 5. `config.json`
- **Structure**: Single configuration object
- **Complexity**: Medium
- **Features**: Nested configuration sections, mixed data types
- **Use cases**: Configuration management, settings queries
- **Sample queries**:
  - "Database configuration"
  - "Security settings"
  - "Enabled features"
  - "Server port and host"

### 6. `nested-deep.json`
- **Structure**: Deeply nested organizational structure
- **Complexity**: Very High
- **Features**: 6+ levels of nesting, complex hierarchies
- **Use cases**: Complex nested queries, deep object traversal
- **Sample queries**:
  - "All team leads"
  - "Frontend team members"
  - "Performance metrics by region"
  - "Product authentication methods"

## Query Complexity Examples

### Simple Queries (Level 1)
- Count items
- Basic filtering
- Simple sorting

### Medium Queries (Level 2)
- Nested property access
- Aggregations (sum, average)
- Multi-field filtering

### Complex Queries (Level 3)
- Deep nested access
- Cross-object relationships
- Complex aggregations
- Pattern matching

### Advanced Queries (Level 4)
- Multi-file queries
- Complex analytical operations
- Data transformation
- Statistical analysis

## Usage in Testing

These files are designed to test various aspects of the JSON MCP Server:

1. **Array vs Object handling** - Different top-level structures
2. **Nesting depth** - From simple to very complex nesting
3. **Data types** - Strings, numbers, booleans, arrays, objects
4. **Size variations** - Small to medium-sized datasets
5. **Real-world scenarios** - Practical use cases for each file type

## Adding New Test Files

When adding new test files:
1. Include diverse data structures
2. Add corresponding documentation here
3. Consider edge cases and error scenarios
4. Include sample queries for testing
5. Vary complexity levels to test different features