---
slug: server-support
title: Build AI Assistant on Your Own Backend
authors: [XunLi]
tags: [openassistant, server, support, beginner-friendly]
---

OpenAssistant is a powerful tool for building AI-powered applications. However, it can be challenging to integrate it into existing server-side applications. In this blog post, we will explore how to use OpenAssistant in a server-side application.

<!--truncate-->

# Build AI Assistant on Your Own Backend

Since version 0.1.0, OpenAssistant is not just a frontend framework, it also enanbles developers to build full-stack applications by providing built-in server-side support.

With API routes provided by OpenAssistant/core, OpenAssistant allows you to build your own AI Assistant that can assist your users to use your backend services with ease.

In this blog post, we will walk you through the steps to build a simple AI Assistant that can assist your users to use your backend services.

## The Client-Side Setup

```tsx
import { AiAssistant } from '@openassistant/ui';

function App() {
  
  return (
    <div>
      <AiAssistant 
        // chatEndpoint is the API route that handles the chat requests
        chatEndpoint='/api/chat'
        // model, token, temperature, etc. can be configured on the server-side
        welcomeMessage="Hello, I am your AI Assistant. How can I assist you today?"
      />
    </div>
  );
}
```

## The Server-Side Setup

```ts
// app/api/chat/route.ts
import { ChatHandler } from '@openassistant/core';
// you can use any LLM provider supported by vercel AI sdk 
import { openai } from '@ai-sdk/openai';

// Create a chat handler instance to handle the chat requests using a specific LLM model
const handler = new ChatHandler({
  model: openai('gpt-4o'),
  // tools: predefinedTools,  // Optional
  // instructions: "Default system instructions"  // Optional
});

/**
 * POST endpoint handler for chat requests
 * @param {Request} req - Incoming request object
 * @returns {Promise<Response>} Chat response
 */
export async function POST(req: Request) {
  return handler.processRequest(req);
}

// Optionally add a way to clear history
export async function DELETE() {
  handler.clearHistory();
  return new Response('History cleared', { status: 200 });
}
```

# Add Voice Support to AI Assistant

You just need to add a voice endpoint to your server-side API route.

```ts
import { AiAssistant } from '@openassistant/ui';

function App() {
  
  return (
    <div>
      <AiAssistant 
        // chatEndpoint is the API route that handles the chat requests
        chatEndpoint='/api/chat'
        // voiceEndpoint is the API route that handles the voice requests
        voiceEndpoint='/api/voice'
        // model, token, temperature, etc. can be configured on the server-side
        welcomeMessage="Hello, I am your AI Assistant. How can I assist you today?"
      />
    </div>
  );
}
```

The voice endpoint is the API route that handles the voice requests.

```ts
// app/api/voice/route.ts
import { WhisperVoiceHandler } from '@openassistant/core';

// initialize the voice handler with your OpenAI API key
const whisperHandler = new WhisperVoiceHandler({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  return whisperHandler.processRequest(req);
}
```

If you want to use a multimodal model, e.g. Google Gemini, you can use the `VoiceHandler` class.

```ts
// app/api/voice/route.ts
import { VoiceHandler } from '@openassistant/core';

// initialize the voice handler with your model and token
const handler = new VoiceHandler({
  provider: 'google',
  apiKey: process.env.GOOGLE_API_KEY,
  model: 'gemini-1.5-flash',
});

export async function POST(req: Request) {
  return handler.processRequest(req);
}
```
