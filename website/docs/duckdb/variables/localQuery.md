# Variable: localQuery

> `const` **localQuery**: `ExtendedTool`\<`ZodObject`\<\{ `datasetName`: `ZodString`; `dbTableName`: `ZodString`; `sql`: `ZodString`; `variableNames`: `ZodArray`\<`ZodString`, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `datasetName`: `string`; `dbTableName`: `string`; `sql`: `string`; `variableNames`: `string`[]; \}, \{ `datasetName`: `string`; `dbTableName`: `string`; `sql`: `string`; `variableNames`: `string`[]; \}\>, \{ `data`: \{ `firstTwoRows`: `object`[]; \}; `dbTableName`: `any`; `error`: `undefined`; `instruction`: `undefined`; `success`: `boolean`; \}, \{ `config`: \{ `isDraggable`: `boolean`; \}; `datasetName`: `any`; `dbTableName`: `any`; `sql`: `any`; `title`: `string`; `variableNames`: `any`; \}, \{ `config`: \{ `isDraggable`: `boolean`; \}; `duckDB`: `null`; `getValues`: () => `never`; `onSelected`: () => `never`; \}\>

Defined in: [packages/duckdb/src/tool.ts:97](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/duckdb/src/tool.ts#L97)

[**Browser Tool**] The localQuery tool is used to execute a query against a local dataset.

## Example

```typescript
import { getDuckDBTool } from '@openassistant/duckdb';

// context
const context = {
  getValues: (datasetName: string, variableName: string) => {
    // get the values of the variable from your dataset, e.g.
    return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
  },
}

const onToolCompleted = (toolCallId: string, additionalData?: unknown) => {
  // do something with the additionalData
}

// get the tool
const localQueryTool = getDuckDBTool('localQuery', {context, onToolCompleted});

generateText({
  model: 'gpt-4o-mini',
  prompt: 'What are the venues in San Francisco?',
  tools: {localQuery: localQueryTool},
});
```

### getValues()

User implements this function to get the values of the variable from dataset.

For prompts like "_Show me the revenue per capita for each location in dataset myVenues_", the tool will
call the `getValues()` function twice:
- get the values of **revenue** from dataset: getValues('myVenues', 'revenue')
- get the values of **population** from dataset: getValues('myVenues', 'population')

A duckdb table will be created using the values returned from `getValues()`, and LLM will generate a sql query to query the table to answer the user's prompt.

## Server Side Usage

Here is an example of how to use the localQuery tool in server side:

`app/api/chat/route.ts`
```typescript
import { getDuckDBTools } from '@openassistant/duckdb';

// localQuery tool will be running on the client side
const localQueryTool = getDuckDBTool('localQuery', {isExecutable: false});

export async function POST(req: Request) {
  // ...
  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: messages,
    tools: {localQuery: localQueryTool},
  });
}
```

`app/page.tsx`
```typescript
import { useChat } from 'ai/react';
import { getDuckDBTool } from '@openassistant/duckdb';

const localQueryTool = getDuckDBTool('localQuery', {
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      // get the values of the variable from your dataset, e.g.
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
  onToolCompleted: (toolCallId: string, additionalData?: unknown) => {
    // do something with the additionalData
  },
  isExecutable: true,
});

const { messages, input, handleInputChange, handleSubmit } = useChat({
  maxSteps: 20,
  onToolCall: async (toolCallId, toolCall) => {
     if (toolCall.name === 'localQuery') {
       const result = await localQueryTool.execute(toolCall.args, toolCall.options);
       return result;
     }
  }
});
```
