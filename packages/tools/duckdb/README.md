# @openassistant/duckdb

This package provides several tools for querying your data using DuckDB in browser.

## Features

| Tool Name                                       | Description                                                                  |
| ----------------------------------------------- | ---------------------------------------------------------------------------- |
| [localQuery](/docs/duckdb/variables/localQuery) | Query any data that has been loaded in your application using user's prompt. |
| [mergeTables](/docs/duckdb/variables/mergeTables) | Merge multiple tables into one table.                                        |

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
