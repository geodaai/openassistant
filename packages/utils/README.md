# @openassistant/utils

Utility functions for OpenAssistant tools.

## Installation

```bash
npm install @openassistant/utils
```

## Usage

```typescript
import { tool } from '@openassistant/utils';

// Define your tool
const myTool = tool({
  description: 'My tool description',
  parameters: z.object({
    // your parameters
  }),
  execute: async (args) => {
    // your implementation
  },
});
```

## ConversationCache

The `ConversationCache` class provides conversation-scoped caching for `ToolOutputManager` instances, enabling persistent tool outputs across multiple requests within the same conversation while maintaining isolation between different conversations.

### Conversation ID Generation

The cache uses a multi-strategy approach to generate unique conversation IDs:

1. **Message ID** (Recommended): Uses `message.id` if available
2. **Conversation/Thread/Session IDs**: Looks for `conversationId`, `threadId`, or `sessionId` properties
3. **Enhanced Message Content Hash**: Combines first 3 messages with available metadata
   - Includes timestamps, user IDs, message positions, and total message count
   - **Stability**: Once 3+ messages exist, the ID remains stable across requests
   - **Uniqueness**: Enhanced with metadata to prevent collisions between different conversations
4. **Random ID**: Last resort - generates random ID (cache won't persist across requests)

**Recommended Message Structure:**
```typescript
interface RecommendedMessage {
  id: string;              // Unique message ID (preferred)
  role: string;
  content: string;
  conversationId?: string; // Alternative: conversation identifier
  threadId?: string;       // Alternative: thread identifier  
  sessionId?: string;      // Alternative: session identifier
  timestamp?: number;      // Helps with uniqueness in Strategy 3
  createdAt?: string;      // Helps with uniqueness in Strategy 3
  userId?: string;         // Helps with uniqueness in Strategy 3
}
```

### Basic Usage

```typescript
import { ConversationCache } from '@openassistant/utils';

// Create a conversation cache with default settings
const conversationCache = new ConversationCache();

// In your API route
export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // Get conversation-scoped ToolOutputManager
  const { toolOutputManager, conversationId } = 
    await conversationCache.getToolOutputManagerForMessages(messages);
  
  // Use toolOutputManager for your tools...
}
```

### Configuration Options

```typescript
const conversationCache = new ConversationCache({
  maxConversations: 100,           // Max conversations in memory
  ttlMs: 1000 * 60 * 60 * 2,      // 2 hours TTL
  cleanupProbability: 0.1,         // 10% cleanup chance per request
  enableLogging: true,             // Enable debug logging (includes warnings)
});
```

### Advanced Usage

```typescript
// Generate conversation ID manually
const conversationId = conversationCache.generateConversationId(messages);

// Get ToolOutputManager for specific conversation
const toolOutputManager = await conversationCache.getToolOutputManager(conversationId);

// Get cache status for monitoring
const status = await conversationCache.getStatus();
console.log(status);
// {
//   totalConversations: 5,
//   conversations: [
//     { id: "a1b2c3d4", ageMinutes: 15, hasCache: true, toolOutputCount: 3 }
//   ],
//   config: { maxConversations: 100, ttlHours: 2, cleanupProbability: 0.1 }
// }

// Clear all conversations
conversationCache.clearAll();
```

### Features

- **Data isolation**: Prevents cache sharing between different users/conversations
- **Flexible ID generation**: Multiple strategies for conversation identification
- **Automatic cleanup**: Old conversations are removed based on TTL and max count
- **Memory efficient**: Probabilistic cleanup avoids performance impact
- **Type-safe**: Full TypeScript support with proper interfaces
- **Configurable**: All settings can be customized
- **Persistent**: Tool outputs persist across requests within same conversation (when using stable IDs)
