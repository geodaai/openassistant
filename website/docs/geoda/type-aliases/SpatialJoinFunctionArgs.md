# Type Alias: SpatialJoinFunctionArgs

> **SpatialJoinFunctionArgs**: `z.ZodObject`\<\{ `firstDatasetName`: `z.ZodString`; `joinOperators`: `z.ZodArray`\<`z.ZodEnum`\<\[`"sum"`, `"mean"`, `"min"`, `"max"`, `"median"`, `"count"`\]\>\>; `joinVariableNames`: `z.ZodArray`\<`z.ZodString`\>; `secondDatasetName`: `z.ZodString`; \}\>

Defined in: [packages/geoda/src/spatial\_join/tool.ts:16](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/geoda/src/spatial_join/tool.ts#L16)
