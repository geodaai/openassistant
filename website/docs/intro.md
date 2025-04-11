---
sidebar_position: 1
---

# OpenAssistant

[Documentation](https://openassistant-doc.vercel.app) |
[Playground](https://openassistant-playground.vercel.app)

OpenAssistant is a javascript library for building AI assistant with powerful tools and an interactive React chat component.

Check out the following examples using OpenAssistant in action:

- [kepler.gl AI Assistant (kepler.gl)](https://location.foursquare.com/resources/blog/products/foursquare-brings-enterprise-grade-spatial-analytics-to-your-browser-with-kepler-gl-3-1/)
- [GeoDa.AI AI Assistant (geoda.ai)](https://geoda.ai)
- [SqlRooms (sqlrooms.org)](https://sqlrooms-ai.netlify.app/)

## Why OpenAssistant?

OpenAssistant is built based on [Vercel AI SDK](https://sdk.vercel.ai/docs) and provides:

- a uniform interface for different AI providers
- a set of powerful LLM tools (data analysis, visualization, mapping, etc.)
- an interactive React chat component (optional)

for building your own AI assistant, along with a design allows you to easily create your own tools by :

- providing your own context (e.g. data, callbacks etc.) for the tool execution
- providing your own UI component for rendering the tool result
- passing the result from the tool execution to the tool UI component

## Getting Started

### Installation

Install the core packages:

```bash
npm install @openassistant/core
```

### Usage

Then, you can use the OpenAssistant in your application. For example:

```ts
import { createAssistant } from '@openassistant/core';

// get the singleton assistant instance
const assistant = await createAssistant({
  name: 'assistant',
  modelProvider: 'openai',
  model: 'gpt-4o',
  apiKey: 'your-api-key',
  version: '0.0.1',
  instructions: 'You are a helpful assistant',
  // functions: {{}},
  // abortController: null
});

// now you can send prompts to the assistant
await assistant.processTextMessage({
  textMessage: 'Hello, how are you?',
  streamMessageCallback: ({ isCompleted, message }) => {
    console.log(isCompleted, message);
  },
});
```

See the source code of the example 🔗 [here](https://github.com/GeoDaCenter/openassistant/tree/main/examples/cli_example).

:::tip

If you want to use Google Gemini as the model provider, you can do the following:

Install vercel google gemini client:

```bash
npm install @ai-sdk/google
```

Then, you can use update the assistant configuration to use Google Gemini.

OpenAssistant also supports the following model providers:

| Model Provider | Models                                                                                             | Dependency         |
| -------------- | -------------------------------------------------------------------------------------------------- | ------------------ |
| OpenAI         | [link](https://sdk.vercel.ai/providers/ai-sdk-providers/openai#model-capabilities)                 | @ai-sdk/openai     |
| Google         | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai#model-capabilities) | @ai-sdk/google     |
| Anthropic      | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic#model-capabilities)            | @ai-sdk/anthropic  |
| DeepSeek       | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/deepseek#model-capabilities)             | @ai-sdk/deepseek   |
| xAI            | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/xai#model-capabilities)                  | @ai-sdk/xai        |
| Ollama         | [models](https://ollama.com/models)                                                                | ollama-ai-provider |

:::

### Add a React Chat Component to your App

You can build your own chat interface along with the assistant instance created by `createAssistant()`. OpenAssistant also provides a pre-built chat component that you can use in your React application.

#### Installation

```bash
npm install @openassistant/ui
```

#### Usage

```tsx
import { AiAssistant } from '@openassistant/ui';
// for React app without tailwindcss, you can import the css file
// import '@openassistant/ui/dist/index.css';

function App() {
  return (
    <AiAssistant
      modelProvider="openai"
      model="gpt-4"
      apiKey="your-api-key"
      version="v1"
      welcomeMessage="Hello! How can I help you today?"
      instructions="You are a helpful assistant."
      functions={{}}
      theme="dark"
      useMarkdown={true}
      showTools={true}
      onMessageUpdated=({messages}) => {
        console.log(messages);
      }}
    />
  );
}
```

<img src="https://openassistant-doc.vercel.app/img/getstart-dark.png" width="300" />

See the source code of the example 🔗 [here](https://github.com/geodacenter/openassistant/tree/main/examples/simple_react).

:::tip

If you are using TailwindCSS, you need to add the following configurations to your `tailwind.config.js` file:

```tsx
import { nextui } from '@nextui-org/react';
...

module.exports = {
  content: [
    ...,
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@openassistant/ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui()],
};
```

:::

## Use Tools

OpenAssistant provides a set of tools that helps you build your AI application.

- [DuckDB tools](https://openassistant-doc.vercel.app/docs/tutorial-extras/duckdb-plugin)
- [ECharts tools](https://openassistant-doc.vercel.app/docs/tutorial-extras/echarts-plugin)
- [Kepler.gl tools](https://openassistant-doc.vercel.app/docs/tutorial-extras/keplergl-plugin)
- [Data Analysis tools](https://openassistant-doc.vercel.app/docs/tutorial-extras/geoda-plugin)

For a quick example:

**localQuery** in @openassistant/duckdb

This tool helps to query any data that has been loaded in your application using user's prompt.

- the data in your application will be loaded into a local duckdb instance temporarily
- LLM will generate SQL query based on user's prompt against the data
- the SQL query result will be executed in the local duckdb instance
- the query result will be displayed in a React table component

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

- Import the `localQuery` tool from `@openassistent/duckdb` and use it in your application.
- Provide the `getValues` function in the `context` to get the values from your data.
- Use the tool in your AI assistant chat component

```ts
import { localQuery, LocalQueryTool } from '@openassistent/duckdb';

// load your data
// pass the metadata of the data to the assistant instructions
const instructions = `You are a helpful assistant. You can use the following datasets to answer the user's question:
  datasetName: myVenues,
  variables: index, location, latitude, longitude, revenue, population
  `;

// use LocalQueryTool to type safety
const localQueryTool: LocalQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues: (datasetName: string, variableName: string) => {
      return SAMPLE_DATASETS[datasetName][variableName];
    },
  },
};

// use the tool in the chat component
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

## 🌟 Features

- 🤖 **One interface for multiple AI providers**
  - DeepSeek (Chat and Reasoner)
  - OpenAI (GPT models)
  - Google Gemini
  - Ollama (local AI models)
  - XAI Grok
  - Anthropic Claude
  - AWS Bedrock\*
  - Azure OpenAI\*

\* via server API only, see [how-to documentation here](https://openassistant-doc.vercel.app/blog/server-support)

- 🌟 **Easy-to-use Tools to extend your AI assistant**

  - DuckDB: in-browser query data using duckdb via prompt
  - ECharts: visualize data using echarts via prompt
  - KeplerGl: create maps using keplergl via prompt
  - GeoDa: apply spatial data analysis using geoda wasm via prompt

- 🎯 **Built-in React chat component**
  - Pre-built chat interface
  - Pre-built LLM configuration interface
  - Theme support
  - Take screenshot to ask [[Demo]](https://geoda.ai/img/highlight-screenshot.mp4)
  - Talk to ask [[Demo]](https://geoda.ai/img/highlight-ai-talk.mp4)
  - Function calling support [[Demo]](https://geoda.ai/img/highlight-prompt.mp4)

See the [tutorial](https://openassistant-doc.vercel.app/docs/tutorial-basics/screencapture) for more details.

- 📦 **Easy integration**
  - CLI tool for adding components
  - TypeScript support
  - Tailwind CSS integration

## 🎯 Examples

Check out our example projects:

- [Basic Example](examples/cli_example/README.md)
- [Custom Function Example](examples/zod_function_tools/README.md)
- [Multiple Step Tools](examples/multisteps_tools/README.md)
- [Message Persistence Example](examples/message_persistence/README.md)
- [Simple React Example](examples/simple_react/README.md)
- [React with TailwindCSS Example](examples/react_tailwind/README.md)
- [Tool Example: ECharts](examples/echarts_plugin/README.md)
- [Tool Example: DuckDB](examples/duckdb_esbuild/README.md)
- [Tool Example: KeplerGl](examples/keplergl_plugin/README.md)
- [Tool Example: DeckGl](examples/deckgl_assistant/README.md)

## 📄 License

MIT © [Xun Li](mailto:lixun910@gmail.com)
