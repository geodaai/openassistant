# @openassistant/types

Type definitions for OpenAssistant tools.

## Installation

```bash
npm install @openassistant/types
# or
yarn add @openassistant/types
```

## Usage

```typescript
import { tool, ExtendedTool } from '@openassistant/types';

// Define your tool
const myTool = tool({
  description: 'My tool description',
  parameters: z.object({
    // your parameters
  }),
  execute: async (args) => {
    // your implementation
  }
});
``` 