# Function: boxplotTool()

> **boxplotTool**(`props`): `RegisterFunctionCallingProps`

Defined in: [boxplot/definition.ts:142](https://github.com/GeoDaCenter/openassistant/blob/a5eebdb32e6bf1b6b4eedf634485568edcefaa57/packages/echarts/src/boxplot/definition.ts#L142)

This function creates a boxplot tool, which can be used to create a box plot using natural language prompts, e.g. *"Create a box plot of the variable 'age'"*.

To use this tool, you need to provide the implementation of the `getValues` function.
This function will be used to retrieve the values of the variable from the dataset.
Note: the values are only used to create the box plot, and are not sent to the LLM.

For example:

```ts
const functions = [
  ...,
  boxplotTool({
    getValues: async (datasetName, variableName) => {
      // retrieve the values of the variable from the dataset
      return datasets[datasetName][variableName];
    },
  }),
];
```

You can also provide a custom React component to render the box plot.
See [BoxplotToolProps](../type-aliases/BoxplotToolProps.md) for more details.

The default definition of this boxplot tool is [BoxplotFunction](../variables/BoxplotFunction.md).
You can override the default definition by providing the `tool` property.

## Parameters

### props

[`BoxplotToolProps`](../type-aliases/BoxplotToolProps.md)

The properties of the boxplot tool. See [BoxplotToolProps](../type-aliases/BoxplotToolProps.md) for more details.

## Returns

`RegisterFunctionCallingProps`

The function definition.
