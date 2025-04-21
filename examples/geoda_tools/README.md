# GeoDa Tools Example

This example demonstrates how to use various GeoDa spatial analysis tools in a React application with an AI assistant interface.

## Features

- Create multiple types of spatial analysis using natural language prompts:
  - Data classification
  - Spatial autocorrelation
  - Spatial regression
  - Cluster analysis
  - Spatial weights creation

## Getting Started

1. Install dependencies:

```bash
yarn install
```

2. Start the development server:

```bash
yarn start
```

3. Open your browser and navigate to `http://localhost:3000`

## Building for Production

To create a production build:

```bash
yarn build
```

The built files will be in the `dist` directory. You can serve these files using any static file server.

## Usage

You can interact with the assistant using natural language prompts. For example:

1. How can I classify the population data into 5 classes using natural breaks?
2. Could you help me create a queen contiguity weights?
3. Can you help me analyze the spatial autocorrelation of population data?
4. Can you run an OLS regression to analyze how population and income affect revenue?
5. Do I need a spatial regression model?
6. Can you help to check the spatial patterns of the revenue data?
7. How many venues are there in California and Texas?
8. What are the total revenue in California and Texas?

## Sample Dataset

The example includes support for spatial datasets with the following structure:

```typescript
const SAMPLE_DATASET = {
  myVenues: [
    {
      location: string,
      latitude: number,
      longitude: number,
      revenue: number,
      population: number,
    },
    // ... more venues
  ],
};
```

## Project Structure

- `src/` - Source files
  - `app.tsx` - Main application component
  - `dataset.ts` - Data handling and processing
  - `main.tsx` - Application entry point
  - `index.css` - Global styles
- `dist/` - Build output directory
- `esbuild.config.mjs` - Build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## Dependencies

- React 18
- OpenAssistant UI components
- OpenAssistant GeoDa integration
- Tailwind CSS for styling
- TypeScript for type safety

## License

ISC License

## Author

Xun Li <lixun910@gmail.com>
