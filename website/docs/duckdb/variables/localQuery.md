# Variable: localQuery

> `const` **localQuery**: `ExtendedTool`\<[`LocalQueryArgs`](../type-aliases/LocalQueryArgs.md), [`LocalQueryResult`](../type-aliases/LocalQueryResult.md), [`LocalQueryAdditionalData`](../type-aliases/LocalQueryAdditionalData.md), [`LocalQueryContext`](../type-aliases/LocalQueryContext.md)\>

Defined in: [packages/tools/duckdb/src/tool.ts:128](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/duckdb/src/tool.ts#L128)

The `localQuery` tool is used to execute a query against a local dataset.

:::note
This tool should be executed in Browser environment for now.
:::

### Example
```typescript
import { localQuery } from '@openassistant/duckdb';
import { convertToVercelAiTool } from '@openassistent/utils';
import { generateText } from 'ai';

const localQueryTool: LocalQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues: async (datasetName: string, variableName: string) => {
      // get the values of the variable from your dataset, e.g.
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
};

generateText({
  model: 'gpt-4o-mini',
  prompt: 'What are the venues in San Francisco?',
  tools: {localQuery: convertToVercelAiTool(localQueryTool)},
});
```

### Example with useChat

`app/api/chat/route.ts`
```typescript
import { localQuery } from '@openassistant/duckdb';
import { convertToVercelAiTool } from '@openassistent/utils';
import { streamText } from 'ai';

// localQuery tool will be running on the client side
const localQueryTool = convertToVercelAiTool(localQuery, {isExecutable: false});

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
       const result = await localQueryTool.execute(toolCall.args, toolCall.options);
       return result;
     }
  }
});
```

### Example with `@openassistant/ui`

```typescript
import { localQuery } from '@openassistant/duckdb';
import { convertToVercelAiTool } from '@openassistent/utils';

const localQueryTool: LocalQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues: async (datasetName: string, variableName: string) => {
      // get the values of the variable from your dataset, e.g.
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
};

 export function App() {
   return (
     <AiAssistant
       apiKey={process.env.OPENAI_API_KEY || ''}
       modelProvider="openai"
       model="gpt-4o"
       welcomeMessage="Hello! I'm your assistant."
       instructions={instructions}
       tools={{localQuery: localQueryTool}}
       useMarkdown={true}
       theme="dark"
     />
   );
 }
```
