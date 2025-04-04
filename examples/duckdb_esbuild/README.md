# DuckDB Example with esbuild

This example demonstrates how to use `@openassistant/duckdb` with esbuild in a React application. The example includes a sample dataset of venues and allows you to query the data using natural language through an AI assistant.

## Features

- Uses esbuild for fast bundling
- React 18 with TypeScript
- DuckDB integration for data querying
- AI Assistant interface for natural language queries
- Sample dataset with venue information

## Getting Started

1. Install dependencies:
```bash
yarn install
```

2. Set up your OpenAI API key:
```bash
export OPENAI_TOKEN=your_api_key_here
```

3. Start the development server:
```bash
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Example Queries

You can try the following example queries with the AI assistant:

- "Show me the revenue per capita for each location"
- "Which city has the highest revenue?"
- "What's the average latitude and longitude of all venues?"
- "List all cities with revenue above 10 million"

## Project Structure

- `src/App.tsx` - Main application component
- `src/dataset.ts` - Sample dataset
- `src/index.tsx` - Application entry point
- `index.html` - HTML entry point
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration

## Building for Production

To create a production build:

```bash
yarn build
```

The built files will be in the `dist` directory. You can serve these files using any static file server.