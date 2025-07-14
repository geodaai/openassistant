// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

interface ToolOutput {
  toolCallId: string;
  data: unknown;
  sessionId?: string; // Track which request session this output belongs to
}

/**
 * Simple async mutex implementation for both client and server side
 */
class AsyncMutex {
  private queue: (() => void)[] = [];
  private locked = false;

  async acquire(): Promise<() => void> {
    return new Promise((resolve) => {
      const release = () => {
        this.locked = false;
        const next = this.queue.shift();
        if (next) {
          this.locked = true;
          next();
        }
      };

      const task = () => resolve(release);

      if (this.locked) {
        this.queue.push(task);
      } else {
        this.locked = true;
        task();
      }
    });
  }
}

/**
 * ToolOutputManager handles storage and retrieval of tool execution results
 * Works on both client and server side with mutex protection for concurrent access
 */
export class ToolOutputManager {
  private toolOutputs: ToolOutput[] = [];
  private mutex = new AsyncMutex();
  private currentSessionId: string | null = null;

  /**
   * Start a new request session to track tool outputs for this specific request
   */
  async startSession(): Promise<string> {
    const release = await this.mutex.acquire();
    try {
      this.currentSessionId = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
      return this.currentSessionId;
    } finally {
      release();
    }
  }

  /**
   * End the current request session
   */
  async endSession(): Promise<void> {
    const release = await this.mutex.acquire();
    try {
      this.currentSessionId = null;
    } finally {
      release();
    }
  }

  /**
   * Add a tool output to the manager
   * @param toolCallId - Unique identifier for the tool call
   * @param data - Data returned by the tool
   */
  async addToolOutput(toolCallId: string, data: unknown): Promise<void> {
    const release = await this.mutex.acquire();
    try {
      this.toolOutputs.push({ 
        toolCallId, 
        data, 
        sessionId: this.currentSessionId || undefined 
      });
    } finally {
      release();
    }
  }

  /**
   * Get the most recent tool output
   * @returns The last tool output or null if none exists
   */
  async getLastToolOutput(): Promise<ToolOutput | null> {
    const release = await this.mutex.acquire();
    try {
      return this.toolOutputs.length > 0 
        ? this.toolOutputs[this.toolOutputs.length - 1] 
        : null;
    } finally {
      release();
    }
  }

  /**
   * Get the most recent tool output from the current session only
   * @returns The last tool output from current session or null if none exists
   */
  async getLastToolOutputFromCurrentSession(): Promise<ToolOutput | null> {
    const release = await this.mutex.acquire();
    try {
      if (!this.currentSessionId) return null;
      
      // Find the last tool output from the current session
      for (let i = this.toolOutputs.length - 1; i >= 0; i--) {
        const output = this.toolOutputs[i];
        if (output.sessionId === this.currentSessionId) {
          return output;
        }
      }
      return null;
    } finally {
      release();
    }
  }

  /**
   * Check if there are any tool outputs from the current session
   * @returns True if there are tool outputs from current session, false otherwise
   */
  async hasToolOutputsInCurrentSession(): Promise<boolean> {
    const release = await this.mutex.acquire();
    try {
      if (!this.currentSessionId) return false;
      
      return this.toolOutputs.some(output => output.sessionId === this.currentSessionId);
    } finally {
      release();
    }
  }

  /**
   * Get all tool outputs from the current session
   * @returns Array of tool outputs from current session
   */
  async getToolOutputsFromCurrentSession(): Promise<ToolOutput[]> {
    const release = await this.mutex.acquire();
    try {
      if (!this.currentSessionId) return [];
      
      return this.toolOutputs.filter(output => output.sessionId === this.currentSessionId);
    } finally {
      release();
    }
  }

  /**
   * Find data by dataset name from all stored tool outputs
   * Searches through all tool outputs for objects containing the dataset name as a key
   * @param datasetName - Name of the dataset to search for
   * @returns The data associated with the dataset name, or null if not found
   */
  async findDataByDatasetName(datasetName: string): Promise<unknown | null> {
    const release = await this.mutex.acquire();
    try {
      for (const toolOutput of this.toolOutputs) {
        const { data } = toolOutput;
        
        // Check if data is an object and contains the dataset name as a key
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          const dataObj = data as Record<string, unknown>;
          if (datasetName in dataObj) {
            return dataObj[datasetName];
          }
        }
      }
      return null;
    } finally {
      release();
    }
  }

  /**
   * Get all tool outputs (for debugging/admin purposes)
   * @returns Array of all tool outputs
   */
  async getAllToolOutputs(): Promise<ToolOutput[]> {
    const release = await this.mutex.acquire();
    try {
      return [...this.toolOutputs]; // Return a copy to prevent external mutation
    } finally {
      release();
    }
  }

  /**
   * Clear all tool outputs
   */
  async clearAll(): Promise<void> {
    const release = await this.mutex.acquire();
    try {
      this.toolOutputs = [];
    } finally {
      release();
    }
  }

  /**
   * Check if there are any tool outputs stored
   * @returns True if there are tool outputs, false otherwise
   */
  async hasToolOutputs(): Promise<boolean> {
    const release = await this.mutex.acquire();
    try {
      return this.toolOutputs.length > 0;
    } finally {
      release();
    }
  }

  /**
   * Create an onToolCompleted callback function for use with tools
   * @returns A callback function that can be used with tool configurations
   */
  createOnToolCompletedCallback() {
    return async (toolCallId: string, data?: unknown) => {
      if (data !== undefined) {
        await this.addToolOutput(toolCallId, data);
      }
    };
  }
} 