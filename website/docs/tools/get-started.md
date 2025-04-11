---
sidebar_position: 5
---

# Get Started

## Introduction

Tools like [Function Calling](https://platform.openai.com/docs/guides/function-calling?api-mode=responses) allow your AI Assistant to perform specific tasks by invoking predefined functions to handle specialized operations, improving its usefulness and responsiveness.

`Function calling` is particularly valuable for implementing specialized algorithms, computations, or features that Language Models (LLMs) cannot directly perform or would be inefficient at executing through code interpretation.

Use cases that function calling in AI Assistant is useful for:

- Custom business logic or domain-specific algorithms with private data
- Data analysis tasks (e.g., clustering algorithms, statistical analysis)
- Visualization generation (e.g., creating scatter plots with regression lines)
- Complex mathematical computations
- Integration with external services or APIs

OpenAssistant provides a set of tools that helps you build your AI application.

- [DuckDB tools](https://openassistant-doc.vercel.app/docs/tutorial-extras/duckdb-plugin)
- [ECharts tools](https://openassistant-doc.vercel.app/docs/tutorial-extras/echarts-plugin)
- [Kepler.gl tools](https://openassistant-doc.vercel.app/docs/tutorial-extras/keplergl-plugin)
- [Data Analysis tools](https://openassistant-doc.vercel.app/docs/tutorial-extras/geoda-plugin)

## Quick Start

To get started, let's use the **localQuery** tool in @openassistant/duckdb in a simple React application, which can help users query their own data using natural language. For example, users can ask "Which location has the highest revenue?" and the assistant will use the **localQuery** tool to query the data and return the result.

**localQuery** in @openassistant/duckdb

This tool helps to query any data that has been loaded in your application using user's prompt.

- the data in your application will be loaded into a local duckdb instance temporarily
- LLM will generate SQL query based on user's prompt against the data
- the SQL query result will be executed in the local duckdb instance
- the query result will be displayed in a React table component

Let's say you have a dataset in your application. For this example, we will use the `SAMPLE_DATASETS` in `dataset.ts` to simulate the data.

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

First, let's import the `localQuery` tool from `@openassistent/duckdb` and use it in your application.

- Import the `localQuery` tool from `@openassistent/duckdb` and use it in your application.
- Provide the `getValues` function in the `context` to get the values from your data.

```ts
import { localQuery, LocalQueryTool } from '@openassistent/duckdb';

// type safety for the localQuery tool
const localQueryTool: LocalQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues: (datasetName: string, variableName: string) => {
      return SAMPLE_DATASETS[datasetName][variableName];
    },
  },
};
```

Then, you can use the tool in your AI assistant or in the chat component.

- Use the tool in your AI assistant

```tsx
// load your data
// pass the metadata of the data to the assistant

const instructions = `You are a helpful assistant. You can use the following datasets to answer the user's question: 
  datasetName: myVenues,
  variables: index, location, latitude, longitude, revenue, population
  `;

// get the singleton assistant instance
const assistant = await createAssistant({
  name: 'assistant',
  modelProvider: 'openai',
  model: 'gpt-4o',
  apiKey: 'your-api-key',
  version: '0.0.1',
  instructions,
  functions: { localQuery: localQueryTool },
});

// now you can send prompts to the assistant
await assistant.processTextMessage({
  textMessage: 'which location has the highest revenue?',
  streamMessageCallback: ({ isCompleted, message }) => {
    console.log(isCompleted, message);
  },
});
```

- Use the tool in the chat component

```tsx
<AiAssistant
  modelProvider="openai"
  model="gpt-4o"
  apiKey="your-api-key"
  version="0.0.1"
  welcomeMessage="Hello! How can I help you today?"
  instructions={instructions}
  functions={{ localQuery: localQueryTool }}
/>
```

🚀 Try it out!

<img width="400" src="https://github.com/user-attachments/assets/4115b474-13af-48ba-b69e-b39cc325f1b1"/>

See the source code of the example 🔗 [here](https://github.com/geodacenter/openassistant/tree/main/examples/duckdb_esbuild).

## How to create your own tool
