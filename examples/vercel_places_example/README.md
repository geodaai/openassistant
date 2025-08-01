# Vercel Places Example

This example demonstrates how to use OpenAssistant tools for location-based queries, place searches, routing, and spatial analysis with Next.js and Vercel AI SDK.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables:
```bash
cp env.example .env.local
```

Add your API tokens to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
FSQ_TOKEN=your_foursquare_api_token_here
MAPBOX_TOKEN=your_mapbox_api_token_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

This example includes the following tools:

### Places Tools (@openassistant/places)
- **geotagging**: Find places near a specific location using Foursquare's Snap to Place technology
- **placeSearch**: Search for places using Foursquare's Places API

### OSM Tools (@openassistant/osm)
- **geocoding**: Convert addresses to coordinates
- **routing**: Find routes between two points using Mapbox Directions API
- **isochrone**: Get reachable areas within a time limit from a starting point

### Geoda Tools (@openassistant/geoda)
- **buffer**: Create buffer zones around geometries

### Map Tools (@openassistant/map)
- **downloadMapData**: Download map data for visualization
- **keplergl**: Visualize data on interactive maps

## Example Queries

### Place Searches
- "Find coffee shops near Times Square"
- "Search for restaurants within 2km of the Eiffel Tower"
- "What are the best rated hotels in San Francisco?"
- "Find gas stations near me"

### Geocoding and Routing
- "Get directions from New York to Boston"
- "Find the walking route from Times Square to Central Park"
- "How long does it take to drive from LA to San Francisco?"

### Spatial Analysis
- "Create a 5km buffer around these roads"
- "Show me the area reachable within 30 minutes from downtown"

### Combined Workflows
- "Find coffee shops near Times Square and create a 1km buffer around them"
- "Get directions to the nearest hospital and show the route on a map"

## How it Works

This example uses:
- `@openassistant/places` for place search and geotagging functionality
- `@openassistant/osm` for geocoding, routing, and isochrone analysis
- `@openassistant/geoda` for spatial operations like buffering
- `@openassistant/map` for map data download and visualization
- `@openassistant/utils` for tool integration and caching
- Vercel AI SDK for chat interface
- Next.js for the web application framework

The tools integrate seamlessly with AI chat, allowing users to ask natural language questions about places, get directions, perform spatial analysis, and visualize results on interactive maps.

## API Keys Required

- **OpenAI API Key**: For the AI chat functionality
- **Foursquare API Token**: For place search and geotagging features
- **Mapbox API Token**: For routing, isochrone, and map visualization features

## Architecture

The example follows a server-client architecture where:
- Server-side tools (geotagging, placeSearch, geocoding, routing, isochrone, buffer, downloadMapData) are executed on the server with result caching
- Client-side tools (keplergl) are executed in the browser for interactive visualization
- Tool results are cached and can be referenced by subsequent tool calls in the same conversation 