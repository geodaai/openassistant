# eCharts Tools 

The eCharts tools for OpenAssistant provides powerful visualization capabilities using [Apache ECharts](https://echarts.apache.org/).

<img src="https://openassistant-doc.vercel.app/img/histogram-1-400.png" width="400" alt="Histogram Plugin" />

The eCharts tools allow you to create the following plots using LLM in your AI Assistant:

- **Histogram Plots**

- **Scatter Plots**

- **Parallel Coordinates**

- **Box Plots**

- **Bubble Charts**

## Installation

```bash
npm install @openassistant/echarts
```

## Quick Start

Suppose you have a dataset which could be fetched from your data API. The json data could look like this:

```json
const SAMPLE_DATASETS = {
  myVenues: [
    { "location": "New York", "latitude": 40.7128, "longitude": -74.0060, "revenue": 12500000, "population": 8400000 },
    ...
  ]
};
```

You can share the meta data of your dataset in the `instructions` prop of the `AiAssistant` component, so the LLM can understand which datasets are available to use when creating a map.

:::note
The meta data is good enough for the AI Assistant. Don't put the entire dataset in the context, and there is no need to share your dataset with the AI Assistant or the LLM models. This also helps to keep your dataset private.
:::

```js
const instructions = `You can help users to create a map from a dataset.
Please always confirm the function calling and its arguments with the user.

Here is the dataset are available for function calling:
DatasetName: myVenues
Fields: location, longitude, latitude, revenue, population`;
```

Then, you can add the eCharts tools in your application:

```tsx
import {
  histogram,
  HistogramTool,
  scatterplot,
  ScatterplotTool,
} from '@openassistant/echarts';

// use HistogramTool for type safety
const histogramTool: HistogramTool = {
  ...histogram,
  context: {
    getValues: (datasetName, variableName) => {
      return SAMPLE_DATASETS[datasetName][variableName];
    },
  },
};

const scatterplotTool: ScatterplotTool = {
  ...scatterplot,
  context: {
    getValues: (datasetName, variableName) => {
      return SAMPLE_DATASETS[datasetName][variableName];
    },
  },
};

// use the tool in the chat component
<AiAssistant
  modelProvider="openai"
  model="gpt-4o"
  apiKey={process.env.OPENAI_API_KEY || ''}
  welcomeMessage="Hello! How can I help you today?"
  instructions={instructions}
  functions={{ histogram: histogramTool }}
/>;
```

Once set up, you can create histograms through natural language prompts:

- For histograms: "Create a histogram of the 'revenue' variable"
- For scatter plots: "Show me a scatter plot of revenue vs population"

The assistant will automatically understand your request and use the appropriate visualization function.

See the [example](https://github.com/geodacenter/openassistant/tree/main/examples/echarts_plugin) for more details.

## With TailwindCSS

If you are using TailwindCSS, make sure to include the package's CSS in your project:

```typescript
import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@openassistant/echarts/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui()],
};
```
