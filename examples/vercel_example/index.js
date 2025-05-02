import dotenv from 'dotenv';
import { ToolManager } from '@openassistant/tool';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Load environment variables
dotenv.config();

const key = process.env.OPENAI_API_KEY;

async function main() {
  console.log('Initializing ToolManager Example...');

  // Initialize ToolManager
  const toolManager = new ToolManager();

  await toolManager.loadPackage('@openassistant/echarts/dist/index.cjs');

  // Register a simple calculator tool
  const context = {
    getValues: (datasetName, variableName) => {
      console.log('getValues', datasetName, variableName);
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    },
  };
  const histogram = toolManager.getTool('histogram', context);

  // use tool in vercel ai
  const model = openai('gpt-4o', { apiKey: key });

  const result = await generateText({
    model,
    system:
      'You are a helpful assistant that can use tools to get information.',
    prompt: 'create a histogram of HR60 in dataset Natregimes',
    tools: {
      histogram,
    },
  });

  console.log(result);
}

main().catch(console.error);
