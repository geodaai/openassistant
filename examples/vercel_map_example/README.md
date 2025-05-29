# Vercel Map Example

## Conversation-Scoped Caching

This example implements a conversation-scoped caching system that maintains tool outputs across multiple requests within the same conversation, while keeping different conversations isolated.

### How it Works

1. **Conversation ID Generation**: Each conversation gets a unique ID using a multi-strategy approach:
   - **Preferred**: Uses `message.id` if available for maximum uniqueness
   - **Fallback**: Uses conversation/thread/session IDs from message properties
   - **Last resort**: Content-based hashing (with warnings about potential collisions)
2. **Cache Persistence**: Tool outputs are cached per conversation and persist across requests
3. **Data Isolation**: Different conversations have completely separate caches
4. **Automatic Cleanup**: Old conversations are automatically cleaned up to prevent memory leaks

### Important: Message Structure

For proper data isolation, ensure your messages include unique identifiers:

```typescript
// Recommended message structure
const messages = [
  {
    id: "msg_unique_123",        // Unique message ID (preferred)
    role: "user",
    content: "Download census data",
    conversationId: "conv_456",  // Alternative: conversation ID
  }
];
```

**⚠️ Warning**: Without unique message IDs, users starting conversations with identical messages (e.g., "hi") could share the same cache, creating privacy issues.

### Features

- **Cross-request caching**: Tools can access data from previous requests in the same conversation
- **Data isolation**: Prevents cache sharing between different users/conversations
- **Memory management**: Automatic cleanup of old conversations (2-hour TTL, max 100 conversations)
- **Debug endpoint**: Visit `/api/chat` with GET request to see cache status
- **Logging**: Console logs show cache hits/misses and conversation activity

### Cache Configuration

- **TTL**: 2 hours (configurable via `CONVERSATION_TTL`)
- **Max conversations**: 100 (configurable via `MAX_CONVERSATIONS`)
- **Cleanup frequency**: 10% chance per request

### Example Usage

1. **First request**: "Download census data for California"
   - Creates conversation cache
   - Downloads and caches census data

2. **Second request**: "Create a map visualization with that data" 
   - Reuses cached census data from previous request
   - No need to re-download

### Monitoring

- Check cache status: `GET /api/chat`
- Console logs show conversation IDs and cache activity
- Debug info includes conversation age and cache hit counts
