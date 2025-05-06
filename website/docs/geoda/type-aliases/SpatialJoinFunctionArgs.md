# Type Alias: SpatialJoinFunctionArgs

> **SpatialJoinFunctionArgs**: `z.ZodObject`\<\{ `firstDatasetName`: `z.ZodString`; `joinOperators`: `z.ZodArray`\<`z.ZodEnum`\<\[`"sum"`, `"mean"`, `"min"`, `"max"`, `"median"`, `"count"`\]\>\>; `joinVariableNames`: `z.ZodArray`\<`z.ZodString`\>; `secondDatasetName`: `z.ZodString`; \}\>

Defined in: [packages/geoda/src/spatial\_join/tool.ts:16](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/geoda/src/spatial_join/tool.ts#L16)
