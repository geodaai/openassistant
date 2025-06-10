# Type Alias: SpatialRegressionFunctionArgs

> **SpatialRegressionFunctionArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `dependentVariable`: `z.ZodString`; `independentVariables`: `z.ZodArray`\<`z.ZodString`\>; `modelType`: `z.ZodEnum`\<\[`"classic"`, `"spatial-lag"`, `"spatial-error"`\]\>; `weightsId`: `z.ZodOptional`\<`z.ZodString`\>; \}\>

Defined in: [packages/tools/geoda/src/regression/tool.ts:13](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/geoda/src/regression/tool.ts#L13)
