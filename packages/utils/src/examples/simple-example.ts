// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistant, VercelAIProvider } from '../index';
import { extendedTool } from '../tool';

// Define a places tool
const placesTool = extendedTool({
  description: 'Search for places using Foursquare API',
  parameters: {
    query: 'string',
    location: 'string',
    limit: 'number',
  },
  execute: async (args, options) => {
    const { query, location, limit } = args;
    const { context } = options;
    
    // Get Foursquare token from context
    const getFSQToken = context?.getFSQToken as () => string;
    const token = getFSQToken();
    
    // Simulate API call
    const results = [
      { name: 'Coffee Shop', address: '123 Main St', rating: 4.5 },
      { name: 'Restaurant', address: '456 Oak Ave', rating: 4.2 },
      { name: 'Cafe', address: '789 Pine St', rating: 4.0 },
    ];
    
    return {
      llmResult: results.slice(0, limit),
      additionalData: { query, location, token },
    };
  },
});

// Example usage as requested by the user
export async function main() {
  // Create Vercel AI provider
  const provider = new VercelAIProvider();
  
  // Create OpenAssistant instance
  const assist = new OpenAssistant({
    provider,
    tools: { places: placesTool },
  });

  // Initialize
  await assist.initialize();

  // Use the tool as requested
  const result = await assist.getTools({
    toolName: 'places',
    context: {
      getFSQToken: () => 'your-foursquare-token-here',
    },
    parameters: {
      query: 'coffee',
      location: 'San Francisco',
      limit: 5,
    },
  });

  console.log('Result:', result);
  return result;
}

// Example with different providers
export async function openAIExample() {
  const { OpenAIProvider } = await import('../providers');
  
  const provider = new OpenAIProvider({
    apiKey: 'your-openai-api-key',
    model: 'gpt-4',
  });
  
  const assist = new OpenAssistant({
    provider,
    tools: { places: placesTool },
  });

  await assist.initialize();

  const result = await assist.getTools({
    toolName: 'places',
    context: {
      getFSQToken: () => 'your-foursquare-token-here',
    },
    parameters: {
      query: 'restaurants',
      location: 'New York',
      limit: 3,
    },
  });

  console.log('OpenAI Result:', result);
  return result;
}

