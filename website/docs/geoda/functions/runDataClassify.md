# Function: runDataClassify()

> **runDataClassify**(`__namedParameters`): `Promise`\<\{ `additionalData`: \{ `breaks`: `any`; `datasetName`: `string`; `hinge`: `number`; `k`: `number`; `method`: `string`; `variableName`: `string`; \}; `llmResult`: \{ `error`: `undefined`; `result`: \{ `breaks`: `any`; `datasetName`: `string`; `hinge`: `number`; `k`: `number`; `method`: `string`; `variableName`: `string`; \}; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `error`: `string`; `result`: `undefined`; `success`: `boolean`; \}; \}\>

Defined in: [packages/geoda/src/data-classify/tool.ts:209](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/geoda/src/data-classify/tool.ts#L209)

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
