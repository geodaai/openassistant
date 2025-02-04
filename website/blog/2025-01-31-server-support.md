---
slug: server-support
title: Server Support for OpenAssistant
authors: [XunLi]
tags: [openassistant, server, support, beginner-friendly]
---

OpenAssistant is a powerful tool for building AI-powered applications. However, it can be challenging to integrate it into existing server-side applications. In this blog post, we will explore how to use OpenAssistant in a server-side application.

<!--truncate-->

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
        // model, token, temperature, etc. can be moved to the server-side
        welcomeMessage="Hello, I am your AI Assistant. How can I assist you today?"
        // chatEndpoint is the API route that handles the chat requests
        chatEndpoint='/api/chat'
      />
    </div>
  );
}
```

## The Server-Side Setup

```ts
// app/api/chat/route.ts
import { ChatHandler } from '@openassistant/core';
// you can use any LLM provider you want
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const model = openai('gpt-4o');
  const handler = new ChatHandler({ 
    model,
    // tools: predefinedTools,  // Optional
    // instructions: "Default system instructions"  // Optional
  });
  return handler.processRequest(req);
}
```

