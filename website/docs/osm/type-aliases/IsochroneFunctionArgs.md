# Type Alias: IsochroneFunctionArgs

> **IsochroneFunctionArgs**: `z.ZodObject`\<\{ `distanceLimit`: `z.ZodOptional`\<`z.ZodNumber`\>; `origin`: `z.ZodObject`\<\{ `latitude`: `z.ZodNumber`; `longitude`: `z.ZodNumber`; \}\>; `polygons`: `z.ZodOptional`\<`z.ZodDefault`\<`z.ZodBoolean`\>\>; `profile`: `z.ZodOptional`\<`z.ZodDefault`\<`z.ZodEnum`\<\[`"driving"`, `"walking"`, `"cycling"`\]\>\>\>; `timeLimit`: `z.ZodOptional`\<`z.ZodDefault`\<`z.ZodNumber`\>\>; \}\>

Defined in: [packages/tools/osm/src/isochrone.ts:28](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/osm/src/isochrone.ts#L28)
