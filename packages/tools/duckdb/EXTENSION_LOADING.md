# Extension Loading Pattern

## Overview

DuckDB extensions are now loaded on-demand by tools that need them, rather than globally at initialization. This provides faster startup times and better resource management.

## Pattern

### 1. Core Initialization (query.ts)

The core DuckDB initialization is kept minimal with no extensions:

```typescript
connector = createWasmDuckDbConnector({
  path: ':memory:',
  logging: false,
  // No extensions loaded here
});
```

### 2. Tool-Specific Extensions

Tools that need specific extensions load them on first use:

```typescript
/**
 * Track if extensions have been initialized for this tool
 */
let extensionsInitialized = false;

/**
 * Initialize tool-specific DuckDB extensions
 * This only runs once per DuckDB instance
 */
async function ensureExtensions(db: AsyncDuckDB): Promise<void> {
  if (extensionsInitialized) {
    return;
  }

  const conn = await db.connect();
  try {
    await conn.query(`
      INSTALL my_extension;
      LOAD my_extension;
      SET my_setting='value';
    `);
    extensionsInitialized = true;
  } finally {
    await conn.close();
  }
}

// In your tool's execute function
async function executeMyTool(args, options) {
  const db = await getDuckDB();
  await ensureExtensions(db); // Load extensions on first use
  
  // Now execute your queries
  const conn = await db.connect();
  // ...
}
```

## Example: Overture Tool

See `overture-tool.ts` for a complete example:

1. Defines `ensureOvertureExtensions()` function
2. Loads httpfs and spatial extensions
3. Configures S3 settings
4. Only runs once (tracked by `overtureExtensionsInitialized` flag)
5. Called at the start of `executeOvertureQuery()`

## Benefits

1. **Faster Startup**: Only load what you need
2. **Memory Efficient**: Extensions consume resources only when used
3. **Separation of Concerns**: Each tool manages its own dependencies
4. **Maintainable**: Easy to add/remove tool-specific extensions
5. **No Conflicts**: Tools don't interfere with each other's extensions

## Common Extensions

### httpfs
Used for reading files from HTTP/S3:
```sql
INSTALL httpfs;
LOAD httpfs;
SET s3_region='us-west-2';
```

### spatial
Used for geospatial data:
```sql
INSTALL spatial;
LOAD spatial;
```

### parquet
Usually built-in, but can be explicitly loaded:
```sql
INSTALL parquet;
LOAD parquet;
```

### json
Usually built-in for JSON operations:
```sql
INSTALL json;
LOAD json;
```

## Best Practices

1. **Single Initialization**: Use a flag to ensure extensions load only once
2. **Error Handling**: Wrap extension loading in try/finally blocks
3. **Close Connections**: Always close connections after loading extensions
4. **Documentation**: Document which extensions your tool requires
5. **Testing**: Test your tool with a fresh DuckDB instance to ensure extensions load correctly

## Migration from Global Extensions

If you previously relied on globally-loaded extensions:

**Before:**
```typescript
// Extensions were loaded in query.ts initialization
const result = await conn.query('SELECT ST_Distance(...)'); // spatial functions worked
```

**After:**
```typescript
// Load extensions in your tool
await ensureSpatialExtensions(db);
const result = await conn.query('SELECT ST_Distance(...)'); // Now works
```

## References

- [DuckDB Extensions](https://duckdb.org/docs/extensions/overview.html)
- [Overture Tool Example](./src/overture-tool.ts)

