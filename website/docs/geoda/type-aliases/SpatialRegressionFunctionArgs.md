# Type Alias: SpatialRegressionFunctionArgs

> **SpatialRegressionFunctionArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `dependentVariable`: `z.ZodString`; `independentVariables`: `z.ZodArray`\<`z.ZodString`\>; `modelType`: `z.ZodEnum`\<\[`"classic"`, `"spatial-lag"`, `"spatial-error"`\]\>; `weightsId`: `z.ZodOptional`\<`z.ZodString`\>; \}\>

Defined in: [packages/geoda/src/regression/tool.ts:13](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/geoda/src/regression/tool.ts#L13)
