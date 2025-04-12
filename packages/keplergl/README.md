# KeplerGL Tools

This package provides a tool to create a map from your dataset using @openassistant/keplergl.

<img src="https://openassistant-doc.vercel.app/img/keplerPlugin-1.png" width="400" alt="KeplerGL Tool" />

## Installation

```bash
yarn add @openassistant/keplergl
```

Note: please see the [common issues](#common-issues) below for some common issues and solutions.

## Usage

Suppose you have a dataset which could be fetched from your data API. The json data could look like this:

```json
const SAMPLE_DATASETS = {
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

### Add the keplergl tool in your application

```tsx
import { keplergl, KeplerglTool } from '@openassistant/keplergl';

// use KeplerglTool for type safety
const keplerglTool: KeplerglTool = {
  ...keplergl,
  context: {
    ...keplergl.context,
    getDataset: async ({ datasetName }) => SAMPLE_DATASETS[datasetName],
    config: {
      isDraggable: false,
    },
  },
};
```

### Add OpenAssistant Chat component in your application

```tsx
import { AiAssistant } from '@openassistant/ui';
// only for React app without tailwindcss
// import '@openassistant/keplergl/dist/index.css';

<AiAssistant
  name="Kepler.gl Tool"
  modelProvider="openai"
  model="gpt-4o"
  apiKey={process.env.OPENAI_API_KEY || ''}
  welcomeMessage="Welcome to the Kepler.gl Tool Example! You can ask me to create a map from a dataset."
  instructions={instructions}
  functions={{ keplergl: keplerglTool }}
  useMarkdown={true}
/>;
```

See the [example](https://github.com/geodacenter/openassistant/tree/main/examples/keplergl_plugin) for more details.

## Common Issues

### Polyfills

If you are using esbuild, you can use esbuild-plugin-polyfill-node to add the polyfills in your esbuild.config.mjs file.

```js
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

plugins: [polyfillNode()],
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
