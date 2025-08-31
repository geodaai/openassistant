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

// Define a places tool that will be compatible with all providers
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

// Example 1: Demonstrate provider tool conversion (Composio style)
export async function demonstrateProviderCompatibility() {
  console.log('=== Provider Tool Compatibility Demo ===\n');

  // Test with Vercel AI Provider
  const vercelProvider = new VercelAIProvider();
  const vercelAssist = new OpenAssistant({
    provider: vercelProvider,
    tools: { places: placesTool },
  });

  await vercelAssist.initialize();

  console.log('1. Vercel AI Provider Tool Schema:');
  console.log(JSON.stringify(vercelAssist.getToolSchema('places'), null, 2));
  console.log('\n');

  // Test with OpenAI Provider
  const openaiProvider = new OpenAIProvider({
    apiKey: 'demo-key',
    model: 'gpt-4',
  });
  const openaiAssist = new OpenAssistant({
    provider: openaiProvider,
    tools: { places: placesTool },
  });

  await openaiAssist.initialize();

  console.log('2. OpenAI Provider Tool Schema:');
  console.log(JSON.stringify(openaiAssist.getToolSchema('places'), null, 2));
  console.log('\n');

  // Test with LangChain Provider
  const langchainProvider = new LangChainProvider({
    chainType: 'agent',
  });
  const langchainAssist = new OpenAssistant({
    provider: langchainProvider,
    tools: { places: placesTool },
  });

  await langchainAssist.initialize();

  console.log('3. LangChain Provider Tool Schema:');
  console.log(JSON.stringify(langchainAssist.getToolSchema('places'), null, 2));
  console.log('\n');

  // Test with Google Provider
  const googleProvider = new GoogleProvider({
    apiKey: 'demo-key',
    model: 'gemini-pro',
  });
  const googleAssist = new OpenAssistant({
    provider: googleProvider,
    tools: { places: placesTool },
  });

  await googleAssist.initialize();

  console.log('4. Google Provider Tool Schema:');
  console.log(JSON.stringify(googleAssist.getToolSchema('places'), null, 2));
  console.log('\n');

  // Test with Anthropic Provider
  const anthropicProvider = new AnthropicProvider({
    apiKey: 'demo-key',
    model: 'claude-3-sonnet',
  });
  const anthropicAssist = new OpenAssistant({
    provider: anthropicProvider,
    tools: { places: placesTool },
  });

  await anthropicAssist.initialize();

  console.log('5. Anthropic Provider Tool Schema:');
  console.log(JSON.stringify(anthropicAssist.getToolSchema('places'), null, 2));
  console.log('\n');
}

// Example 2: Dynamic provider switching (Composio style)
export async function demonstrateProviderSwitching() {
  console.log('=== Dynamic Provider Switching Demo ===\n');

  const assist = new OpenAssistant({
    provider: new VercelAIProvider(),
    tools: { places: placesTool },
  });

  await assist.initialize();

  console.log('Initial provider:', assist.getProvider().name);
  console.log('Tool schema format:', assist.getToolSchema('places')?.type);

  // Switch to OpenAI provider
  await assist.switchProvider(new OpenAIProvider({ apiKey: 'demo-key' }));
  console.log('\nSwitched to provider:', assist.getProvider().name);
  console.log('Tool schema format:', assist.getToolSchema('places')?.type);

  // Switch to Google provider
  await assist.switchProvider(new GoogleProvider({ apiKey: 'demo-key' }));
  console.log('\nSwitched to provider:', assist.getProvider().name);
  console.log('Tool schema format:', assist.getToolSchema('places')?.functionDeclarations?.[0]?.type);
}

// Example 3: Get all provider tool schemas at once
export async function demonstrateBulkSchemaRetrieval() {
  console.log('=== Bulk Schema Retrieval Demo ===\n');

  const assist = new OpenAssistant({
    provider: new VercelAIProvider(),
    tools: { places: placesTool },
  });

  await assist.initialize();

  console.log('All tool schemas:');
  console.log(JSON.stringify(assist.getAllToolSchemas(), null, 2));
}

// Example 4: Provider-specific tool execution
export async function demonstrateProviderSpecificExecution() {
  console.log('=== Provider-Specific Execution Demo ===\n');

  // Test with Vercel AI (which has execute function)
  const vercelProvider = new VercelAIProvider();
  const vercelAssist = new OpenAssistant({
    provider: vercelProvider,
    tools: { places: placesTool },
  });

  await vercelAssist.initialize();

  const providerTools = vercelAssist.getProviderTools();
  const placesProviderTool = providerTools.get('places');

  if (placesProviderTool?.execute) {
    console.log('Vercel AI Provider Tool has execute function:', !!placesProviderTool.execute);
    
    // Execute through provider tool
    const result = await placesProviderTool.execute({
      query: 'coffee',
      location: 'San Francisco',
      limit: 3,
    });
    
    console.log('Provider tool execution result:', result);
  }
}

// Main function to run all demos
export async function runAllDemos() {
  try {
    await demonstrateProviderCompatibility();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await demonstrateProviderSwitching();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await demonstrateBulkSchemaRetrieval();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await demonstrateProviderSpecificExecution();
    
  } catch (error) {
    console.error('Demo failed:', error);
  }
}

