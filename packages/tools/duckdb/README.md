# @openassistant/duckdb

This package provides several tools for querying your data using DuckDB in browser.

**localQuery**

This tool helps to query any data that has been loaded in your application using user's prompt.

- the data in your application will be loaded into a local duckdb instance temporarily
- LLM will generate SQL query based on user's prompt against the data
- the SQL query result will be executed in the local duckdb instance
- the query result will be displayed in a React table component

**dbQuery**

If you have a database that you want to query, you can use the `dbQueryTool`.

- the database will be connected to the local duckdb instance
- LLM will generate SQL query based on user's prompt
- the SQL query result will be executed in your database
- the query result will be displayed in a React table component

This example project shows how to use the `localQuery` and `dbQuery` tools in a multi-step tool.

## multiStepTool

This example project shows how to use the `localQuery` and `dbQuery` tools in a multi-step tool.

### localQuery Example

#### Data

In your application, the data could be loaded from a csv/json/parquet/xml file. For this example, we will use the `SAMPLE_DATASETS` in `dataset.ts` to simulate the data.

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

#### Tool

- Import the `localQuery` tool from `@openassistent/duckdb` and use it in your application.
- Provide the `getValues` function in the `context` to get the values from your data.

```ts
import { localQuery } from '@openassistent/duckdb';

const localQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues: (datasetName: string, variableName: string) => {
      return SAMPLE_DATASETS[datasetName][variableName];
    },
  },
};
```

#### Use the tool in your AI assistant UI

```tsx
<AiAssistant
  name="My Assistant"
  apiKey={process.env.OPENAI_TOKEN || ''}
  version="v1"
  modelProvider="openai"
  model="gpt-4o"
  welcomeMessage="Hello, how can I help you today?"
  instructions="You are a duckDB expert. You can help users to query their data using duckdb. Explain the steps you are taking to solve the user's problem."
  functions={{localQuery: localQueryTool}}
  useMarkdown={true}
/>
```

## Type Definitions

For TypeScript users, this package provides comprehensive type definitions:

### LocalQueryTool

The main type for the localQuery tool:

```typescript
import { LocalQueryTool } from '@openassistant/duckdb';

// Create a type-safe localQuery tool instance
const typedLocalQueryTool: LocalQueryTool = {
  ...localQuery,
  context: {
    // ...configuration
  }
};
```

### LocalQueryParameters

Input parameters for the query:

```typescript
interface LocalQueryParameters {
  datasetName: string;       // The name of the original dataset
  variableNames: string[];   // The names of the variables to include in the query
  sql: string;               // The SQL query to execute
  dbTableName: string;       // The name of the table used in the sql string
}
```

### LocalQueryContext

Configuration context for the tool:

```typescript
interface LocalQueryContext {
  // Get values from a dataset
  getValues: (datasetName: string, variableName: string) => unknown[];
  
  // Optional callback when values are selected in the result table
  onSelected?: (datasetName: string, columnName: string, selectedValues: unknown[]) => void;
  
  // Optional configuration
  config?: {
    isDraggable?: boolean;
    [key: string]: unknown;
  };
  
  // Optional DuckDB instance
  duckDB?: AsyncDuckDB | null;
}
```

### LocalQueryResponse

The structure of a query result:

```typescript
interface LocalQueryResponse {
  llmResult: {
    success: boolean;
    data?: {
      firstTwoRows: Record<string, unknown>[];
      [key: string]: unknown;
    };
    error?: string;
    instruction?: string;
  };
  additionalData?: {
    title: string;
    sql: string;
    columnData: Record<string, unknown[]>;
    variableNames: string[];
    datasetName: string;
    dbTableName: string;
    onSelected?: (datasetName: string, columnName: string, selectedValues: unknown[]) => void;
  };
}
```

## License

MIT