# WebSearch Example

This example demonstrates how to use the `webSearch` tool from the OpenAssistant Places package to perform web searches using the SearchAPI with Google search engine.

## Features

- Web search functionality using SearchAPI
- Structured search results returned as JSON datasets
- Integration with LLMs for natural language search queries
- Support for various search parameters (language, country, device type, etc.)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp env.example .env.local
   ```
   
   Then edit `.env.local` and add your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   SEARCH_API_KEY=your_searchapi_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

The example provides a simple chat interface where you can:

1. Ask natural language questions like "Search for information about artificial intelligence"
2. The tool will perform a web search using Google via SearchAPI
3. Results are returned as structured data and can be saved as JSON datasets
4. The LLM can use these results to provide comprehensive answers

## Example Queries

- "Search for information about artificial intelligence"
- "Find the latest news about climate change"
- "Search for redfin 4440 S Oleander Dr Chandler AZ"
- "What are the best restaurants in New York?"
- "Find information about machine learning algorithms"

## API Configuration

The webSearch tool supports various parameters:

- `query`: The search query (required)
- `engine`: Search engine (default: "google")
- `device`: Device type (default: "desktop")
- `google_domain`: Google domain (default: "google.com")
- `hl`: Language (default: "en")
- `gl`: Country (default: "us")
- `num`: Number of results (1-20, default: 10)

## Response Format

The tool returns structured data including:

- Search metadata (request ID, timing, etc.)
- Search parameters used
- Search information (query, detected location)
- Organic search results with titles, links, snippets
- Related searches
- Pagination information

## Learn More

For more information about the webSearch tool, see the [OpenAssistant Places documentation](../../packages/tools/places/README.md). 