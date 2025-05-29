import { ToolOutputManager } from './tool-output-manager';

export interface ConversationCacheConfig {
  /** Maximum number of conversations to keep in memory (default: 100) */
  maxConversations?: number;
  /** Time-to-live for conversations in milliseconds (default: 2 hours) */
  ttlMs?: number;
  /** Probability of triggering cleanup on each access (default: 0.1 = 10%) */
  cleanupProbability?: number;
  /** Whether to enable debug logging (default: false) */
  enableLogging?: boolean;
}

export interface ConversationInfo {
  id: string;
  ageMinutes: number;
  hasCache: boolean;
  toolOutputCount?: number;
}

export interface ConversationCacheStatus {
  totalConversations: number;
  conversations: ConversationInfo[];
  config: {
    maxConversations: number;
    ttlHours: number;
    cleanupProbability: number;
  };
}

// Type for chat messages
export interface ChatMessage {
  role: string;
  content: string;
  [key: string]: unknown;
}

/**
 * ConversationCache manages ToolOutputManager instances per conversation,
 * providing persistent caching across requests within the same conversation
 * while maintaining isolation between different conversations.
 */
export class ConversationCache {
  private conversationCaches = new Map<string, ToolOutputManager>();
  private conversationTimestamps = new Map<string, number>();
  private config: Required<ConversationCacheConfig>;

  constructor(config: ConversationCacheConfig = {}) {
    this.config = {
      maxConversations: config.maxConversations ?? 100,
      ttlMs: config.ttlMs ?? 1000 * 60 * 60 * 2, // 2 hours
      cleanupProbability: config.cleanupProbability ?? 0.1, // 10%
      enableLogging: config.enableLogging ?? false,
    };
  }

  /**
   * Simple hash function that works in both browser and Node.js
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0').substring(0, 16);
  }

  /**
   * Get or create a ToolOutputManager for the given conversation ID.
   */
  async getToolOutputManager(
    conversationId: string
  ): Promise<ToolOutputManager> {
    // Probabilistic cleanup to avoid performance impact
    if (Math.random() < this.config.cleanupProbability) {
      this.cleanupOldConversations();
    }

    // Get existing or create new ToolOutputManager
    let toolOutputManager = this.conversationCaches.get(conversationId);
    if (!toolOutputManager) {
      toolOutputManager = new ToolOutputManager();
      this.conversationCaches.set(conversationId, toolOutputManager);
      if (this.config.enableLogging) {
        console.log(
          `ConversationCache: Created new ToolOutputManager for conversation: ${conversationId}`
        );
      }
    } else {
      if (this.config.enableLogging) {
        console.log(
          `ConversationCache: Reusing existing ToolOutputManager for conversation: ${conversationId}`
        );
      }
    }

    // Update timestamp
    this.conversationTimestamps.set(conversationId, Date.now());

    return toolOutputManager;
  }

  /**
   * Clean up old conversations based on TTL and max conversation limits.
   */
  private cleanupOldConversations(): void {
    const now = Date.now();

    // Remove expired conversations
    for (const [
      conversationId,
      timestamp,
    ] of this.conversationTimestamps.entries()) {
      if (now - timestamp > this.config.ttlMs) {
        this.conversationCaches.delete(conversationId);
        this.conversationTimestamps.delete(conversationId);
        if (this.config.enableLogging) {
          console.log(
            `ConversationCache: Cleaned up expired conversation: ${conversationId}`
          );
        }
      }
    }

    // If still too many, remove oldest ones
    if (this.conversationCaches.size > this.config.maxConversations) {
      const sortedByTime = Array.from(
        this.conversationTimestamps.entries()
      ).sort(([, a], [, b]) => a - b);

      const toRemove = sortedByTime.slice(
        0,
        this.conversationCaches.size - this.config.maxConversations
      );
      for (const [conversationId] of toRemove) {
        this.conversationCaches.delete(conversationId);
        this.conversationTimestamps.delete(conversationId);
        if (this.config.enableLogging) {
          console.log(
            `ConversationCache: Cleaned up oldest conversation: ${conversationId}`
          );
        }
      }
    }
  }

  /**
   * Get status information about the conversation cache.
   */
  async getStatus(): Promise<ConversationCacheStatus> {
    const now = Date.now();
    const conversations: ConversationInfo[] = [];

    for (const [id, timestamp] of this.conversationTimestamps.entries()) {
      const toolOutputManager = this.conversationCaches.get(id);
      const toolOutputCount = toolOutputManager
        ? (await toolOutputManager.getAllToolOutputs()).length
        : 0;

      conversations.push({
        id,
        ageMinutes: Math.round((now - timestamp) / (1000 * 60)),
        hasCache: this.conversationCaches.has(id),
        toolOutputCount,
      });
    }

    return {
      totalConversations: this.conversationCaches.size,
      conversations,
      config: {
        maxConversations: this.config.maxConversations,
        ttlHours: this.config.ttlMs / (1000 * 60 * 60),
        cleanupProbability: this.config.cleanupProbability,
      },
    };
  }

  /**
   * Manually clear all conversations from the cache.
   */
  clearAll(): void {
    this.conversationCaches.clear();
    this.conversationTimestamps.clear();
    if (this.config.enableLogging) {
      console.log('ConversationCache: Cleared all conversations');
    }
  }

  /**
   * Get the current configuration.
   */
  getConfig(): Required<ConversationCacheConfig> {
    return { ...this.config };
  }
}
