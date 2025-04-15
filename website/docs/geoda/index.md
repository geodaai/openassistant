# @openassistant/geoda

The geoda addon for OpenAssistant provides spatial analysis capabilities using [Geoda](https://geodacenter.github.io/documentation.html) for spatial data analysis.

<img src="https://openassistant-doc.vercel.app/img/geoda-tools.png" width="400" alt="Geoda Plugin" />

The Geoda tools allow you to perform the following spatial analyses using LLM in your AI Assistant:

## Features

| Detection                | Continuous Variables                                                                                                                                                                                    | Categorical Variables                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Outliers                 | Boxplot, Percentile, Box Map, Standard Deviation                                                                                                                                                        |                                          |
| Patterns                 | Histogram, Bubble, 3D Scatter, PCP, Quantile, Natural Breaks, Equal Intervals, Rates                                                                                                                    | Unique Values, Co-location               |
| Correlations             | Scatter Plot, Scatter Plot Matrix, Spatial Regression                                                                                                                                                   |                                          |
| Clusters (non-spatial)   | PCA, MDS, t-SNE, K Means, K Medians, K Medoids, Spectral, Hierarchcal Clustering                                                                                                                        |                                          |
| Clusters (spatial)       | DBScan, HDBScan, SCHC, Skater, Redcap, AZP, Max-P                                                                                                                                                       |                                          |
| Spatial Auto Correlation | Correlogram, Global Moran, Local Moran, Bivar. Moran, Diff. Moran, Moran EB, Local G/\*, Univ. Geary, Multi. Geary, Median Local Moran, Univ. Quantile LISA, Multi. Quantile LISA, Local Neighbor Match | Join Count: Univar., Bivar., Co-Location |
| Trends                   | Averages Chart, Differential Local Moran                                                                                                                                                                |                                          |

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

- For data classification: "Classify the 'value' variable into 5 classes"
- For outlier detection: "Find outliers in the 'value' variable"
- For pattern analysis: "Show me the spatial pattern of values"

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
