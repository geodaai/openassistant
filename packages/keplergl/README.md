# KeplerGL Plugin for OpenAssistant

This plugin allows you to create a map from your dataset using KeplerGL in the OpenAssistant chat interface.

## Installation

```bash
yarn add @openassistant/core @openassistant/ui @openassistant/keplergl
```

You also need to install kepler.gl and its dependencies.

```bash
yarn add @kepler.gl/actions @kepler.gl/components @kepler.gl/constants @kepler.gl/layers @kepler.gl/processors @kepler.gl/reducers @kepler.gl/styles @kepler.gl/utils 
```

Note: please see the [common issues](#common-issues) below for more details.

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

You need to share the meta data of your dataset, so the assistant can understand which datasets are available to use when creating a map.

Note: The meta data is good enough for the AI Assistant. Don't put the entire dataset in the context, and there is no need to share your dataset with the AI Assistant or the LLM models. This also helps to keep your dataset private.

```js
// import {useAssistant} from '@openassistant/core';

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

## Common Issues

### Polyfills

**assert**
If your bundler complains about the `assert` and `process` package, which are used by `@kepler.gl`, you need to install them separately. 

```bash
yarn add assert process
```

Then, in your Webpack or Vite configuration, you need to add the following configuration to avoid conflicts.

```js
resolve: {
  fallback: {
    assert: path.resolve(__dirname, 'node_modules/assert'),
  },
},
```

If you are using esbuild, you can specify the `assert` package in your esbuild.config.mjs file to avoid conflicts.

```js
define: {
  'global': 'window'
},
inject: ['./node_modules/assert/index.js']
```

If you are using Docusaurus, you can use [docusaurus-node-polyfills](https://github.com/JayaKrishnaNamburu/docusaurus-node-polyfills) to add the polyfills.


### Styled Components

There are multiple versions of `styled-components` in the kepler.gl package, you need to tell your bundler to use the same version to avoid conflicts.

You can use the `resolutions` field in your package.json to force the same version.

```json
"resolutions": {
  "styled-components": "6.1.8"
}
```

If you are using esbuild, you can add the following configuration of `alias` to your esbuild.config.mjs file to avoid conflicts.

```js
alias: {
  'styled-components': path.resolve(__dirname, 'node_modules/styled-components'),
}
```

If you are using webpack, you can add the following configuration of alias to your webpack.config.js file to avoid conflicts.

```js
resolve: {
  alias: {
    'styled-components': path.resolve(__dirname, 'node_modules/styled-components'),
  },
},
```

## With TailwindCSS

If you are using tailwindcss, you can  add the following to your tailwind.config.js file:

```js
   content: [
     ...,
     './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
     './node_modules/@openassistant/ui/dist/**/*.{js,ts,jsx,tsx}',
   ]
```
