# Vercel v5 Client-Only Chat Example

> **Note:** This example has been updated to use Vercel AI SDK v5. See [VERCEL_AI_V5_MIGRATION.md](./VERCEL_AI_V5_MIGRATION.md) for details on the changes made.

This example demonstrates how to use `useChat` with a custom transport instead of API routes in a Next.js application. This approach allows you to handle AI processing entirely on the client side without needing to create server-side API endpoints.

## Key Features

- **Client-Only Processing**: Uses `useChat` with `DefaultChatTransport` and a custom `fetch` function
- **No API Routes**: Eliminates the need for `app/api/chat/route.ts`
- **Local Tool Execution**: DuckDB queries and other tools run directly in the browser
- **Streaming Responses**: Maintains the streaming chat experience

## How It Works

Instead of making HTTP requests to an API route, this example:

1. **Custom Transport**: Uses `DefaultChatTransport` with a custom `fetch` function
2. **Local AI Processing**: The `customFetch` function processes messages locally using the AI SDK
3. **Direct Tool Execution**: Tools like DuckDB queries execute directly in the browser
4. **Streaming**: Maintains streaming responses using `streamText().toUIMessageStreamResponse()`

## Code Structure

```typescript
const customFetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
  const m = JSON.parse(init?.body as string);
  const result = streamText({
    model: openai("gpt-4o"),
    messages: convertToModelMessages(m.messages),
    system: systemPrompt,
    abortSignal: init?.signal as AbortSignal | undefined,
  });
  return result.toUIMessageStreamResponse();
};

const { error, messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    fetch: customFetch,
  }),
});
```

## Benefits

- **Simplified Architecture**: No need to manage API routes or server-side logic
- **Better Performance**: Eliminates network round-trips for AI processing
- **Easier Development**: All logic runs in one place (client-side)
- **Cost Effective**: No server-side AI processing costs

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set your OpenAI API key in the environment:
   ```bash
   export OPENAI_API_KEY=your_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Try It Out

Ask questions like:
- "What are the top 4 values of HR60?"
- "Show me a chart of PO60 data"
- "Analyze the natregimes dataset"

## Dependencies

- `@ai-sdk/react` - React hooks for AI chat
- `@ai-sdk/openai` - OpenAI model integration
- `@openassistant/duckdb` - DuckDB integration for data queries
- `@openassistant/tables` - Table rendering components
- `@openassistant/utils` - Utility functions for tool conversion

## Comparison with API Route Approach

| Aspect | API Route | Client-Only Transport |
|--------|-----------|----------------------|
| Architecture | Client → API Route → AI Service | Client → Local AI Processing |
| Network Calls | Required for each message | None for AI processing |
| Server Resources | Uses server CPU/memory | Uses client resources |
| Deployment | Requires server deployment | Static deployment possible |
| Cost | Server-side AI costs | Client-side processing |
| Latency | Network round-trip | Immediate processing |
