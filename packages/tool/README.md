# @openassistant/tool

A tool management library for OpenAssistant that provides a flexible way to manage and execute tools with context and result tracking.

## Installation

```bash
npm install @openassistant/tool
```

## Usage

```typescript
import ToolManager from '@openassistant/tool';

// Create a function to find tools by name
const findTool = (name: string) => {
  // Your tool lookup logic here
  return (args: any, options: any, context: any) => {
    // Tool implementation
    return result;
  };
};

// Create a tool manager instance
const toolManager = new ToolManager(findTool);

// Get a tool with context
const tool = toolManager.getTool('myTool', { someContext: 'value' });

// Execute the tool
const result = tool({ arg1: 'value' }, { toolCallId: 'unique-id' });

// Retrieve result later
const storedResult = toolManager.getToolResult('unique-id');
```

## API

### ToolManager

The main class for managing tools.

#### Constructor

```typescript
constructor(findToolFn: (name: string) => ToolFunction)
```

- `findToolFn`: A function that takes a tool name and returns the tool function.

#### Methods

- `getTool(name: string, context: ToolContext, component?: any)`: Returns a wrapped tool function.
- `getToolResult(toolCallId: string)`: Retrieves a stored tool result.
- `getComponent(toolName: string)`: Retrieves a component associated with a tool.

### Types

- `ToolContext`: Interface for tool context objects.
- `ToolOptions`: Interface for tool options, including optional `toolCallId`.
- `ToolFunction`: Type for tool functions.

## License

MIT 