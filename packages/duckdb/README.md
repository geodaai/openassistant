# @openassistant/duckdb

A package that provides SQL query capabilities for local datasets using DuckDB in OpenAssistant applications.

## Installation

```bash
npm install @openassistant/duckdb
```

## Usage

### Basic Usage

```typescript
import { localQuery } from '@openassistant/duckdb';
import { AiAssistant } from '@openassistant/ui';

// Your dataset
const SAMPLE_DATASETS = {
  myVenues: [
    { location: 'New York', revenue: 1000000, population: 8419000 },
    { location: 'Los Angeles', revenue: 800000, population: 3971000 },
    // ...
  ]
};

// Configure the localQuery tool
const localQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues: (datasetName, variableName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
};

// Use in AI Assistant
function App() {
  return (
    <AiAssistant
      name="DuckDB Assistant"
      apiKey={process.env.OPENAI_API_KEY || ''}
      modelProvider="openai"
      model="gpt-4"
      version="v1"
      instructions="You are a DuckDB expert. Help users query data."
      functions={{ localQuery: localQueryTool }}
    />
  );
}
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