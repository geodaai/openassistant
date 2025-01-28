# React AI Assist Core

A powerful and flexible React library for integrating multiple AI assistants (OpenAI, Google Gemini, and Ollama) into your applications.

## Features

- 🤖 Support for multiple AI providers:
  - OpenAI (GPT models)
  - Google Gemini
  - Ollama (local AI models)
  - DeepSeek (Chat and Reasoner)
- 🔄 Streaming responses
- 🎯 Function calling support
- 🎤 Audio-to-text conversion
- 🖼️ Image processing capabilities
- 🔌 Easy-to-use React hooks
- 📝 Type-safe APIs

## Installation

```bash
npm install @react-ai-assist/core
```


### Peer Dependencies

The following peer dependencies are required:

```json
{
  "react": "^18 || ^19",
  "@langchain/core": "^0.3.26",
  "@langchain/google-genai": "^0.1.6",
  "@langchain/ollama": "^0.1.4",
  "@langchain/openai": "^0.3.16"
}
```


## Usage

### Basic Example

use with `@react-ai-assist/cli` to create chat UI with AI Assist.

```bash
npx @react-ai-assist/cli
```


## Supported Features by Provider

| Feature | OpenAI | Google | Ollama | DeepSeek |
|---------|---------|---------|---------|---------|
| Text Chat | ✅ | ✅ | ✅ | ✅ |
| Image Processing | ✅ | ✅ | ✅ | ❌ |
| Audio to Text | ✅ | ✅ | ❌ | ❌ |
| Function Calling | ✅ | ✅ | ✅ | ✅ |
| Streaming | ✅ | ✅ | ✅ | ✅ |

## API Reference

### useAssistant Hook

The main hook for interacting with AI assistants. See [UseAssistantProps documentation](src/hooks/use-assistant.ts) for detailed configuration options.

```typescript
const assistant = useAssistant({
name: string;
modelProvider: string;
model: string;
apiKey: string;
version: string;
baseUrl?: string;
description?: string;
temperature?: number;
topP?: number;
instructions: string;
functions?: Array<FunctionDefinition>;
});
```


## License

MIT © [Xun Li](mailto:lixun910@gmail.com)