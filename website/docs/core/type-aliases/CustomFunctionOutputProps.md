# Type Alias: CustomFunctionOutputProps\<R, D\>

> **CustomFunctionOutputProps**\<`R`, `D`\>: `object`

Defined in: [types.ts:93](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/types.ts#L93)

Properties for custom function output

## Type Parameters

• **R**

Type of the result sent back to LLM

• **D**

Type of the data used by custom message callback

Example:
```ts
const customFunctionOutput: CustomFunctionOutputProps<string, string> = {
  type: 'custom',
  name: 'createMap',
  args: { datasetId: '123', variable: 'income' },
};
```

## Type declaration

### args?

> `optional` **args**: `Record`\<`string`, `unknown`\>

Arguments passed to the function (e.g. `{datasetId: '123', variable: 'income'}`)

### customMessageCallback?

> `optional` **customMessageCallback**: [`CustomMessageCallback`](CustomMessageCallback.md)

Callback function to create custom UI elements like plots or maps

### data?

> `optional` **data**: `D`

Additional data used by customMessageCallback to create UI elements (e.g. plot, map)

### isIntermediate?

> `optional` **isIntermediate**: `boolean`

Indicates if this is an intermediate step in a multi-step function execution

### name

> **name**: `string`

Name of the function (e.g. createMap, createPlot)

### result

> **result**: `R`

Result of the function execution, sent back to LLM as response

### type

> **type**: `string`

Type of the function, used for type guarding (e.g. 'custom')
