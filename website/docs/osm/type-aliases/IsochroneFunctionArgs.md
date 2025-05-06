# Type Alias: IsochroneFunctionArgs

> **IsochroneFunctionArgs**: `z.ZodObject`\<\{ `distanceLimit`: `z.ZodOptional`\<`z.ZodNumber`\>; `origin`: `z.ZodObject`\<\{ `latitude`: `z.ZodNumber`; `longitude`: `z.ZodNumber`; \}\>; `polygons`: `z.ZodOptional`\<`z.ZodDefault`\<`z.ZodBoolean`\>\>; `profile`: `z.ZodOptional`\<`z.ZodDefault`\<`z.ZodEnum`\<\[`"driving"`, `"walking"`, `"cycling"`\]\>\>\>; `timeLimit`: `z.ZodOptional`\<`z.ZodDefault`\<`z.ZodNumber`\>\>; \}\>

Defined in: [isochrone.ts:28](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/osm/src/isochrone.ts#L28)
