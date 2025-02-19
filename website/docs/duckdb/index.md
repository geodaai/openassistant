# DuckDB Plugin for OpenAssistant

This plugin allows you to query your dataset using DuckDB in the OpenAssistant chat interface.

## Installation

```bash
yarn add @openassistant/core @openassistant/ui @openassistant/duckdb
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
    'You are a data and map analyst. You can help users to create a map from a dataset. If a function calling can be used to answer the user\'s question, please always confirm the function calling and its arguments with the user.',
};
```

If you are using tailwindcss, see [With TailwindCSS](#with-tailwindcss) section below for more details.

### Step 2: Add system prompt to the OpenAssistant

It is always a good practice to add a system prompt to the OpenAssistant. This helps the LLM models to understand what the assistant can do and how the assistant should respond to the user.

For example:

```js
const instructions = `You are an assistant that can help users to query their dataset using SQL and DuckDB.

When responding to user queries:
1. Analyze if the task requires one or multiple function calls
2. For each required function:
  - Confirm the function call and its arguments with the user
3. For SQL query
  - please help to generate select query clause using the content of the dataset:
  - please only use the columns that are in the dataset context
  - please don't use * when selecting all columns and always use the column names explicitly
`;
```

### Step 3: Share the meta data of your dataset with the AI assistant

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
const instructions = `You are an assistant that can help users to query their dataset using SQL and DuckDB.
...
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

### Step 4: Register the DuckDB function to the OpenAssistant

To use this plugin with LLM models, you just need to import the `queryDuckDBCallbackMessage` predefined function from the plugin and pass the proper function context to it.

```tsx
import { AiAssistant } from '@openassistant/core';
import { queryDuckDBFunctionDefinition } from '@openassistant/duckdb';
// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';
import '@openassistant/duckdb/dist/index.css';

const myFunctions = [
  ...otherFunctions,
  queryDuckDBFunctionDefinition({
    getValues: (datasetName: string, variableName: string) => {
      // get the values of the variable from the dataset,
      // the values will be used to create and plot the histogram
      return [];
    }
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
    'You are a data and map analyst. You can help users to create a map from a dataset. If a function calling can be used to answer the user\'s question, please always confirm the function calling and its arguments with the user.',
  functions: myFunctions,
};
```

With the above code, users can prompt the AI assistant to query your datasets. For example:

```
Query and sort the value (revenue / population) from the dataset "myVenues".
```

## With TailwindCSS

If you are using tailwindcss, you can  add the following to your tailwind.config.js file:

```js
   content: [
     ...,
     './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
     './node_modules/@openassistant/ui/dist/**/*.{js,ts,jsx,tsx}',
     './node_modules/@openassistant/duckdb/dist/**/*.{js,ts,jsx,tsx}',
   ]
```
