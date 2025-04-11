# Function: parallelCoordinateFunctionDefinition()

> **parallelCoordinateFunctionDefinition**(`context`): `RegisterFunctionCallingProps`

Defined in: [packages/echarts/src/pcp/definition.ts:73](https://github.com/GeoDaCenter/openassistant/blob/7dec66552ed2da789768e26aca21ecb2918b5d3b/packages/echarts/src/pcp/definition.ts#L73)

## Summary

Defines the parallel coordinate function for LLM function calling tool.
You can simply pass this function to the `functions` prop in AiAssistant component,
and provide the callback function to get the values of the variables from your own dataset.
For example,

```tsx
const functions = [
  ...otherFunctions,
  parallelCoordinateFunctionDefinition({
    getValues: async (dataset, variable) => [1, 2, 3],
    config: { theme: 'light', isExpanded: true }
  }),
];

...
<AiAssistant
  modelProvider="openai"
  model="gpt-4o"
  apiKey="your-api-key"
  functions={functions}
/>
...
```

Then, using the Ai Assistant, users can prompt to create a parallel coordinate chart. For example,

```
Can you create a parallel coordinate chart to check the relationship among the 'population', 'revenue' and 'poverty' in my dataset?
```

:::tip
You don't even need to mention *create a parallel coordinate chart*, if this parallel coordinate function is the only function
you provide to examine multiple variables,
the LLM will confirm with you to create a parallel coordinate chart to examine the relationship among the variables.
:::

## Parameters

### context

`CustomFunctionContext`\<`ParallelCoordinateFunctionContextValues`\>

The context object used by the parallel coordinate function. See ParallelCoordinateFunctionContext for more details.

:::note
You are responsible to provide the context object, which are `getValues` and `config` as shown in the example above, to the parallel coordinate function.
:::

## Returns

`RegisterFunctionCallingProps`

Configuration object for function registration
