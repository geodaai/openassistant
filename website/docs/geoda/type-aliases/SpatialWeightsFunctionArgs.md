# Type Alias: SpatialWeightsFunctionArgs

> **SpatialWeightsFunctionArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `distanceThreshold`: `z.ZodOptional`\<`z.ZodNumber`\>; `includeLowerOrder`: `z.ZodOptional`\<`z.ZodBoolean`\>; `isMile`: `z.ZodOptional`\<`z.ZodBoolean`\>; `k`: `z.ZodOptional`\<`z.ZodNumber`\>; `mapBounds`: `z.ZodOptional`\<`z.ZodArray`\<`z.ZodNumber`\>\>; `orderOfContiguity`: `z.ZodOptional`\<`z.ZodNumber`\>; `precisionThreshold`: `z.ZodOptional`\<`z.ZodNumber`\>; `type`: `z.ZodEnum`\<\[`"knn"`, `"queen"`, `"rook"`, `"threshold"`\]\>; `useCentroids`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}\>

Defined in: [packages/geoda/src/weights/tool.ts:12](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/geoda/src/weights/tool.ts#L12)
