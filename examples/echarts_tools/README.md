# ECharts Tools Example

This example demonstrates how to use various ECharts visualization tools in a React application with an AI assistant interface.

## Features

- Create multiple types of visualizations using natural language prompts:
  - Boxplots
  - Bubble Charts
  - Histograms
  - Parallel Coordinate Plots (PCP)
  - Scatterplots
- Interactive visualization of data
- AI Assistant interface for natural language queries
- Sample dataset with venue information
- Light/dark theme support

## Getting Started

1. Install dependencies:

```bash
yarn install
```

2. Set up your OpenAI API key:

```bash
export OPENAI_API_KEY=your_api_key_here
```

3. Start the development server:

```bash
yarn start
```

4. Open your browser and navigate to `http://localhost:3000`

## Building for Production

To create a production build:

```bash
yarn build
```

The built files will be in the `dist` directory. You can serve these files using any static file server.

## Usage

You can interact with the assistant using natural language prompts. For example:

- "Create a boxplot of the population for each location"
- "Show me a bubble chart using latitude and longitude, with revenue as bubble size"
- "Create a histogram of the population"
- "Show me a parallel coordinate plot of population and revenue"
- "Create a scatterplot of population vs revenue"
- "Summarize the dataset"

## Sample Dataset

The example includes a sample dataset with the following structure:

```typescript
const SAMPLE_DATASET = {
  myVenues: [
    { 
      location: string,
      latitude: number,
      longitude: number,
      revenue: number,
      population: number
    },
    // ... more venues
  ],
};
```

## Customization

You can customize the example by:

1. Modifying the sample dataset
2. Adding more variables to the dataset
3. Changing the assistant's instructions
4. Customizing the UI theme
5. Adding new visualization tools

## License

ISC 