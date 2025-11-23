# useAssistantActions Hook

The `useAssistantActions` hook allows you to programmatically interact with the AI assistant from within your React components. This is useful when you want to trigger assistant actions from custom UI elements or integrate the assistant functionality into your own components.

## Usage

The hook must be used within an `Assistant` component that has been configured with options:

```tsx
import React from 'react';
import { Assistant, useAssistantActions, type AssistantOptions } from '@openassistant/assistant';

const config: AssistantOptions = {
  ai: {
    getInstructions: () => 'You are a helpful assistant.',
    tools: {
      // your tools here
    },
  },
};

function MyCustomComponent() {
  const {
    sendMessage,
    sendPrompt,
    startAnalysis,
    stopChat,
    restartChat,
    isProcessing,
    currentSessionId,
    messages,
    store
  } = useAssistantActions();

  const handleQuickQuery = () => {
    sendMessage("What data is available?");
  };

  const handleAnalysis = () => {
    startAnalysis("Analyze the trends in the data");
  };

  return (
    <div>
      <button onClick={handleQuickQuery} disabled={isProcessing}>
        Quick Query
      </button>
      <button onClick={handleAnalysis} disabled={isProcessing}>
        Start Analysis
      </button>
      <button onClick={stopChat} disabled={!isProcessing}>
        Stop
      </button>
      <p>Status: {isProcessing ? 'Processing...' : 'Ready'}</p>
      <p>Messages: {messages.length}</p>
    </div>
  );
}

export default function App() {
  return (
    <Assistant options={config}>
      <div className="flex">
        <div className="flex-1">
          {/* Main assistant UI will be rendered here */}
        </div>
        <div className="w-80">
          <MyCustomComponent />
        </div>
      </div>
    </Assistant>
  );
}
```

## API Reference

### Actions

- **`sendMessage(message: string)`** - Sends a text message to the assistant
- **`sendPrompt(prompt: string, options?: { temperature?: number })`** - Sends a prompt with optional temperature setting
- **`startAnalysis(query: string)`** - Starts an analysis with the given query
- **`stopChat()`** - Stops the current chat processing
- **`restartChat()`** - Restarts the chat session

### State

- **`isProcessing: boolean`** - Whether the assistant is currently processing a request
- **`currentSessionId: string | null`** - The current session ID
- **`messages: Array`** - Array of messages in the current session
- **`store`** - Raw access to the underlying Zustand store for advanced use cases

## Important Notes

1. The hook must be used within an `Assistant` component that has been configured with options
2. If no options are provided to the `Assistant` component, the hook will throw an error
3. The exact available actions depend on the AI slice implementation from `@sqlrooms/ai-core`
4. Some actions may not be available depending on the assistant configuration

## Error Handling

The hook will throw descriptive errors if:
- It's used outside of an `Assistant` component
- The `Assistant` component wasn't configured with options
- Specific actions are not available in the current AI slice implementation

```tsx
try {
  sendMessage("Hello");
} catch (error) {
  console.error("Failed to send message:", error.message);
}
```
