# Type Alias: IsochroneFunctionArgs

> **IsochroneFunctionArgs**: `z.ZodObject`\<\{ `distanceLimit`: `z.ZodOptional`\<`z.ZodNumber`\>; `origin`: `z.ZodObject`\<\{ `latitude`: `z.ZodNumber`; `longitude`: `z.ZodNumber`; \}\>; `polygons`: `z.ZodOptional`\<`z.ZodDefault`\<`z.ZodBoolean`\>\>; `profile`: `z.ZodOptional`\<`z.ZodDefault`\<`z.ZodEnum`\<\[`"driving"`, `"walking"`, `"cycling"`\]\>\>\>; `timeLimit`: `z.ZodOptional`\<`z.ZodDefault`\<`z.ZodNumber`\>\>; \}\>

Defined in: [isochrone.ts:28](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/osm/src/isochrone.ts#L28)
