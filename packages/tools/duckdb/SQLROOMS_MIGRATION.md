# SQLRooms DuckDB Integration

This document explains the migration to using `@sqlrooms/duckdb` for DuckDB management in the OpenAssistant project.

## Overview

The implementation in `query.ts` has been updated to use the [SQLRooms DuckDB package](https://github.com/sqlrooms/sqlrooms) instead of manually managing DuckDB-WASM. This provides several advantages:

- **Better Query Management**: Built-in query cancellation with AbortController support
- **Advanced Features**: Query deduplication, timeout support, and composable cancellation
- **Type Safety**: Full TypeScript support with typed query results
- **Simplified API**: Cleaner interface for common operations
- **Better Documentation**: Comprehensive API documentation from SQLRooms

## Key Changes

### 1. Connector Creation

**Before:**
```typescript
const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
const worker_url = URL.createObjectURL(/* ... */);
const worker = new Worker(worker_url);
const logger = new duckdb.ConsoleLogger();
db = new duckdb.AsyncDuckDB(logger, worker);
await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
```

**After:**
```typescript
import { createWasmDuckDbConnector } from '@sqlrooms/duckdb';

const connector = createWasmDuckDbConnector({
  path: ':memory:',
  logging: false,
  // Note: Extensions are now loaded on-demand by specific tools
  // (e.g., overture-tool loads httpfs and spatial extensions when needed)
});

await connector.initialize();
```

### 2. Query Execution

**Before:**
```typescript
const conn = await db.connect();
const result = await conn.query('SELECT * FROM table');
await conn.close();
```

**After:**
```typescript
import { getConnector } from '@openassistant/duckdb';

const connector = await getConnector();
const result = await connector.query('SELECT * FROM table');
// No need to manually close - handled automatically
```

### 3. Query Cancellation (New Feature)

```typescript
import { getConnector } from '@openassistant/duckdb';

// Option 1: Using the query handle
const connector = await getConnector();
const handle = connector.query('SELECT * FROM large_table');

// Cancel after 5 seconds
setTimeout(() => handle.cancel(), 5000);

try {
  const result = await handle;
  console.log('Query completed');
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Query was cancelled');
  }
}

// Option 2: Using AbortController for coordinated cancellation
const controller = new AbortController();
const query1 = connector.query('SELECT * FROM table1', { signal: controller.signal });
const query2 = connector.query('SELECT * FROM table2', { signal: controller.signal });

// Cancel both queries at once
controller.abort();
```

## New Utility Functions

We've added several utility functions in `connector-utils.ts` to make common operations easier:

### Query with Timeout

```typescript
import { queryWithTimeout } from '@openassistant/duckdb';

try {
  const result = await queryWithTimeout(
    'SELECT * FROM huge_table', 
    10000 // 10 second timeout
  );
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Query timed out');
  }
}
```

### Multiple Queries with Coordinated Cancellation

```typescript
import { executeMultipleQueries } from '@openassistant/duckdb';

const controller = new AbortController();
const results = await executeMultipleQueries([
  'SELECT * FROM table1',
  'SELECT * FROM table2',
  'SELECT * FROM table3'
], controller.signal);

// Cancel all queries at once if needed
controller.abort();
```

### Load Data from Various Sources

```typescript
import { loadDataToTable } from '@openassistant/duckdb';

// Load from a CSV file
await loadDataToTable(csvFile, 'my_table');

// Load from JavaScript objects
const data = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];
await loadDataToTable(data, 'users');
```

### Query to JSON

```typescript
import { queryToJson } from '@openassistant/duckdb';

const users = await queryToJson('SELECT * FROM users LIMIT 10');
for (const user of users) {
  console.log(user.name, user.email);
}
```

## Advanced Features

### Composable Cancellation

Combine multiple cancellation sources:

```typescript
function combineSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  signals.forEach(signal => {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', () => controller.abort());
  });
  return controller.signal;
}

const userCancellation = userController.signal;
const timeoutSignal = timeoutController.signal;
const combinedSignal = combineSignals(userCancellation, timeoutSignal);

const handle = connector.query('SELECT * FROM table', { signal: combinedSignal });
```

### Direct Connector Access

For advanced use cases, you can access the raw connector:

```typescript
import { getRawConnector } from '@openassistant/duckdb';

const connector = await getRawConnector();

// Access all SQLRooms connector methods:
// - connector.query(sql, options)
// - connector.queryJson(sql, options)
// - connector.execute(sql, options)
// - connector.loadFile(file, tableName, options)
// - connector.loadArrow(table, tableName, options)
// - connector.loadObjects(data, tableName, options)
```

## Backward Compatibility

The changes maintain backward compatibility with existing code:

- `getDuckDB()` still works and returns the underlying AsyncDuckDB instance
- `initDuckDB()` still works and initializes the connector
- All existing tools (`localQuery`, etc.) continue to work without changes

## Benefits

1. **Query Cancellation**: Built-in support for cancelling long-running queries
2. **Query Deduplication**: Automatic deduplication of identical queries (when using SQLRooms store features)
3. **Better Error Handling**: More consistent error handling with AbortError for cancellations
4. **Type Safety**: Full TypeScript support with proper types
5. **Modern API**: Promise-like QueryHandle interface
6. **Flexibility**: Can use simple API or advanced features as needed
7. **Integration**: Works seamlessly with other Web APIs that use AbortSignal

## Migration Guide

If you're using the DuckDB tools directly:

### No Changes Required

If you're just using the tools (like `localQuery`), no changes are needed. Everything works as before.

### If You're Using `getDuckDB()` Directly

The API remains the same, but you now have access to additional connector features:

```typescript
// Old way (still works)
import { getDuckDB } from '@openassistant/duckdb';
const db = await getDuckDB();
const conn = await db.connect();
const result = await conn.query('SELECT * FROM table');
await conn.close();

// New way (recommended)
import { getConnector } from '@openassistant/duckdb';
const connector = await getConnector();
const result = await connector.query('SELECT * FROM table');
// Automatically handled, no need to close
```

## References

- [SQLRooms Documentation](https://sqlrooms.org)
- [SQLRooms DuckDB Package](https://github.com/sqlrooms/sqlrooms/blob/main/packages/duckdb/README.md)
- [Query Cancellation Guide](https://sqlrooms.org/query-cancellation)

## Dependencies

The migration adds the following dependencies:

- `@sqlrooms/duckdb`: ^0.24.27
- `zustand`: ^5.0.2 (peer dependency)

These are automatically installed when you run `yarn install`.

