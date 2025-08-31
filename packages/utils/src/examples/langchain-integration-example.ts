// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistant, LangChainProvider } from '../index';
import { convertToLangChainTool, convertFromLangChainTool } from '../langchain-tool';
import { extendedTool } from '../tool';

// Define a places tool that will be compatible with LangChain
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

// Example 1: Using OpenAssistant with LangChain Provider
export async function openAssistantWithLangChain() {
  console.log('=== OpenAssistant with LangChain Provider ===\n');

  const provider = new LangChainProvider({
    chainType: 'agent',
  });
  
  const assist = new OpenAssistant({
    provider,
    tools: { places: placesTool },
  });

  await assist.initialize();

  // Get the LangChain tool schema
  const toolSchema = assist.getToolSchema('places');
  console.log('LangChain Tool Schema:');
  console.log(JSON.stringify(toolSchema, null, 2));
  console.log('\n');

  // Execute the tool through OpenAssistant
  const result = await assist.getTools({
    toolName: 'places',
    context: {
      getFSQToken: () => 'your-foursquare-token',
    },
    parameters: {
      query: 'coffee',
      location: 'San Francisco',
      limit: 3,
    },
  });

  console.log('Tool Execution Result:');
  console.log(JSON.stringify(result, null, 2));
  console.log('\n');
}

// Example 2: Direct LangChain Tool Conversion
export async function directLangChainConversion() {
  console.log('=== Direct LangChain Tool Conversion ===\n');

  // Convert the extended tool to LangChain format
  const langchainTool = convertToLangChainTool(placesTool, { isExecutable: true });
  
  console.log('Converted LangChain Tool:');
  console.log(JSON.stringify(langchainTool, null, 2));
  console.log('\n');

  // Test the converted tool
  if (langchainTool.func) {
    const result = await langchainTool.func({
      query: 'restaurants',
      location: 'New York',
      limit: 2,
    });
    
    console.log('Direct Tool Execution Result:');
    console.log(JSON.stringify(result, null, 2));
    console.log('\n');
  }
}

// Example 3: Converting Back from LangChain Tool
export async function convertFromLangChain() {
  console.log('=== Converting Back from LangChain Tool ===\n');

  // First convert to LangChain format
  const langchainTool = convertToLangChainTool(placesTool);
  
  // Then convert back to ExtendedTool format
  const convertedBackTool = convertFromLangChainTool(langchainTool);
  
  console.log('Original Tool Description:', placesTool.description);
  console.log('Converted Back Tool Description:', convertedBackTool.description);
  console.log('\n');

  // Test the converted back tool
  const result = await convertedBackTool.execute({
    query: 'parks',
    location: 'Los Angeles',
    limit: 1,
  }, {
    toolCallId: 'test-conversion',
    context: { getFSQToken: () => 'test-token' },
  });

  console.log('Converted Back Tool Execution Result:');
  console.log(JSON.stringify(result, null, 2));
  console.log('\n');
}

// Example 4: LangChain Provider Tool Registry
export async function langChainProviderRegistry() {
  console.log('=== LangChain Provider Tool Registry ===\n');

  const provider = new LangChainProvider({
    chainType: 'agent',
  });
  
  const assist = new OpenAssistant({
    provider,
    tools: { places: placesTool },
  });

  await assist.initialize();

  // Get provider-specific tools
  const providerTools = assist.getProviderTools();
  const placesProviderTool = providerTools.get('places');

  if (placesProviderTool) {
    console.log('Provider Tool Details:');
    console.log('Name:', placesProviderTool.name);
    console.log('Description:', placesProviderTool.description);
    console.log('Has Execute Function:', !!placesProviderTool.execute);
    console.log('\n');

    // Execute through provider tool
    if (placesProviderTool.execute) {
      const result = await placesProviderTool.execute({
        query: 'libraries',
        location: 'Boston',
        limit: 1,
      });
      
      console.log('Provider Tool Execution Result:');
      console.log(JSON.stringify(result, null, 2));
      console.log('\n');
    }
  }
}

// Example 5: LangChain Tool Metadata
export async function langChainToolMetadata() {
  console.log('=== LangChain Tool Metadata ===\n');

  const provider = new LangChainProvider({
    chainType: 'conversation',
  });
  
  const assist = new OpenAssistant({
    provider,
    tools: { places: placesTool },
  });

  await assist.initialize();

  // Get tool metadata
  const metadata = await assist.getToolMetadata('places');
  console.log('Tool Metadata:');
  console.log(JSON.stringify(metadata, null, 2));
  console.log('\n');

  // Get available tools
  const availableTools = await assist.getAvailableTools();
  console.log('Available Tools:', availableTools);
  console.log('\n');
}

// Example 6: LangChain Tool with Context
export async function langChainToolWithContext() {
  console.log('=== LangChain Tool with Context ===\n');

  const provider = new LangChainProvider({
    chainType: 'llm',
  });
  
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

  // Execute with default context
  const result1 = await assist.getTools({
    toolName: 'places',
    parameters: {
      query: 'hotels',
      location: 'Miami',
      limit: 2,
    },
  });

  console.log('Result with Default Context:');
  console.log(JSON.stringify(result1, null, 2));
  console.log('\n');

  // Execute with custom context
  const result2 = await assist.getTools({
    toolName: 'places',
    context: {
      getFSQToken: () => 'custom-token',
      apiVersion: 'v3',
    },
    parameters: {
      query: 'museums',
      location: 'Chicago',
      limit: 1,
    },
  });

  console.log('Result with Custom Context:');
  console.log(JSON.stringify(result2, null, 2));
  console.log('\n');
}

// Main function to run all LangChain examples
export async function runAllLangChainExamples() {
  try {
    await openAssistantWithLangChain();
    console.log('='.repeat(50) + '\n');
    
    await directLangChainConversion();
    console.log('='.repeat(50) + '\n');
    
    await convertFromLangChain();
    console.log('='.repeat(50) + '\n');
    
    await langChainProviderRegistry();
    console.log('='.repeat(50) + '\n');
    
    await langChainToolMetadata();
    console.log('='.repeat(50) + '\n');
    
    await langChainToolWithContext();
    
  } catch (error) {
    console.error('LangChain example failed:', error);
  }
}
