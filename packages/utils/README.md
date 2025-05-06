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
