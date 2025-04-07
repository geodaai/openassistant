# ECharts Tools Example

This example demonstrates how to use the ECharts boxplot tool in a React application.

## Features

- Create boxplots using natural language prompts
- Interactive visualization of data
- Sample dataset with revenue and population data

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

## Usage

You can interact with the assistant using natural language prompts. For example:

- "Create a boxplot of the revenue for each location"
- "Show me the distribution of population across locations"
- "Compare the revenue and population distributions"

## Sample Dataset

The example includes a sample dataset with the following structure:

```typescript
const SAMPLE_DATASET = {
  myVenues: [
    { revenue: 1000, population: 100, location: 'A' },
    { revenue: 2000, population: 200, location: 'B' },
    { revenue: 3000, population: 300, location: 'C' },
    { revenue: 4000, population: 400, location: 'D' },
    { revenue: 5000, population: 500, location: 'E' },
  ],
};
```

## Customization

You can customize the example by:

1. Modifying the sample dataset
2. Adding more variables to the dataset
3. Changing the assistant's instructions
4. Customizing the UI theme

## License

ISC 