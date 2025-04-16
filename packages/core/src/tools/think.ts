import { z } from 'zod';
import { tool } from '../utils/create-assistant';

export const think = tool({
  parameters: z.object({
    question: z.string().describe('The question to think about'),
  }),
  execute: async ({ question }) => {
    return {
      llmResult: {
        success: true,
        result: {
          question,
          instruction: `
- Before executing the plan, please summarize the plan for using the tools.
- If the tools are missing parameters, please ask the user to provide the parameters.
- When executing the plan, please try to fix the error if there is any.
- After executing the plan, please summarize the result and provide the result in a markdown format.
`,
        },
      },
    };
  },
});
