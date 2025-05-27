# Type Alias: SpatialRegressionFunctionArgs

> **SpatialRegressionFunctionArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `dependentVariable`: `z.ZodString`; `independentVariables`: `z.ZodArray`\<`z.ZodString`\>; `modelType`: `z.ZodEnum`\<\[`"classic"`, `"spatial-lag"`, `"spatial-error"`\]\>; `weightsId`: `z.ZodOptional`\<`z.ZodString`\>; \}\>

Defined in: [packages/tools/geoda/src/regression/tool.ts:13](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/geoda/src/regression/tool.ts#L13)
