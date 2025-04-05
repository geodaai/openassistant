---
sidebar_position: 1
---

# Quick Start

OpenAssistant is not only a LLM based chatbot, it is engineered to
help users analyzing their data by levaraging the existing
functions and tools in your application. OpenAssistant provides a
new way that allows users to interact with your application in a
more natural and creative way.

## Getting Started

Here's a basic example of using OpenAssistant in your javascript application:

### Installation

Install the core packages using npm:

```bash
npm install @openassistant/core
```

### Usage

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

:::tip
If you want to use Google Gemini as the model provider, you can do the following:

Install vercel google gemini client:

```bash
npm install @ai-sdk/google
```

Then, you can use update the assistant configuration to use Google Gemini.

OpenAssistant also supports the following model providers:

| Model Provider | Models | Dependency |
| -------------- | ------ | ---------- |
| OpenAI         | [link](https://sdk.vercel.ai/providers/ai-sdk-providers/openai#model-capabilities) | @ai-sdk/openai  |
| Google         | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai#model-capabilities) | @ai-sdk/google |
| Anthropic      | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic#model-capabilities) | @ai-sdk/anthropic |
| DeepSeek       | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/deepseek#model-capabilities) | @ai-sdk/deepseek |
| xAI            | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/xai#model-capabilities) | @ai-sdk/xai |
| Ollama         | [models](https://ollama.com/models) | ollama-ai-provider |
:::

## Add a Chat Component to your App

### Installation

```bash
npm install @openassistant/ui @openassistant/core
```

### Usage

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
      functions={[]}
      theme='dark'
    />
  );
}
```

See the source code of the example 🔗 [here](https://github.com/openassistant/openassistant/tree/main/examples/simple_react).

<img src="https://github.com/user-attachments/assets/394a9bb6-6022-477d-a98d-f85db043ce71" alt="Screen Capture" width={400} />

:::tip

If you are using TailwindCSS, you need to add the following configurations to your `tailwind.config.js` file:

```tsx
module.exports = {
  content: [
    ...
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@openassistant/ui/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
};
```
:::
