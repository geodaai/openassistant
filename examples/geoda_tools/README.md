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

- "Create a natural breaks classification of the population data"
- "Show me the spatial autocorrelation of crime rates"
- "Create a spatial weights matrix using queen contiguity"
- "Perform a spatial regression analysis of population and income"
- "Create a cluster analysis of demographic variables"
- "Summarize the spatial dataset"

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
