// Simple test script for webSearch tool
// Run with: node test-websearch.js

const { webSearch } = require('@openassistant/places');

async function testWebSearch() {
  console.log('🧪 Testing webSearch tool...');
  
  try {
    // Create a mock context with a test API key
    const mockContext = {
      getSearchAPIKey: () => 'test-api-key',
    };

    // Test the tool with a simple query
    const result = await webSearch.execute(
      {
        query: 'artificial intelligence',
        engine: 'google',
        num: 5,
      },
      {
        context: mockContext,
      }
    );

    console.log('✅ webSearch tool executed successfully');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (result.llmResult.success) {
      console.log('✅ Search was successful');
      console.log('Dataset name:', result.llmResult.datasetName);
      console.log('Query:', result.llmResult.query);
    } else {
      console.log('❌ Search failed:', result.llmResult.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testWebSearch(); 