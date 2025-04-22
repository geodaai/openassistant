# @openassistant/core

The core package is built based on [Vercel AI SDK](https://sdk.vercel.ai/docs) and provides:

- a uniform interface for different AI providers
- allows you to integrate powerful tools for tasks like data analysis, visualization, mapping, etc.
- allows you to easily create your own tools by:
  - providing your own context (e.g. data, callbacks etc.) for the tool execution
  - providing your own UI component for rendering the tool result
  - passing the result from the tool execution to the tool UI component or next tool execution.

## Getting Started

### Installation

Install the core package:

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

## Common Tools

OpenAssistant provides a set of common tools that are useful for different tasks.

### Think

The `think` tool is a tool that enables LLM to think about a problem before solving it.

#### Implementation

```ts
export const think = tool({
  parameters: z.object({
    question: z.string().describe('The question to think about'),
  }),
  execute: async ({ question }) => {
    return {
      llmResult: {
        success: true,
        result: {
          question,
          instruction: `
- Before executing the plan, please summarize the plan for using the tools.
- If the tools are missing parameters, please ask the user to provide the parameters.
- When executing the plan, please try to fix the error if there is any.
- After executing the plan, please summarize the result and provide the result in a markdown format.
`,
        },
      },
    };
  },
});
```

#### Usage

```ts
import { tool } from '@openassistant/core';
import { z } from 'zod';

const weather =  tool({
      description: 'Get the weather in a city from a weather station',
      parameters: z
        .object({ cityName: z.string() })
        .describe('The city name to get the weather for'),
      execute: async ({ cityName }, options) => {
        const getStation = options.context?.getStation;
        const station = getStation ? await getStation(cityName) : null;
        return {
          llmResult: {
            success: true,
            result: `The weather in ${cityName} is sunny from weather station ${station}.`,
          },
          additionalData: {
            weather: 'sunny',
            station,
          },
        };
      },
      context: {
        getStation: async (cityName: string) => {
          const stations = {
            'New York': '123',
            'Los Angeles': '456',
            Chicago: '789',
          };
          return stations[cityName];
        },
      },
    });

const assistant = await createAssistant({
  name: 'assistant',
  modelProvider: 'openai',
  model: 'gpt-4o',
  apiKey: 'your-api-key',
  version: '0.0.1',
  instructions: 'You are a helpful assistant',
  tools: { {think, weather} },
});
```

Example output:

When you prompt the assistant with:

```
What is the weather in New York?
```

The assistant will think about the problem and then use the weather tool to get the weather in New York.
