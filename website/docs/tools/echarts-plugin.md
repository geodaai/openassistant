---
sidebar_position: 2
---

# eCharts Tools

import histogramPlugin from '../../images/histogram-1-400.png';

The eCharts tools for OpenAssistant provides powerful visualization capabilities using [Apache ECharts](https://echarts.apache.org/). 

<img src={histogramPlugin} width="400" alt="Histogram Plugin" />

## Available Tools


1. **Histogram Plots** - Visualize data distribution with features like:
   - Customizable number of bins
   - Interactive bar selection
   - Light/dark theme support
   - Automatic bin calculation
   - Tooltip with bin information

2. **Scatter Plots** - Visualize relationships between variables with features like:
   - Interactive point selection
   - Regression line support
   - LOESS smoothing option
   - Statistical information display
   - Brush selection tools

3. **Parallel Coordinates** 

4. **Box Plots**

5. **Bubble Charts**

## Installation

```bash
npm install @openassistant/echarts
```

## Usage 

The assistant needs to understand your data structure. So you can share metadata about your datasets in the assisant instructions:

```javascript
const myDataContext = [
  {
    description: 'Please use the following meta data for function callings.',
    metaData: [{
      datasetName: 'myVenues',
      fields: ['location', 'latitude', 'longitude', 'revenue', 'population'],
    }]
  },
];

const instructions: `You are a data visualization assistant. You can help users create histograms and scatter plots from their datasets.
You can use the following meta data for function callings:

${JSON.stringify(myDataContext)}
`;
```

Then, you need to set up the OpenAssistant in your application:

```tsx
import { AiAssistant } from '@openassistant/ui';

const assistantProps = {
  name: 'My AI Assistant',
  description: 'This is my AI assistant',
  version: '1.0.0',
  modelProvider: 'openai',
  model: 'gpt-4',
  apiKey: 'your-api-key',
};
```

### 3. Register Visualization Functions

Import and register the visualization functions:

```typescript
import {
  histogramFunctionDefinition,
  scatterplotFunctionDefinition,
} from '@openassistant/echarts';

const myFunctions = [
  histogramFunctionDefinition({
    getValues: (datasetName: string, variableName: string) => {
      return getValuesFromMyDatasets(datasetName, variableName);
    },
  }),
  scatterplotFunctionDefinition({
    getValues: async (
      datasetName: string,
      xVariableName: string,
      yVariableName: string
    ) => {
      return getXYValuesFromMyDatasets(datasetName, xVariableName, yVariableName);
    },
  }),
];

// Add functions to assistant props
const assistantProps = {
  // ... other props ...
  functions: myFunctions,
};
```

### 4. Implement Data Retrieval

Create functions to fetch your data:

```typescript
async function getValuesFromMyDatasets(datasetName: string, variableName: string): Promise<number[]> {
  const dataset = myDatasets[datasetName];
  return dataset.map((item) => item[variableName]);
}

async function getXYValuesFromMyDatasets(
  datasetName: string,
  xVar: string,
  yVar: string
): Promise<{
  x: number[];
  y: number[];
}> {
  const dataset = myDatasets[datasetName];
  return {
    x: dataset.map((item) => item[xVar]),
    y: dataset.map((item) => item[yVar]),
  };
}
```

## Usage Examples

Once set up, you can create visualizations through natural language prompts:

- For histograms: "Create a histogram of the 'revenue' variable"
- For scatter plots: "Show me a scatter plot of revenue vs population"

The assistant will automatically understand your request and use the appropriate visualization function.

## Coming Soon

We're actively working on expanding our visualization capabilities with new chart types:
- 📊 Box plots
- 📈 Dynamic line charts
- 📊 Interactive bar charts
- 🥧 Parallel coordinates
- And more!
