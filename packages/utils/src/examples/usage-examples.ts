// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistant } from '../openassistant';
import {
  VercelAIProvider,
  OpenAIProvider,
  LangChainProvider,
  GoogleProvider,
  AnthropicProvider,
} from '../providers';
import { extendedTool } from '../tool';

// Example tool definition
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
    ];
    
    return {
      llmResult: results.slice(0, limit),
      additionalData: { query, location, token },
    };
  },
});

// Example 1: Using Vercel AI Provider
export async function vercelAIExample() {
  const provider = new VercelAIProvider();
  const assist = new OpenAssistant({
    provider,
    tools: { places: placesTool },
  });

  await assist.initialize();

  const result = await assist.getTools({
    toolName: 'places',
    context: {
      getFSQToken: () => 'your-foursquare-token',
    },
    parameters: {
      query: 'coffee',
      location: 'San Francisco',
      limit: 5,
    },
  });

  console.log('Vercel AI Result:', result);
}

// Example 2: Using OpenAI Provider
export async function openAIExample() {
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
      getFSQToken: () => 'your-foursquare-token',
    },
    parameters: {
      query: 'restaurants',
      location: 'New York',
      limit: 3,
    },
  });

  console.log('OpenAI Result:', result);
}

// Example 3: Using LangChain Provider
export async function langChainExample() {
  const provider = new LangChainProvider({
    chainType: 'agent',
  });
  
  const assist = new OpenAssistant({
    provider,
    tools: { places: placesTool },
  });

  await assist.initialize();

  const result = await assist.getTools({
    toolName: 'places',
    context: {
      getFSQToken: () => 'your-foursquare-token',
    },
    parameters: {
      query: 'parks',
      location: 'Los Angeles',
      limit: 4,
    },
  });

  console.log('LangChain Result:', result);
}

// Example 4: Using Google Provider
export async function googleExample() {
  const provider = new GoogleProvider({
    apiKey: 'your-google-api-key',
    model: 'gemini-pro',
    projectId: 'your-project-id',
  });
  
  const assist = new OpenAssistant({
    provider,
    tools: { places: placesTool },
  });

  await assist.initialize();

  const result = await assist.getTools({
    toolName: 'places',
    context: {
      getFSQToken: () => 'your-foursquare-token',
    },
    parameters: {
      query: 'museums',
      location: 'Chicago',
      limit: 6,
    },
  });

  console.log('Google Result:', result);
}

// Example 5: Using Anthropic Provider
export async function anthropicExample() {
  const provider = new AnthropicProvider({
    apiKey: 'your-anthropic-api-key',
    model: 'claude-3-sonnet',
  });
  
  const assist = new OpenAssistant({
    provider,
    tools: { places: placesTool },
  });

  await assist.initialize();

  const result = await assist.getTools({
    toolName: 'places',
    context: {
      getFSQToken: () => 'your-foursquare-token',
    },
    parameters: {
      query: 'libraries',
      location: 'Boston',
      limit: 2,
    },
  });

  console.log('Anthropic Result:', result);
}

// Example 6: Dynamic tool registration
export async function dynamicToolRegistrationExample() {
  const provider = new VercelAIProvider();
  const assist = new OpenAssistant({ provider });

  // Register tools dynamically
  assist.registerTool('places', placesTool);
  
  // Register additional tools
  const weatherTool = extendedTool({
    description: 'Get weather information for a location',
    parameters: {
      location: 'string',
      units: 'string',
    },
    execute: async (args) => {
      const { location, units } = args;
      return {
        llmResult: {
          location,
          temperature: 72,
          condition: 'Sunny',
          units,
        },
      };
    },
  });

  assist.registerTool('weather', weatherTool);

  await assist.initialize();

  // Use multiple tools
  const placesResult = await assist.getTools({
    toolName: 'places',
    context: { getFSQToken: () => 'token' },
    parameters: { query: 'cafes', location: 'Seattle', limit: 3 },
  });

  const weatherResult = await assist.getTools({
    toolName: 'weather',
    parameters: { location: 'Seattle', units: 'fahrenheit' },
  });

  console.log('Places:', placesResult);
  console.log('Weather:', weatherResult);
}

// Example 7: Using default context
export async function defaultContextExample() {
  const provider = new VercelAIProvider();
  const assist = new OpenAssistant({
    provider,
    tools: { places: placesTool },
    defaultContext: {
      getFSQToken: () => 'default-foursquare-token',
      apiVersion: 'v2',
      language: 'en',
    },
  });

  await assist.initialize();

  // Context will automatically include default values
  const result = await assist.getTools({
    toolName: 'places',
    context: {
      // Override default token
      getFSQToken: () => 'custom-token',
    },
    parameters: {
      query: 'hotels',
      location: 'Miami',
      limit: 4,
    },
  });

  console.log('Default Context Result:', result);
}

