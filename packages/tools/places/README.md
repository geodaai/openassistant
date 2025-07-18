# @openassistant/places

The Places tools for OpenAssistant, providing access to Foursquare Places API for location-based place searches.

## Installation

```bash
npm install @openassistant/places
```

## Usage

### Basic Usage

```typescript
import { placeSearch, getPlacesTool, PlacesToolNames } from '@openassistant/places';
import { convertToVercelAiTool } from '@openassistant/utils';

const placeSearchTool = getPlacesTool(PlacesToolNames.placeSearch, {
  toolContext: {
    getFsqToken: () => process.env.FSQ_TOKEN!,
  },
});

// Use with Vercel AI SDK
const tools = {
  placeSearch: convertToVercelAiTool(placeSearchTool),
};
```

### Example with AI Chat

```typescript
import { getPlacesTool, PlacesToolNames } from '@openassistant/places';
import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const toolResultCache = ToolCache.getInstance();

const placeSearchTool = getPlacesTool(PlacesToolNames.placeSearch, {
  toolContext: {
    getFsqToken: () => process.env.FSQ_TOKEN!,
  },
  onToolCompleted: (toolCallId, additionalData) => {
    toolResultCache.addDataset(toolCallId, additionalData);
  },
});

const result = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: 'Find coffee shops near Times Square',
  tools: {
    placeSearch: convertToVercelAiTool(placeSearchTool),
  },
});
```

## Tools

### placeSearch

Search for places using the Foursquare Places API. You can search by name, category, or other criteria within a specified location or area.

**Parameters:**
- `query` (string): The search query (e.g., "coffee", "restaurant", "hotel")
- `location` (object, optional): The location to search around
  - `longitude` (number): The longitude of the search center point
  - `latitude` (number): The latitude of the search center point
  - `radius` (number, optional): The search radius in meters
- `near` (string, optional): A geocodable locality to search near (e.g., "New York, NY")
- `categories` (string[], optional): Array of category IDs to filter by
- `limit` (number, optional): Maximum number of results to return (default: 20)
- `sort` (string, optional): Sort order for results - "RATING", "DISTANCE", or "NAME" (default: "RATING")

**Example prompts:**
- "Find coffee shops near Times Square"
- "Search for restaurants within 2km of the Eiffel Tower"
- "What are the best rated hotels in San Francisco?"
- "Find gas stations near me"

## Configuration

You need to provide a Foursquare API token through the tool context:

```typescript
const toolContext = {
  getFsqToken: () => process.env.FSQ_TOKEN!,
};
```

## API Reference

### getPlacesTool(toolName, options)

Get a single Places tool.

**Parameters:**
- `toolName` (string): The name of the tool to get
- `options` (object, optional):
  - `toolContext` (FoursquareToolContext): The tool context with Foursquare token
  - `onToolCompleted` (function): Callback for tool completion
  - `isExecutable` (boolean): Whether the tool is executable (default: true)

### getPlacesTools(toolContext, onToolCompleted, isExecutable)

Get all Places tools.

**Parameters:**
- `toolContext` (FoursquareToolContext): The tool context with Foursquare token
- `onToolCompleted` (function): Callback for tool completion
- `isExecutable` (boolean): Whether tools are executable (default: true)

## License

MIT 