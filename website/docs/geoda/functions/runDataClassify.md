# Function: runDataClassify()

> **runDataClassify**(`__namedParameters`): `Promise`\<\{ `additionalData`: \{ `breaks`: `any`; `datasetName`: `string`; `hinge`: `number`; `k`: `number`; `method`: `string`; `variableName`: `string`; \}; `llmResult`: \{ `error`: `undefined`; `result`: \{ `breaks`: `any`; `datasetName`: `string`; `hinge`: `number`; `k`: `number`; `method`: `string`; `variableName`: `string`; \}; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `error`: `string`; `result`: `undefined`; `success`: `boolean`; \}; \}\>

Defined in: [packages/geoda/src/data-classify/tool.ts:215](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/geoda/src/data-classify/tool.ts#L215)

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
