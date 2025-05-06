# Type Alias: RoutingFunctionArgs

> **RoutingFunctionArgs**: `z.ZodObject`\<\{ `destination`: `z.ZodObject`\<\{ `latitude`: `z.ZodNumber`; `longitude`: `z.ZodNumber`; \}\>; `mode`: `z.ZodOptional`\<`z.ZodEnum`\<\[`"driving"`, `"walking"`, `"cycling"`\]\>\>; `origin`: `z.ZodObject`\<\{ `latitude`: `z.ZodNumber`; `longitude`: `z.ZodNumber`; \}\>; \}\>

Defined in: [routing.ts:43](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/osm/src/routing.ts#L43)
