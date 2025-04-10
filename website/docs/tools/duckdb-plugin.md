---
sidebar_position: 4
---

# SQL Plugin using DuckDB

import duckdbPlugin from '../../images/duckdbPlugin-2-400.png';

The DuckDB plugin enables natural language querying of your data through OpenAssistant. Your users can ask questions in plain English, and the AI assistant will translate these into SQL queries and return the results.

For example, suppose you have a dataset containing city information with revenue and population data. Within your application, you might have data structured like this:

```json
const myDatasets = {
  myVenues: [
    { "location": "New York", "latitude": 40.7128, "longitude": -74.0060, "revenue": 12500000, "population": 8400000 },
    { "location": "Los Angeles", "latitude": 34.0522, "longitude": -118.2437, "revenue": 9800000, "population": 3900000 },
    { "location": "Chicago", "latitude": 41.8781, "longitude": -87.6298, "revenue": 7200000, "population": 2700000 }
  ]
};
```

You can query this data by simply asking the AI assistant questions like:
```text
Which cities make the most money per person?
```

<img src={duckdbPlugin} width="400" alt="DuckDB Plugin Query Result" />

## Implementation Guide

### Step 1: Install Required Packages

Install the OpenAssistant packages in your application:

```bash
yarn add @openassistant/core @openassistant/duckdb @openassistant/ui
```

### Step 2: Setup the OpenAssistant

Configure your AI assistant with the necessary properties:

```typescript
const assistantProps = {
  name: 'Data Query Assistant',
  modelProvider: 'openai',
  model: 'gpt-4',
  apiKey: 'your-api-key',
  welcomeMessage: 'Hi! I can help you analyze your data. What would you like to know?',
  instructions: "You are a data analyst who helps users query and analyze data. When users ask questions, translate them into SQL queries and explain the results in simple terms.",
  functions: [],
};
```

:::tip
The instructions help guide the AI assistant in understanding its role and how to interact with users. Make sure to customize them based on your specific use case.
:::

### Step 3: Define Your Data Context

Share the metadata of your datasets with the AI assistant:

```typescript
const dataContext = [
  {
    description: 'Available datasets for analysis:',
    metaData: [
      {
        datasetName: 'myVenues',
        fields: ['location', 'latitude', 'longitude', 'revenue', 'population'],
      },
    ],
  },
];

// Add the context to the assistant's instructions
assistantProps.instructions = 
  assistantProps.instructions + '\n' + JSON.stringify(dataContext);
```

### Step 4: Configure the DuckDB Plugin

Import and set up the DuckDB query function:

```typescript
import { queryDuckDBFunctionDefinition } from '@openassistant/duckdb';

const myFunctions = [
  queryDuckDBFunctionDefinition({
    getValues: (datasetName, variableName) => {
      if (!myDatasets[datasetName]) {
        throw new Error('Dataset not found');
      }
      return myDatasets[datasetName];
    },
  })
];
```

### Step 5: Initialize and Render the Assistant

Update the assistant props with the functions and render the component:

```typescript
assistantProps.functions = myFunctions;

return <AiAssistant {...assistantProps} />;
```

## Using the Assistant

Once set up, users can ask various questions about their data:

- Simple queries: "Show me all cities with population over 5 million"
- Calculations: "What's the average revenue per city?"
- Complex analysis: "Which cities have above-average revenue but below-average population?"

The assistant will:
1. Understand the natural language question
2. Convert it to an appropriate SQL query
3. Execute the query using DuckDB
4. Present the results in a user-friendly format

## Advanced Features

Coming soon:
- Custom SQL function definitions
- Data visualization integration
- Advanced query optimization
- Aggregation and grouping operations
- Time-series analysis
