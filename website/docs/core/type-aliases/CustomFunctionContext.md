# Type Alias: CustomFunctionContext\<C\>

> **CustomFunctionContext**\<`C`\>: `object`

Defined in: [types.ts:75](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/core/src/types.ts#L75)

Context object for custom functions. The context object can be used to pass data from your react app to custom functions.
The context object (*) will be used in the following work flow:
1. User sends a prompt to LLM.
2. LLM calls a custom function if needed.
3. The custom function will be executed using the context object e.g. get data from your react app.
4. The custom function will return a result to LLM.
5. The result will be sent back to the UI.
6. The CustomMessageCallback will be used to create a custom message to the UI.

## Type Parameters

• **C**

## Index Signature

\[`key`: `string`\]: `C`

## Param

The key of the context object.

## Param

The value of the context object.
