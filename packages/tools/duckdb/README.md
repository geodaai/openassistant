# @openassistant/duckdb

This package provides several tools for querying your data using DuckDB in browser.

> **New**: Now powered by [SQLRooms DuckDB](https://github.com/sqlrooms/sqlrooms) for enhanced query management, cancellation support, and better performance. See [SQLROOMS_MIGRATION.md](./SQLROOMS_MIGRATION.md) for details.

## Features

| Tool Name                                       | Description                                                                  |
| ----------------------------------------------- | ---------------------------------------------------------------------------- |
| [localQuery](/docs/duckdb/variables/localQuery) | Query any data that has been loaded in your application using user's prompt. |
| [mergeTables](/docs/duckdb/variables/mergeTables) | Merge multiple tables into one table.                                        |

### Advanced Features (via SQLRooms)

- **Query Cancellation**: Cancel long-running queries with AbortController
- **Query Timeout**: Automatically timeout queries after a specified duration
- **Coordinated Cancellation**: Cancel multiple queries together
- **Type Safety**: Full TypeScript support with typed query results
- **Modern API**: Promise-like QueryHandle interface

## Installation

```bash
npm install @openassistant/duckdb @openassistant/utils ai
```

## Quick Start

Suppose you have a dataset in your application, the data could be loaded from a csv/json/parquet/xml file. For this example, we will use the `SAMPLE_DATASETS` in `dataset.ts` to simulate the data.

```ts
export const SAMPLE_DATASETS = {
  myVenues: [
    {
      index: 0,
      location: 'New York',
      latitude: 40.7128,
      longitude: -74.006,
      revenue: 12500000,
      population: 8400000,
    },
    ...
  ],
};
```

Share the meta data of your dataset in the system prompt, so the LLM can understand which datasets are available to use when creating a map.

:::note
The meta data is good enough for the AI assistant. Don't put the entire dataset in the context, and there is no need to share your dataset with the LLM models. This also helps to keep your dataset private.
:::

```js
const systemPrompt = `You can help users to create a map from a dataset.
Please always confirm the function calling and its arguments with the user.

Here is the dataset are available for function calling:
DatasetName: myVenues
Fields: location, longitude, latitude, revenue, population`;
```

### localQuery Tool

```typescript
import { localQuery, LocalQueryTool } from '@openassistent/duckdb';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const localQueryTool: LocalQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues: (datasetName: string, variableName: string) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
};

generateText({
  model: openai('gpt-4.1', { apiKey: key }),
  system: systemPrompt,
  prompt: 'what is the average revenue of the venues in dataset myVenues?',
  tools: {
    localQuery: convertToVercelAiTool(localQueryTool),
  },
});
```

:::note
The `localQuery` tool is not executable on server side since it requires rendering the table on the client side (in the browser). You need to use it on client, e.g.:
:::

- `app/api/chat/route.ts`

```typescript
import { localQuery } from '@openassistant/duckdb';
import { convertToVercelAiTool } from '@openassistent/utils';
import { streamText } from 'ai';

// localQuery tool will be running on the client side
const localQueryTool = convertToVercelAiTool(localQuery, {
  isExecutable: false,
});

export async function POST(req: Request) {
  // ...
  const result = streamText({
    model: openai('gpt-4.1'),
    system: systemPrompt,
    messages: messages,
    tools: { localQuery: localQueryTool },
  });
}
```

- `app/page.tsx`

```typescript
import { useChat } from 'ai/react';
import { localQuery } from '@openassistant/duckdb';
import { convertToVercelAiTool } from '@openassistent/utils';

const myLocalQuery: LocalQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues: async (datasetName: string, variableName: string) => {
      // get the values of the variable from your dataset, e.g.
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
};

const localQueryTool = convertToVercelAiTool(myLocalQuery);

const { messages, input, handleInputChange, handleSubmit } = useChat({
  maxSteps: 20,
  onToolCall: async (toolCall) => {
    if (toolCall.name === 'localQuery') {
      const result = await localQueryTool.execute(
        toolCall.args,
        toolCall.options
      );
      return result;
    }
  },
});
```

## Advanced Usage with SQLRooms

### Query Cancellation

Cancel long-running queries using AbortController:

```typescript
import { getConnector } from '@openassistant/duckdb';

const connector = await getConnector();
const controller = new AbortController();

// Start a query with cancellation support
const queryHandle = connector.query('SELECT * FROM large_table', {
  signal: controller.signal,
});

// Cancel the query after 5 seconds
setTimeout(() => controller.abort(), 5000);

try {
  const result = await queryHandle;
  console.log('Query completed successfully');
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Query was cancelled');
  }
}
```

### Query with Timeout

Use the built-in timeout utility:

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

### Load Data

Load data from files or JavaScript objects:

```typescript
import { loadDataToTable } from '@openassistant/duckdb';

// Load from a CSV file
await loadDataToTable(csvFile, 'my_table');

// Load from JavaScript objects
const data = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];
await loadDataToTable(data, 'users');
```

### Query to JSON

Execute queries and get results as JSON:

```typescript
import { queryToJson } from '@openassistant/duckdb';

const users = await queryToJson('SELECT * FROM users LIMIT 10');
for (const user of users) {
  console.log(`${user.name}: ${user.email}`);
}
```

For more advanced usage examples and migration guide, see [SQLROOMS_MIGRATION.md](./SQLROOMS_MIGRATION.md).

## References

- [SQLRooms Documentation](https://sqlrooms.org)
- [SQLRooms DuckDB Package](https://github.com/sqlrooms/sqlrooms/blob/main/packages/duckdb/README.md)
- [Query Cancellation Guide](https://sqlrooms.org/query-cancellation)
