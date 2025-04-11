# Function: ~~bubbleChartFunctionDefinition()~~

> **bubbleChartFunctionDefinition**(`context`): `RegisterFunctionCallingProps`

Defined in: [packages/echarts/src/bubble-chart/definition.ts:75](https://github.com/GeoDaCenter/openassistant/blob/95db62ddd98ea06cccc7750f9f0e37556d8bf20e/packages/echarts/src/bubble-chart/definition.ts#L75)

**`Internal`**

## Parameters

### context

`CustomFunctionContext`\<[`BubbleChartFunctionContextValues`](../type-aliases/BubbleChartFunctionContextValues.md)\>

The context object used by the bubble chart function. See BubbleChartFunctionContext for more details.

:::note
You are responsible to provide the context object, which are `getValues` and `config` as shown in the example above, to the bubble chart function.
:::

## Returns

`RegisterFunctionCallingProps`

Configuration object for function registration

## Deprecated

Use `bubbleChart` tool instead.

## Summary

Defines the bubble chart function for LLM function calling tool.
You can simply pass this function to the `functions` prop in AiAssistant component,
and provide the callback function to get the values of the variables from your own dataset.
For example,

```tsx
const functions = [
  ...otherFunctions,
  bubbleChartFunctionDefinition({
    getValues: async (dataset, variable) => [1, 2, 3],
    config: { theme: 'light' }
  }),
];

...
<AiAssistant
  modelProvider="openai"
  model="gpt-4"
  apiKey="your-api-key"
  functions={functions}
/>
...
```

Then, using the Ai Assistant, users can prompt to create a bubble chart. For example,

```
Can you create a bubble chart to visualize the relationship between GDP, Life Expectancy, and Population in my dataset?
```

:::tip
The bubble chart is particularly useful for visualizing relationships between three or four variables,
where X and Y coordinates represent two variables, bubble size represents a third variable,
and optionally, bubble color can represent a fourth variable.
:::
