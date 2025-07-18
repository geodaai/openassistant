# Vercel Places Example

This example demonstrates how to use the OpenAssistant Places tools with Next.js and Vercel AI SDK.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables:
```bash
cp .env.example .env.local
```

Add your Foursquare API token to `.env.local`:
```
FSQ_TOKEN=your_foursquare_api_token_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Search for places using the Foursquare Places API
- Location-based searches with coordinates or geocodable localities
- Real-time chat interface with AI assistance
- Tool result caching and display

## Example Queries

- "Find coffee shops near Times Square"
- "Search for restaurants within 2km of the Eiffel Tower"
- "What are the best rated hotels in San Francisco?"
- "Find gas stations near me"

## How it Works

This example uses:
- `@openassistant/places` for place search functionality
- `@openassistant/utils` for tool integration
- Vercel AI SDK for chat interface
- Next.js for the web application framework

The place search tool integrates seamlessly with AI chat, allowing users to ask natural language questions about places and get structured results back. 