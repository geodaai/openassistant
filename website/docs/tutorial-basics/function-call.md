---
sidebar_position: 5
---

# Function Calling

In this tutorial, we'll walk you through the process of integrating custom functions into your AI Assistant using OpenAssistant. Specifically, we'll demonstrate how to add a Shannon entropy calculation function that your assistant can use to respond to entropy-related queries from users.

## Table of Contents

1. [Introduction](#introduction)
2. [The Entropy Calculation Function](#the-entropy-calculation-function)
3. [Understanding the Type System](#understanding-the-type-system)
4. [Implementing the Entropy Function](#implementing-the-entropy-function)
5. [Registering the Function with the AI Assistant](#registering-the-function-with-the-ai-assistant)
6. [Usage Example](#usage-example)
7. [Additional Resources](#additional-resources)

## Introduction

Function calls allow your AI Assistant to perform specific tasks by invoking predefined functions. By integrating custom functions, you can extend the capabilities of your AI assistant to handle specialized operations, improving its usefulness and responsiveness.

### Why use Function Calling?

Function calling is particularly valuable for implementing specialized algorithms, computations, or features that Language Models (LLMs) cannot directly perform or would be inefficient at executing through code interpretation. Instead of requiring users to learn and interact with specially designed UI components, function calling provides a natural language interface to these specialized capabilities. Users can simply describe what they want to accomplish in plain text, and the AI Assistant will invoke the appropriate function with the correct parameters that your application can execute.

Use cases that function calling in AI Assistant is useful for:
- Complex mathematical computations (e.g., entropy calculations, geometric area computations)
- Data analysis tasks (e.g., clustering algorithms, statistical analysis)
- Visualization generation (e.g., creating scatter plots with regression lines)
- Custom business logic or domain-specific algorithms
- Integration with external services or APIs

In this guide, we'll add a function that calculates the Shannon entropy of a dataset. This function can be used to analyze datasets like temperature or revenue values when users request entropy calculations.

## The Entropy Calculation Function

First, let's define the entropy calculation function in TypeScript. This function computes the Shannon entropy of an array of numbers, which is a measure of uncertainty or randomness in the data.

```typescript
/**
 * Calculates the Shannon entropy of an array of numbers
 * @param numbers Array of numerical values
 * @returns The entropy value
 */
function calculateEntropy(numbers: number[]): number {
  if (numbers.length === 0) return 0;

  // Calculate frequency of each number
  const frequencies = new Map<number, number>();
  for (const num of numbers) {
    frequencies.set(num, (frequencies.get(num) || 0) + 1);
  }

  // Calculate probabilities and entropy
  const totalCount = numbers.length;
  let entropy = 0;

  for (const count of frequencies.values()) {
    const probability = count / totalCount;
    entropy -= probability * Math.log2(probability);
  }

  return entropy;
}
```

## Understanding the Type System

Before integrating the function, it's essential to understand the types involved in the OpenAssistant ecosystem. We'll define the context and structure required for registering custom functions.

### 1. Custom Function Context

This defines the context your function needs to operate. For our entropy function, we'll need a method to retrieve data based on variable names.

```typescript
type EntropyFunctionContextValues = {
  getData: (variableName: string) => number[];
};

type CustomFunctionContext<T> = {
  [K in keyof T]: T[K];
};
```

### 2. Function Definition Structure

Your function definition should adhere to a specific structure that OpenAssistant recognizes. Here's the structure we'll follow:

```typescript
type RegisterFunctionCallingProps = {
  name: string; // Function name for the AI to reference
  description: string; // Description of what the function does
  properties: {
    // Input parameters
    [key: string]: {
      type: string;
      description: string;
    };
  };
  required: string[]; // List of required parameters
  callbackFunction: (
    functionName: string,
    functionArgs: Object,
    functionContext: CustomFunctionContext<T>
  ) => Promise<CustomFunctionOutputProps>;
  callbackFunctionContext: CustomFunctionContext<T>;
};
```

### 3. Callback Function Props

When your function is invoked, it receives specific props that provide necessary information.

```typescript
type CallbackFunctionProps = {
  functionName: string; // Name of the function being called
  functionArgs: Object; // Arguments provided by the AI
  functionContext: CustomFunctionContext<T>; // Your custom context
};
```

## Implementing the Entropy Function

Now, let's implement the entropy function within the context of OpenAssistant. This involves defining the function structure and how it interacts with the assistant.

```typescript
import { CustomFunctionContext } from '@openassistant/core';

/**
 * Sets up the entropy function for the AI Assistant
 * @param context Custom function context containing data retrieval methods
 * @returns Function definition conforming to OpenAssistant's requirements
 */
const entropyFunction = (
  context: CustomFunctionContext<EntropyFunctionContextValues>
): RegisterFunctionCallingProps => {
  return {
    name: 'entropy',
    description: 'Calculate the Shannon entropy of an array of numbers',
    properties: {
      variableName: {
        type: 'string',
        description: 'The name of the variable to calculate entropy for',
      },
    },
    required: ['variableName'],
    callbackFunction: async (functionName, functionArgs, functionContext) => {
      try {
        const { variableName } = functionArgs;
        const data = functionContext.getData(variableName);
        const entropy = calculateEntropy(data);

        return {
          type: 'success',
          name: functionName,
          result: {
            success: true,
            details: `The entropy of ${variableName} is ${entropy.toFixed(2)} bits.`,
          },
        };
      } catch (error) {
        return {
          type: 'error',
          name: functionName,
          message: error.message,
        };
      }
    },
    callbackFunctionContext: context,
  };
};

export default entropyFunction;
```

## Registering the Function with the AI Assistant

With the entropy function defined, the next step is to register it with your AI Assistant. This involves configuring the assistant to recognize and utilize the function when required.

```typescript:src/frontend/App.tsx
import React from 'react';
import { AiAssistant } from '@openassistant/ui';
import entropyFunction from '../backend/entropyFunction';

function App() {
  const testData = {
    temperature: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    revenue: [1000, 1500, 2000, 2500, 3000],
  };

  const assistantProps = {
    modelProvider: 'openai',
    model: 'gpt-4',
    apiKey: 'your-api-key',
    welcomeMessage: 'Hello! I can help you calculate entropy from your data.',
    instructions: 'You are a data analyst who can calculate Shannon entropy from datasets.',
    functions: [
      entropyFunction({
        getData: (variableName: string) => testData[variableName],
      }),
    ],
  };

  return <AiAssistant {...assistantProps} />;
}

export default App;
```

### Explanation

- **Importing the Entropy Function:** We import the `entropyFunction` from our backend where it was defined.
- **Test Data:** We define a `testData` object containing datasets like `temperature` and `revenue`.
- **Assistant Properties:** We configure the assistant with necessary properties, including the model details, API key, welcome message, instructions, and the functions array where we register our `entropyFunction`.
- **Data Retrieval:** The `getData` method within the `entropyFunction` fetches the relevant dataset based on the `variableName` provided by the user.

## Usage Example

Once everything is set up, users can interact with the assistant to calculate entropy for available datasets.

**User:** "What's the entropy of the temperature data?"

**Assistant:** "I'll calculate the Shannon entropy for the temperature values.  
Let me use the entropy function for this.  
The entropy of temperature is 3.32 bits."

## Additional Resources

For more detailed implementation examples and advanced configurations, refer to the following resources:

- **Function Calling Documentation:** [Function Call Tutorial](./function-call.md)
- **Code Snippets and Examples:** Explore the `codeFunctionCalling` export in `HomepageFeatures/code-content.ts`.
- **OpenAssistant Core Documentation:** [OpenAssistant Core](https://github.com/openassistant/core)
- **OpenAssistant UI Documentation:** [OpenAssistant UI](https://github.com/openassistant/ui)

---

By following this guide, you've successfully integrated a custom Shannon entropy function into your AI Assistant, enhancing its ability to analyze and provide insights based on user data. Feel free to extend this approach to incorporate more functions tailored to your application's needs.
