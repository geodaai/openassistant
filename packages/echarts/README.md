# @openassistant/echarts

The echarts addon for OpenAssistant provides visualization capabilities using [Apache ECharts](https://echarts.apache.org/). 

It includes two main function definitions:

1. `histogramFunctionDefinition`: Creates histogram plots to visualize data distribution
2. `scatterplotFunctionDefinition`: Creates scatter plots to visualize relationships between two variables

🚀 This is just the beginning! We're actively working on expanding our visualization capabilities with an exciting roadmap of new chart types, including:
- 📊 Box plots for detailed statistical insights
- 📈 Dynamic line charts
- 📊 Interactive bar charts
- 🥧 Parallel coordinates for multidimensional data
- 🌈 ...


## Installation

```bash
npm install @openassistant/echarts
```

or

```bash
yarn add @openassistant/echarts
```

## Usage

### Step 1: Setup the OpenAssistant in your application

If you already have the OpenAssistant setup in your application, you can skip this step.

```tsx
import { AiAssistant } from '@openassistant/ui';
// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';

const assistantProps = {
  name: 'My AI Assistant',
  description: 'This is my AI assistant',
  version: '1.0.0',
  modelProvider: 'openai',
  model: 'gpt-4',
  apiKey: 'your-api-key',
  instructions:
    `You are a data and map analyst. You can help users to create a map from a dataset. 
You can help users create histograms and scatter plots from their datasets using function calling.
If a function calling can be used to answer the user's question, please always confirm the function calling and its arguments with the user.
`,
};
```

If you are using tailwindcss, see [With TailwindCSS](#with-tailwindcss) section below for more details.

### Step 2: Share the meta data of your dataset with the AI assistant

Suppose you have a dataset which could be fetched from your data API. The json data could look like this:

```json
const myDatasets = {
  myVenues: [
    { "location": "New York", "latitude": 40.7128, "longitude": -74.0060, "revenue": 12500000, "population": 8400000 },
    { "location": "Los Angeles", "latitude": 34.0522, "longitude": -118.2437, "revenue": 9800000, "population": 3900000 },
    { "location": "Chicago", "latitude": 41.8781, "longitude": -87.6298, "revenue": 7200000, "population": 2700000 },
    { "location": "Houston", "latitude": 29.7604, "longitude": -95.3698, "revenue": 6800000, "population": 2300000 },
    { "location": "Phoenix", "latitude": 33.4484, "longitude": -112.0740, "revenue": 5400000, "population": 1600000 },
    { "location": "Philadelphia", "latitude": 39.9526, "longitude": -75.1652, "revenue": 5900000, "population": 1580000 },
    { "location": "San Antonio", "latitude": 29.4241, "longitude": -98.4936, "revenue": 4800000, "population": 1540000 },
    { "location": "San Diego", "latitude": 32.7157, "longitude": -117.1611, "revenue": 5200000, "population": 1420000 }
  ]
};
```

You will need to share the meta data of your dataset, so the assistant can understand which datasets are available to use when creating a map.

Note: The meta data is good enough for the AI Assistant. Don't put the entire dataset in the context, and there is no need to share your dataset with the AI Assistant or the LLM models. This also helps to keep your dataset private.

The easiest way is to append the meta data to the instructions created above if your dataset is fixed (same data structure).

For example:

```js
const instructions = `...
Please use the following meta data for function callings:
${JSON.stringify(myDataContext)}
`;
```

#### Dynamically add the meta data of your dataset to the assistant

If your dataset is dynamic, you can create a function to get the meta data from your database. Then, you can update the instructions with the updated meta data to tell the LLM models that what dataset and columns are available to use.

```js
import {useAssistant} from '@openassistant/core';

const { addAdditionalContext } = useAssistant(assistantProps);

// add the meta data of your dataset to the assistant, you can create a function to get the meta data from your database
const myDataContext = [
  {
    description:
      'Please use the following meta data for function callings.',
    metaData: [{
      datasetName: 'myVenues',
      fields: ['location', 'latitude', 'longitude', 'revenue', 'population'],
    }]
  },
];

addAdditionalContext({ context: JSON.stringify(myDataContext) });
```

### Step 3: Register the functions with your assistant

```typescript
import {
  histogramFunctionDefinition,
  scatterplotFunctionDefinition,
} from '@openassistant/echarts';

// define your functions for LLM models
const myFunctions = [
  ...otherFunctions,
  histogramFunctionDefinition({
    getValues: (datasetName: string, variableName: string) => {
      // get the values of the variable from the dataset,
      // the values will be used to create and plot the histogram
      return getValuesFromMyDatasets(datasetName, variableName);
    },
  }),
  scatterplotFunctionDefinition({
    getValues: async (
      datasetName: string,
      xVariableName: string,
      yVariableName: string
    ) => {
      // get the x and y values from the dataset
      return getXYValuesFromMyDatasets(datasetName, xVariableName, yVariableName);
    },
  }),
];

const assistantProps = {
  name: 'My AI Assistant',
  description: 'This is my AI assistant',
  version: '1.0.0',
  modelProvider: 'openai',
  model: 'gpt-4',
  apiKey: 'your-api-key',
  instructions:
    'You are a data visualization assistant. You can help users create histograms and scatter plots from their datasets.',
  functions: myFunctions,
};
```

### Step 4: Use prompts to create histogram or scatter plot

Once you have registered the functions with your assistant, the LLM models will know what functions are available to use.
Therefore, when the user prompts question about creating histogram or scatter plot, the LLM models will understand 
which function to call and what arguments to pass to the function.

For example, if the user prompts:

```
Create a histogram of the 'revenue' variable?
```

The LLM models will understand that the `histogramFunctionDefinition` is the function to call, 
and the arguments are `{datasetName: 'myVenues', variableName: 'revenue'}`.

> Tip: Becuase you shared the meta data of your dataset with the assistant, the LLM models will know that 'revenue' belongs
to the 'myVenues' dataset. So, even you don't mention the dataset name in the prompt, the LLM models will know which dataset to use.

What you need to do is providing the callback function to get the values from your dataset that the eCharts plugin
will use to create the histogram.

```typescript
async function getValuesFromMyDatasets(datasetName: string, variableName: string): Promise<number[]> {
  const dataset = myDatasets[datasetName];
  return dataset.map((item) => item[variableName]);
}
```

> Tip: the type definition of the callback function `getValue` will help you to define your callback function.

Another callback function is used to get the x and y values from the dataset for the scatter plot.

```typescript
async function getScatterplotValuesFromDataset(
  datasetName: string,
  xVar: string,
  yVar: string
): Promise<{
  x: number[];
  y: number[];
}> {
  const dataset = SAMPLE_DATASETS[datasetName];
  return {
    x: dataset.map((item) => item[xVar]),
    y: dataset.map((item) => item[yVar]),
  };
}
```

## Features

### Histogram Plot

- Customizable number of bins
- Interactive bar selection
- Selection callback support
- Light/dark theme support
- Responsive design
- Automatic bin calculation
- Tooltip with bin information

Reference implementation:

```typescript:packages/echarts/src/histogram-plot.tsx
startLine: 54
endLine: 159
```

### Scatter Plot

- Interactive point selection
- Regression line support
- LOESS smoothing option
- Selection callback support
- Light/dark theme support
- Responsive design
- Statistical information display
- Brush selection tools

Reference implementation:

```typescript:packages/echarts/src/scatterplot/utils/scatter-plot-component.tsx
startLine: 22
endLine: 239
```

## With TailwindCSS

If you are using TailwindCSS, make sure to include the package's CSS in your project:

```typescript
import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/@openassistant/echarts/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui()],
};
```

## License

MIT © [Xun Li](mailto:lixun910@gmail.com)
