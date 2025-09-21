# OpenAssistant Tool Migration Guide

This document explains how to migrate from the old `ExtendedTool` pattern to the new `OpenAssistantTool` class-based approach.

## Overview

The new `OpenAssistantTool` abstract class provides a cleaner, more maintainable way to define tools. All tools now inherit from this base class and provide their own implementation.

## Migration Steps

### 1. Old Pattern (ExtendedTool)

```typescript
import { extendedTool } from '@openassistant/utils';
import { z } from 'zod';

export const myTool = extendedTool({
  description: 'My tool description',
  parameters: z.object({
    param1: z.string(),
    param2: z.number().optional(),
  }),
  execute: async (args, options) => {
    // Tool implementation
    return {
      llmResult: { success: true },
      additionalData: { /* ... */ }
    };
  },
  context: {
    // Context implementation
  },
});

export type MyTool = typeof myTool;
```

### 2. New Pattern (OpenAssistantTool)

```typescript
import { OpenAssistantTool, z } from '@openassistant/utils';

export class MyTool extends OpenAssistantTool<typeof MyToolArgs> {
  constructor(
    context: MyToolContext = {
      // Default context implementation
    },
    component?: React.ReactNode,
    onToolCompleted?: (toolCallId: string, additionalData?: unknown) => void
  ) {
    super(
      'My tool description',
      MyToolArgs,
      context,
      component,
      onToolCompleted
    );
  }

  async execute(
    params: z.infer<typeof MyToolArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<ExecuteFunctionResult> {
    // Tool implementation
    return {
      llmResult: { success: true },
      additionalData: { /* ... */ }
    };
  }
}

export const MyToolArgs = z.object({
  param1: z.string(),
  param2: z.number().optional(),
});

// For backward compatibility, create a default instance
export const myTool = new MyTool();

export type { MyTool };
```

## Key Changes

1. **Class-based approach**: Tools are now classes that extend `OpenAssistantTool`
2. **Constructor pattern**: Context and other options are passed to the constructor
3. **Abstract execute method**: Each tool must implement its own `execute` method
4. **Type safety**: Better TypeScript support with proper generics
5. **Backward compatibility**: Default instances are exported for existing code

## Usage Examples

### Basic Usage

```typescript
import { MyTool } from '@openassistant/tools';

// Create a tool instance with custom context
const myToolInstance = new MyTool({
  customContext: 'value'
});

// Use the tool
const result = await myToolInstance.execute({
  param1: 'value',
  param2: 42
});
```

### With Vercel AI SDK

```typescript
import { MyTool } from '@openassistant/tools';
import { generateText } from 'ai';

const myTool = new MyTool({
  // context
});

// Convert to Vercel AI tool (requires 'ai' package)
const vercelTool = myTool.toVercelAiTool();

generateText({
  model: openai('gpt-4'),
  prompt: 'Use my tool',
  tools: { myTool: vercelTool }
});
```

### With React Components

```typescript
import { MyTool } from '@openassistant/tools';
import { MyToolComponent } from './MyToolComponent';

const myTool = new MyTool(
  { /* context */ },
  <MyToolComponent /> // React component
);
```

## Benefits

1. **Better organization**: Each tool is a self-contained class
2. **Type safety**: Full TypeScript support with generics
3. **Reusability**: Easy to create multiple instances with different contexts
4. **Extensibility**: Easy to add new methods and properties
5. **Testing**: Easier to mock and test individual tools
6. **Documentation**: Better IDE support and documentation generation

## Migration Checklist

- [ ] Convert `extendedTool` calls to class definitions
- [ ] Move parameters to separate `Args` schema
- [ ] Implement `execute` method
- [ ] Update constructor to accept context and options
- [ ] Export class and create backward-compatible instance
- [ ] Update imports in consuming code
- [ ] Test tool functionality
- [ ] Update documentation and examples