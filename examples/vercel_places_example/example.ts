// Example usage of the placeSearch tool
import { getPlacesTool, PlacesToolNames } from '@openassistant/places';
import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';

// Example: Setting up the placeSearch tool
const toolResultCache = ToolCache.getInstance();

const placeSearchTool = getPlacesTool(PlacesToolNames.placeSearch, {
  toolContext: {
    getFsqToken: () => process.env.FSQ_TOKEN!,
  },
  onToolCompleted: (toolCallId, additionalData) => {
    toolResultCache.addDataset(toolCallId, additionalData);
    console.log('Place search completed:', toolCallId, additionalData);
  },
});

// Example: Using with Vercel AI SDK
const tools = {
  placeSearch: convertToVercelAiTool(placeSearchTool),
};

// Example: Sample queries that would work with this tool
const sampleQueries = [
  "Find coffee shops near Times Square",
  "Search for restaurants within 2km of the Eiffel Tower",
  "What are the best rated hotels in San Francisco?",
  "Find gas stations near me",
  "Show me pizza places in New York",
  "Find museums near Central Park",
];

console.log('Place Search Tool Example');
console.log('Available queries:', sampleQueries);
console.log('Tool configured with Foursquare API token'); 