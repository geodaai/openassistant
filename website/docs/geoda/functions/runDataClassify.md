# Function: runDataClassify()

> **runDataClassify**(`__namedParameters`): `Promise`\<\{ `additionalData`: \{ `breaks`: `any`; `datasetName`: `string`; `hinge`: `number`; `k`: `number`; `method`: `string`; `variableName`: `string`; \}; `llmResult`: \{ `error`: `undefined`; `result`: \{ `breaks`: `any`; `datasetName`: `string`; `hinge`: `number`; `k`: `number`; `method`: `string`; `variableName`: `string`; \}; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `error`: `string`; `result`: `undefined`; `success`: `boolean`; \}; \}\>

Defined in: [packages/geoda/src/data-classify/tool.ts:209](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/geoda/src/data-classify/tool.ts#L209)

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
