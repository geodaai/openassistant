# @openassistant/utils

Utility functions for OpenAssistant tools with multi-provider support, following the Composio pattern for true provider compatibility.

## Features

- **True Multi-Provider Compatibility**: Tools are automatically converted to provider-specific formats (Vercel AI, OpenAI, LangChain, Google AI, Anthropic)
- **Provider-Specific Tool Schemas**: Each provider gets tools in their native format
- **Dynamic Provider Switching**: Switch between providers at runtime without redefining tools
- **Unified Tool Interface**: Write tools once, use with any provider
- **Context Management**: Flexible context passing and default context support
- **Type Safety**: Full TypeScript support with Zod schema validation

## Installation

```bash
npm install @openassistant/utils
```

## Quick Start

```typescript
import { OpenAssistant, VercelAIProvider } from '@openassistant/utils';

// Create a provider
const provider = new VercelAIProvider();

// Create OpenAssistant instance
const assist = new OpenAssistant({
  provider,
  tools: {
    places: yourPlacesTool,
  },
});

// Initialize (this converts tools to provider-specific format)
await assist.initialize();

// Use tools - they're automatically compatible with the provider
const result = await assist.getTools({
  toolName: 'places',
  context: {
    getFSQToken: () => 'your-token',
  },
  parameters: {
    query: 'coffee',
    location: 'San Francisco',
    limit: 5,
  },
});
```

## How It Works (Composio Style)

The library automatically converts your tools to provider-specific formats:

1. **Tool Definition**: Define tools once using the unified interface
2. **Provider Conversion**: Each provider converts tools to their native format
3. **Automatic Compatibility**: Tools work seamlessly across all providers
4. **Schema Generation**: Get provider-specific tool schemas automatically

## Supported Providers

### Vercel AI Provider

```typescript
import { VercelAIProvider } from '@openassistant/utils';

const provider = new VercelAIProvider({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.vercel.com',
  model: 'gpt-4',
});

// Tools are automatically converted to Vercel AI format
const toolSchema = assist.getToolSchema('places');
// Returns: { type: 'function', function: { name: 'search', description: '...', parameters: {...} } }
```

### OpenAI Provider

```typescript
import { OpenAIProvider } from '@openassistant/utils';

const provider = new OpenAIProvider({
  apiKey: 'your-openai-api-key',
  model: 'gpt-4',
  organization: 'your-org-id',
});

// Tools are automatically converted to OpenAI function calling format
const toolSchema = assist.getToolSchema('places');
// Returns: { type: 'function', function: { name: 'search', description: '...', parameters: {...} } }
```

### LangChain Provider

```typescript
import { LangChainProvider } from '@openassistant/utils';

const provider = new LangChainProvider({
  chainType: 'agent', // 'llm' | 'agent' | 'conversation'
  model: 'gpt-4',
});

// Tools are automatically converted to LangChain tool format
const toolSchema = assist.getToolSchema('places');
// Returns: { name: 'search', description: '...', schema: {...}, func: ... }
```

### Google AI Provider

```typescript
import { GoogleProvider } from '@openassistant/utils';

const provider = new GoogleProvider({
  apiKey: 'your-google-api-key',
  model: 'gemini-pro',
  projectId: 'your-project-id',
});

// Tools are automatically converted to Google AI function format
const toolSchema = assist.getToolSchema('places');
// Returns: { functionDeclarations: [{ name: 'search', description: '...', parameters: {...} }] }
```

### Anthropic Provider

```typescript
import { AnthropicProvider } from '@openassistant/utils';

const provider = new AnthropicProvider({
  apiKey: 'your-anthropic-api-key',
  model: 'claude-3-sonnet',
  organization: 'your-org-id',
});

// Tools are automatically converted to Anthropic tool use format
const toolSchema = assist.getToolSchema('places');
// Returns: { type: 'tool_use', name: 'search', description: '...', input_schema: {...} }
```

## Tool Definition

Tools are defined using the `extendedTool` function and work with all providers:

```typescript
import { extendedTool } from '@openassistant/utils';

const placesTool = extendedTool({
  description: 'Search for places using Foursquare API',
  parameters: {
    query: 'string',
    location: 'string',
    limit: 'number',
  },
  execute: async (args, options) => {
    const { query, location, limit } = args;
    const { context } = options;
    
    // Get API token from context
    const getFSQToken = context?.getFSQToken as () => string;
    const token = getFSQToken();
    
    // Your tool logic here
    const results = await searchPlaces(query, location, limit, token);
    
    return {
      llmResult: results,
      additionalData: { query, location, token },
    };
  },
});
```

## OpenAssistant Class

The main class that coordinates between providers and tools with automatic conversion.

### Constructor

```typescript
const assist = new OpenAssistant({
  provider: new VercelAIProvider(),
  tools: { places: placesTool },
  defaultContext: { apiVersion: 'v2' },
});
```

### Key Methods

#### `initialize()`
Initialize and convert all tools to provider-specific format.

#### `getToolSchema(toolName)`
Get the provider-specific tool schema for a tool.

```typescript
// Get OpenAI function calling format
const openaiSchema = assist.getToolSchema('places');

// Get Google AI function format
const googleSchema = assist.getToolSchema('places');

// Get LangChain tool format
const langchainSchema = assist.getToolSchema('places');
```

#### `getAllToolSchemas()`
Get all tool schemas in provider-specific format.

#### `switchProvider(newProvider)`
Switch to a different provider and automatically convert tools.

```typescript
// Switch from Vercel AI to OpenAI
await assist.switchProvider(new OpenAIProvider({ apiKey: 'key' }));

// Tools are automatically converted to OpenAI format
const openaiSchema = assist.getToolSchema('places');
```

#### `getProviderTools()`
Get provider-specific tool representations.

## Dynamic Provider Switching

Switch between providers at runtime:

```typescript
const assist = new OpenAssistant({
  provider: new VercelAIProvider(),
  tools: { places: placesTool },
});

await assist.initialize();

// Use with Vercel AI
const vercelResult = await assist.getTools({
  toolName: 'places',
  parameters: { query: 'coffee', location: 'SF' },
});

// Switch to OpenAI
await assist.switchProvider(new OpenAIProvider({ apiKey: 'key' }));

// Same tool, now in OpenAI format
const openaiResult = await assist.getTools({
  toolName: 'places',
  parameters: { query: 'coffee', location: 'SF' },
});
```

## Provider Tool Conversion

Each provider automatically converts tools to their native format:

```typescript
// Vercel AI format
{
  type: 'function',
  function: {
    name: 'search',
    description: 'Search for places...',
    parameters: { ... }
  }
}

// OpenAI format
{
  type: 'function',
  function: {
    name: 'search',
    description: 'Search for places...',
    parameters: { ... }
  }
}

// LangChain format
{
  name: 'search',
  description: 'Search for places...',
  schema: { ... },
  func: async (args) => { ... }
}

// Google AI format
{
  functionDeclarations: [{
    name: 'search',
    description: 'Search for places...',
    parameters: { ... }
  }]
}

// Anthropic format
{
  type: 'tool_use',
  name: 'search',
  description: 'Search for places...',
  input_schema: { ... }
}
```

## Context Management

Context allows you to pass additional data to tools:

```typescript
// Set default context
const assist = new OpenAssistant({
  provider: new VercelAIProvider(),
  tools: { places: placesTool },
  defaultContext: {
    getFSQToken: () => 'default-token',
    apiVersion: 'v2',
  },
});

// Override context for specific calls
const result = await assist.getTools({
  toolName: 'places',
  context: {
    getFSQToken: () => 'custom-token', // Overrides default
  },
  parameters: { query: 'restaurants', location: 'NYC' },
});
```

## Examples

See the examples directory for comprehensive usage:

- `simple-example.ts` - Basic usage as requested
- `usage-examples.ts` - All provider examples
- `composio-style-example.ts` - Provider compatibility demos
- `langchain-integration-example.ts` - Comprehensive LangChain integration examples

## TypeScript Support

Full TypeScript support with proper type inference:

```typescript
import { OpenAssistant, VercelAIProvider } from '@openassistant/utils';

interface PlacesContext {
  getFSQToken: () => string;
}

interface PlacesParameters {
  query: string;
  location: string;
  limit: number;
}

const assist = new OpenAssistant<PlacesContext>({
  provider: new VercelAIProvider(),
  tools: { places: placesTool },
});

// TypeScript will infer the correct types
const result = await assist.getTools({
  toolName: 'places',
  context: { getFSQToken: () => 'token' },
  parameters: { query: 'coffee', location: 'SF', limit: 5 },
});
```

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## License

MIT License - see LICENSE file for details.
