# OpenAssistant

[Documentation](https://openassistant-doc.vercel.app) |
[Playground](https://openassistant-playground.vercel.app)

OpenAssistant is a javascript library for building AI assistant with powerful **tools** and interactive React chat component.

Check out the following examples using OpenAssistant in action:

- [kepler.gl AI Assistant (kepler.gl)](https://location.foursquare.com/resources/blog/products/foursquare-brings-enterprise-grade-spatial-analytics-to-your-browser-with-kepler-gl-3-1/)
- [GeoDa.AI AI Assistant (geoda.ai)](https://geoda.ai)
- [SqlRooms (sqlrooms.org)](https://sqlrooms-ai.netlify.app/)

## Getting Started

### Installation

Install the core packages using npm:

```bash
npm install @openassistant/core
```

### Basic Usage

Then, you can use the OpenAssistant in your application:

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
  functions: tools,
});

// now you can send prompts to the assistant
await assistant.processTextMessage({
  textMessage: 'Hello, how are you?',
  streamMessageCallback: ({ isCompleted, message }) => {
    console.log(isCompleted, message);
  },
});
```

See the source code of the example 🔗 [here](https://github.com/openassistant/openassistant/tree/main/examples/cli_example).

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

### Add a React Chat Component to your App

OpenAssistant provides a pre-built chat component that you can use in your React application.

#### Installation

```bash
npm install @openassistant/ui @openassistant/core
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

<img src="https://openassistant-doc.vercel.app/assets/images/getstart-dark-499fd880728b7978a32aa9e8742a0f38.png" width="300" />


See the source code of the example 🔗 [here](https://github.com/openassistant/openassistant/tree/main/examples/simple_react).

If you are using TailwindCSS, you need to add the following configurations to your `tailwind.config.js` file:

```tsx
module.exports = {
  content: [
    ...'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@openassistant/ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
};
```

## OpenAssistant Tools

OpenAssistant provides a set of tools that you can use in your AI application. For a quick example:

**localQuery** in @openassistant/duckdb

This tool helps to query any data that has been loaded in your application using user's prompt.

- the data in your application will be loaded into a local duckdb instance temporarily
- LLM will generate SQL query based on user's prompt against the data
- the SQL query result will be executed in the local duckdb instance
- the query result will be displayed in a React table component 

Let's say you have a dataset in your application, you can use the `localQuery` tool to query the data using user's prompt.

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

- Use the tool in your AI assistant chat component

```tsx
<AiAssistant
  name="My Assistant"
  apiKey={process.env.OPENAI_TOKEN || ''}
  version="v1"
  modelProvider="openai"
  model="gpt-4o"
  welcomeMessage="Hello, how can I help you today?"
  instructions="You are a duckDB expert. You can help users to query their data using duckdb. Explain the steps you are taking to solve the user's problem."
  functions={{ localQuery: localQueryTool }}
  useMarkdown={true}
/>
```

🚀 Try it out!

<img width="300" src="https://private-user-images.githubusercontent.com/2423887/430499610-4115b474-13af-48ba-b69e-b39cc325f1b1.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDM4MzE5MTksIm5iZiI6MTc0MzgzMTYxOSwicGF0aCI6Ii8yNDIzODg3LzQzMDQ5OTYxMC00MTE1YjQ3NC0xM2FmLTQ4YmEtYjY5ZS1iMzljYzMyNWYxYjEucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDQwNSUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA0MDVUMDU0MDE5WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9NmI2NDY5MDcwZTY3NDlmM2I3NmFjY2YyYWU3YjIxYjA2NTFkNzY2OTU2NTQ4OGJkYWVkMThkNWMzNWI5N2JmMSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.AzgoJi2_TSpal0dBV9DOQ4D3W7dfpskz5Nh-ihMLkMI"/>

See the source code of the example 🔗 [here](https://github.com/openassistant/openassistant/tree/main/examples/duckdb_esbuild).

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
- [Tool Example: DuckDB](examples/duckdb_esbuild/README.md)
- [Tool Example: KeplerGl](examples/keplergl_plugin/README.md)
- [Tool Example: DeckGl](examples/deckgl_assistant/README.md)

## 📄 License

MIT © [Xun Li](mailto:lixun910@gmail.com)

### 📚 FAQ

#### 🔒 Is my data secure?

Yes, the data you used in your application stays within the browser, and will **never** be sent to the LLM. Using function tools, we can engineer the AI assistant to use only the meta data for function calling, e.g. the name of the dataset, the name of the layer, the name of the variables, etc. Here is a process diagram to show how the AI assistant works:

#### How to create a function tool?

OpenAssistant provides function tools, which you can use in your application with just a few lines of code. For example,

- the [DuckDB plugin](https://openassistant-doc.vercel.app/docs/tutorial-basics/add-function-tool) allows the AI assistant to query your data using DuckDB. See a tutorial [here](https://openassistant-doc.vercel.app/docs/tutorial-extras/duckdb-plugin).
- the [ECharts plugin](https://openassistant-doc.vercel.app/docs/tutorial-basics/add-function-tool) allows the AI assistant to visualize data using ECharts. See a tutorial [here](https://openassistant-doc.vercel.app/docs/tutorial-extras/echarts-plugin).
- the [Kepler.gl plugin](https://openassistant-doc.vercel.app/docs/tutorial-basics/add-function-tool) allows the AI assistant to create beautiful maps. See a tutorial [here](https://openassistant-doc.vercel.app/docs/tutorial-extras/keplergl-plugin).
- the [GeoDa plugin](https://openassistant-doc.vercel.app/docs/tutorial-basics/add-function-tool) allows the AI assistant to apply spatial data analysis using GeoDa. See a tutorial [here](https://openassistant-doc.vercel.app/docs/tutorial-extras/geoda-plugin).

If you want to create your own function tool, you can follow the tutorial [here](https://openassistant-doc.vercel.app/docs/tutorial-basics/add-function-tool).
