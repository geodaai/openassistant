---
title: "Building Browser-Only AI Applications with Vercel AI SDK v5 and OpenAssistant"
description: "Learn how to create powerful AI applications that run entirely in the browser using Vercel AI SDK v5 and OpenAssistant tools"
authors: ["OpenAssistant Team"]
tags: ["vercel-ai-sdk", "openassistant", "browser-only", "ai-tools", "nextjs"]
image: "/img/vercel-ai-v5-client-only.png"
date: 2025-01-31
---

# Building Browser-Only AI Applications with Vercel AI SDK v5 and OpenAssistant

The landscape of AI application development has evolved significantly with the introduction of Vercel AI SDK v5. One of the most exciting new capabilities is the ability to build AI applications that run entirely in the browser without requiring server-side API routes. This approach opens up new possibilities for creating more responsive, cost-effective, and deployable AI applications.

In this blog post, we'll explore how to leverage Vercel AI SDK v5 with OpenAssistant tools to build a powerful browser-only AI application that can perform data analysis, create visualizations, and handle complex queries—all while running locally in the user's browser.

## Why Browser-Only AI Applications?

Before diving into the implementation, let's understand the benefits of this approach:

- **🚀 Better Performance**: No network round-trips for AI processing
- **💰 Cost Effective**: Eliminates server-side AI processing costs
- **🔒 Privacy**: Data stays in the user's browser
- **📱 Offline Capable**: Works without internet connection after initial load
- **🚀 Simplified Deployment**: Can be deployed as static sites
- **⚡ Lower Latency**: Immediate processing without server communication

## The Architecture: Custom Transport with Local Processing

The key innovation in Vercel AI SDK v5 is the ability to use custom transports. Instead of making HTTP requests to API routes, we can intercept the communication and handle AI processing locally using the `DefaultChatTransport` with a custom `fetch` function.

Here's how it works:

```typescript
// Custom fetch function that handles AI processing locally
const customFetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
  const m = JSON.parse(init?.body as string);

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(m.messages),
    tools,
    system: systemPrompt,
    abortSignal: init?.signal as AbortSignal | undefined,
  });
  return result.toUIMessageStreamResponse();
};

// Use custom transport with useChat
const { error, messages, sendMessage, addToolResult } = useChat({
  transport: new DefaultChatTransport({
    fetch: customFetch,
  }),
  onToolCall: async ({ toolCall }) => {
    // Handle local tool execution
    if (toolCall.toolName === 'localQuery') {
      const result = await localQueryTool.execute(toolCall.input, {
        toolCallId: toolCall.toolCallId,
      });
      addToolResult({
        tool: 'localQuery',
        toolCallId: toolCall.toolCallId,
        output: result,
      });
    }
  },
});
```

## Building the Application

Let's walk through creating a complete browser-only AI application step by step.

### 1. Project Setup

Start with a Next.js project and install the necessary dependencies:

```bash
npm install @ai-sdk/react @ai-sdk/openai ai @openassistant/duckdb @openassistant/tables
```

### 2. Core Application Structure

The main application component sets up the chat interface and custom transport:

```typescript:app/page.tsx
'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { localQuery, LocalQueryTool } from '@openassistant/duckdb';
import { createOpenAI } from '@ai-sdk/openai';
import {
  convertToModelMessages,
  DefaultChatTransport,
  streamText,
  UIMessagePart,
  lastAssistantMessageIsCompleteWithToolCalls,
} from 'ai';
import { MessageParts } from './components/parts';

const systemPrompt = `You are a helpful assistant that can answer questions and help with tasks. 
You can use the following datasets:
- datasetName: natregimes
- variables: [HR60, PO60]
`;

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default function Home() {
  const [input, setInput] = useState('');
  const [toolAdditionalData, setToolAdditionalData] = useState<
    Record<string, unknown>
  >({});

  // ... rest of the component
}
```

### 3. Custom Transport Implementation

The heart of our browser-only approach is the custom transport that processes AI requests locally:

```typescript
const customFetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
  const m = JSON.parse(init?.body as string);

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(m.messages),
    tools,
    system: systemPrompt,
    abortSignal: init?.signal as AbortSignal | undefined,
  });
  return result.toUIMessageStreamResponse();
};
```

### 4. Local Tool Integration

OpenAssistant tools like DuckDB queries can run directly in the browser:

```typescript
const myLocalQuery: LocalQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues,
  },
  onToolCompleted,
};

const localQueryTool = {
  description: myLocalQuery.description,
  inputSchema: myLocalQuery.parameters,
  execute: async (args: Record<string, unknown>, options: any) => {
    const result = await myLocalQuery.execute(args as any, {
      ...options,
      context: myLocalQuery.context,
    });
    
    if (options.toolCallId && myLocalQuery.onToolCompleted) {
      myLocalQuery.onToolCompleted(options.toolCallId, result.additionalData);
    }
    
    return result.llmResult;
  },
};
```

### 5. Message Rendering with Tool Support

The `MessageParts` component handles rendering different types of content, including tool outputs:

```typescript:app/components/parts.tsx
export function MessageParts({
  parts,
  toolAdditionalData,
  getValues,
}: MessagePartsProps) {
  return (
    <div className="whitespace-pre-wrap">
      {parts.map((part) => {
        switch (part.type) {
          case 'text':
            return part.text;
          case 'tool-localQuery': {
            const { toolCallId, state, input, output } = part;
            const additionalData = toolAdditionalData[toolCallId];
            return (
              <ToolInvocation
                key={toolCallId}
                toolCallId={toolCallId}
                state={state}
                toolName="localQuery"
                additionalData={additionalData}
                getValues={getValues}
              />
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
```

## Key Features and Capabilities

### 1. Streaming Responses

Despite running locally, the application maintains the smooth streaming experience users expect from AI applications:

```typescript
const result = streamText({
  model: openai('gpt-4o'),
  messages: convertToModelMessages(m.messages),
  tools,
  system: systemPrompt,
});
return result.toUIMessageStreamResponse();
```

### 2. Tool Execution

Tools like DuckDB queries execute directly in the browser, providing immediate results:

```typescript
onToolCall: async ({ toolCall }) => {
  if (toolCall.toolName === 'localQuery') {
    const result = await localQueryTool.execute(toolCall.input, {
      toolCallId: toolCall.toolCallId,
    });
    addToolResult({
      tool: 'localQuery',
      toolCallId: toolCall.toolCallId,
      output: result,
    });
  }
},
```

### 3. Rich Data Visualization

OpenAssistant's table components render query results with interactive features:

```typescript:app/components/local-query.tsx
export function LocalQueryTool({
  toolCallId,
  additionalData,
  getValues,
}: LocalQueryToolProps) {
  if (isQueryDuckDBOutputData(additionalData)) {
    return (
      <QueryDuckDBComponent
        key={toolCallId}
        {...additionalData}
        getDuckDB={getDuckDB}
        getValues={getValues}
      />
    );
  }
  return null;
}
```

## Real-World Use Cases

This browser-only approach is particularly powerful for:

- **Data Analysis Applications**: Users can upload datasets and perform analysis without sending data to servers
- **Educational Tools**: Interactive AI tutors that work offline
- **Research Applications**: Privacy-sensitive data analysis tools
- **Demo Applications**: Quick prototypes that don't require backend setup
- **Internal Tools**: Company tools that need to work in restricted environments

## Performance Considerations

While browser-only processing offers many benefits, consider these factors:

- **Bundle Size**: AI models and tools increase the initial download size
- **Memory Usage**: Large datasets and AI processing consume browser memory
- **CPU Usage**: Complex operations run on the user's device
- **Browser Compatibility**: Ensure target browsers support required features

## Deployment and Distribution

One of the biggest advantages is simplified deployment:

```bash
# Build the application
npm run build

# Deploy to any static hosting service
# - Vercel
# - Netlify
# - GitHub Pages
# - AWS S3 + CloudFront
# - Any CDN
```

## Future Enhancements

The browser-only approach opens up exciting possibilities:

- **WebAssembly Integration**: Use WASM for better performance
- **Service Workers**: Enable offline functionality
- **IndexedDB**: Local data persistence
- **Web Workers**: Background processing without blocking the UI
- **Progressive Web App**: App-like experience with offline capabilities

## Conclusion

Vercel AI SDK v5's custom transport capability, combined with OpenAssistant's powerful tools, enables developers to create sophisticated AI applications that run entirely in the browser. This approach offers better performance, lower costs, and simplified deployment while maintaining the rich functionality users expect.

The browser-only architecture represents a significant shift in how we think about AI applications, moving from server-centric to client-centric processing. As web technologies continue to advance, we can expect even more powerful capabilities running locally in the browser.

Whether you're building data analysis tools, educational applications, or interactive demos, the browser-only approach with Vercel AI SDK v5 and OpenAssistant provides a robust foundation for creating engaging AI experiences.

## Resources

- [Vercel AI SDK v5 Documentation](https://sdk.vercel.ai/docs)
- [OpenAssistant Documentation](https://openassistant.io/docs)
- [Example Project Repository](https://github.com/openassistant/openassistant/tree/main/examples/vercel_v5_client_only)
- [DuckDB WebAssembly](https://duckdb.org/docs/guides/web/installation)
- [Next.js App Router](https://nextjs.org/docs/app)

---

*Ready to build your own browser-only AI application? Check out the [complete example](https://github.com/openassistant/openassistant/tree/main/examples/vercel_v5_client_only) and start creating AI experiences that run entirely in the browser!*
