# Type Alias: DataClassifyFunctionArgs

> **DataClassifyFunctionArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `hinge`: `z.ZodOptional`\<`z.ZodNumber`\>; `k`: `z.ZodNumber`; `method`: `z.ZodEnum`\<\[`"quantile"`, `"natural breaks"`, `"equal interval"`, `"percentile"`, `"box"`, `"standard deviation"`, `"unique values"`\]\>; `variableName`: `z.ZodString`; \}\>

Defined in: [packages/tools/geoda/src/data-classify/tool.ts:14](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/geoda/src/data-classify/tool.ts#L14)
