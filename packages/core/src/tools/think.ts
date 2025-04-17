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
- If you can use the provided tools to solve the problem, please make a step-by-step plan to use the tools in a markdown format.
- If the tools are missing parameters, please ask the user to provide the parameters.
- When executing the plan, please try to fix the error if there is any.
- After executing the plan, please summarize the result and provide the result in a markdown format.
`,
        },
      },
    };
  },
});
