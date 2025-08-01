# @openassistant/places

The Places tools for OpenAssistant, providing access to Foursquare Places API for location-based place searches.

## Installation

```bash
npm install @openassistant/places
```

## Usage

### Basic Usage

```typescript
import { placeSearch, geotagging, getPlacesTool, PlacesToolNames } from '@openassistant/places';
import { convertToVercelAiTool } from '@openassistant/utils';

const placeSearchTool = getPlacesTool(PlacesToolNames.placeSearch, {
  toolContext: {
    getFsqToken: () => process.env.FSQ_TOKEN!,
  },
});

const geotaggingTool = getPlacesTool(PlacesToolNames.geotagging, {
  toolContext: {
    getFsqToken: () => process.env.FSQ_TOKEN!,
  },
});

// Use with Vercel AI SDK
const tools = {
  placeSearch: convertToVercelAiTool(placeSearchTool),
  geotagging: convertToVercelAiTool(geotaggingTool),
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

### geotagging

Use Foursquare's Snap to Place technology to detect where your user's device is and what is around them. Returns geotagging candidates based on location coordinates with comprehensive place information.

**Parameters:**
- `ll` (string, optional): The latitude and longitude of the location (format: "latitude,longitude"). If not specified, the server will attempt to geolocate the IP address from the request.
- `fields` (string[], optional): Indicate which fields to return in the response, separated by commas. If no fields are specified, all Pro Fields are returned by default.
- `hacc` (number, optional): The estimated horizontal accuracy radius in meters of the user's location at the 68th percentile confidence level as returned by the user's cell phone OS.
- `altitude` (number, optional): The altitude of the user's location in meters above the World Geodetic System 1984 (WGS84) reference ellipsoid as returned by the user's cell phone OS.
- `query` (string, optional): A string to be matched against place name for candidates.
- `limit` (number, optional): The number of results to return, up to 50. Defaults to 10.

**Response includes:**
- Basic place information (name, location, categories)
- Contact details (phone, email, website)
- Operating hours and availability
- Photos and social media links
- Ratings, popularity, and user tips
- Attributes (wifi, parking, delivery, etc.)
- Chain information and verification status

**Example prompts:**
- "Find places near my current location at 40.7589,-73.9851"
- "What's around me at these coordinates?"
- "Find nearby businesses at latitude 34.0522, longitude -118.2437"
- "Get geotagging candidates for this location"
- "Find places matching 'coffee' near me"

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