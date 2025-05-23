# GeoDa Tools

The GeoDa tools for OpenAssistant provides spatial analysis capabilities using [GeoDa](https://geodacenter.github.io/documentation.html).

<img src="https://openassistant-doc.vercel.app/img/geoda-tools.png" width="500" alt="Geoda Plugin" />

## Features

- Data classification
  - Natural Breaks
  - Equal Intervals
  - Quantile
  - Standard Deviation
  - Percentile
- Spatial weights
  - Queen
  - Rook
  - K-Nearest Neighbors
  - Distance Band
- Spatial autocorrelation
  - Global Moran's I
  - Local Moran's I
  - Local G / Local G\*
  - Local Geary
  - Quantile LISA
- Spatial regression
  - OLS
  - Spatial lag
  - Spatial error
- Spatial Operations
  - Spatial Join
  - Spatial Dissolve
  - Buffer
  - Centroid
  - Length
  - Area
  - Perimeter
- Spatial Data
  - Get US State Data e.g. ask "how many venues are there in California and Texas?"
  - Get US Zipcode Data
  - Get US County Data

## Installation

```bash
npm install @openassistant/geoda
```

## Quick Start

Suppose you have a spatial dataset which could be fetched from your data API. The json data could look like this:

```json
const SAMPLE_DATASETS = {
  myVenues: [
    { "location": "New York", "latitude": 40.7128, "longitude": -74.0060, "value": 12500000 },
    ...
  ]
};
```

You can share the meta data of your dataset in the `instructions` prop of the `AiAssistant` component, so the LLM can understand which datasets are available to use when performing spatial analysis.

:::note
The meta data is good enough for the AI Assistant. Don't put the entire dataset in the context, and there is no need to share your dataset with the AI Assistant or the LLM models. This also helps to keep your dataset private.
:::

```js
const instructions = `You can help users to perform spatial analysis on a dataset.
Please always confirm the function calling and its arguments with the user.

Here is the dataset are available for function calling:
DatasetName: mySpatialData
Fields: location, longitude, latitude, value`;
```

Then, you can add the Geoda tools in your application:

```tsx
import { dataClassify, DataClassifyTool } from '@openassistant/geoda';

// use DataClassifyTool for type safety
const dataClassifyTool: DataClassifyTool = {
  ...dataClassify,
  context: {
    getValues: (datasetName, variableName) => {
      return SAMPLE_DATASETS[datasetName][variableName];
    },
  },
};

// use the tool in the chat component
<AiAssistant
  modelProvider="openai"
  model="gpt-4"
  apiKey={process.env.OPENAI_API_KEY || ''}
  welcomeMessage="Hello! How can I help you today?"
  instructions={instructions}
  functions={{ dataClassify: dataClassifyTool }}
/>;
```

Once set up, you can perform spatial analyses through natural language prompts:

- For data classification: "How can I classify the population data into 5 classes using natural breaks?"
- For outlier detection: "Can you help me analyze the spatial autocorrelation of population data"
- For pattern analysis: "Can you help to check the spatial patterns of the revenue data"
- For spatial regression: "Can you help me run a spatial regression model to analyze the relationship between population and revenue"
- For spatial join: "What are the total revenue in California and Texas?"

The assistant will automatically understand your request and use the appropriate spatial analysis function.

See the [example](https://github.com/geodacenter/openassistant/tree/main/examples/geoda_tools) for more details.

## With TailwindCSS

If you are using TailwindCSS, make sure to include the package's CSS in your project:

```typescript
import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@openassistant/ui/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@openassistant/geoda/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui()],
};
```
