# Type Alias: DataClassifyFunctionArgs

> **DataClassifyFunctionArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `hinge`: `z.ZodOptional`\<`z.ZodNumber`\>; `k`: `z.ZodNumber`; `method`: `z.ZodEnum`\<\[`"quantile"`, `"natural breaks"`, `"equal interval"`, `"percentile"`, `"box"`, `"standard deviation"`, `"unique values"`\]\>; `variableName`: `z.ZodString`; \}\>

Defined in: [packages/tools/geoda/src/data-classify/tool.ts:14](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/geoda/src/data-classify/tool.ts#L14)
