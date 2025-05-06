# Type Alias: DataClassifyFunctionArgs

> **DataClassifyFunctionArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `hinge`: `z.ZodOptional`\<`z.ZodNumber`\>; `k`: `z.ZodNumber`; `method`: `z.ZodEnum`\<\[`"quantile"`, `"natural breaks"`, `"equal interval"`, `"percentile"`, `"box"`, `"standard deviation"`, `"unique values"`\]\>; `variableName`: `z.ZodString`; \}\>

Defined in: [packages/geoda/src/data-classify/tool.ts:14](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/geoda/src/data-classify/tool.ts#L14)
