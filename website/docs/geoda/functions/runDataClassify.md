# Function: runDataClassify()

> **runDataClassify**(`__namedParameters`): `Promise`\<\{ `additionalData`: \{ `breaks`: `any`; `datasetName`: `string`; `hinge`: `number`; `k`: `number`; `method`: `string`; `variableName`: `string`; \}; `llmResult`: \{ `error`: `undefined`; `result`: \{ `breaks`: `any`; `datasetName`: `string`; `hinge`: `number`; `k`: `number`; `method`: `string`; `variableName`: `string`; \}; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `error`: `string`; `result`: `undefined`; `success`: `boolean`; \}; \}\>

Defined in: [packages/geoda/src/data-classify/tool.ts:215](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/geoda/src/data-classify/tool.ts#L215)

## Parameters

### \_\_namedParameters

#### datasetName

`string`

#### getValues

[`GetValues`](../type-aliases/GetValues.md)

#### hinge?

`number`

#### k

`number`

#### method

`string`

#### variableName

`string`

## Returns

`Promise`\<\{ `additionalData`: \{ `breaks`: `any`; `datasetName`: `string`; `hinge`: `number`; `k`: `number`; `method`: `string`; `variableName`: `string`; \}; `llmResult`: \{ `error`: `undefined`; `result`: \{ `breaks`: `any`; `datasetName`: `string`; `hinge`: `number`; `k`: `number`; `method`: `string`; `variableName`: `string`; \}; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `error`: `string`; `result`: `undefined`; `success`: `boolean`; \}; \}\>
