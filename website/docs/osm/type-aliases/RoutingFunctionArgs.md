# Type Alias: RoutingFunctionArgs

> **RoutingFunctionArgs**: `z.ZodObject`\<\{ `destination`: `z.ZodObject`\<\{ `latitude`: `z.ZodNumber`; `longitude`: `z.ZodNumber`; \}\>; `mode`: `z.ZodOptional`\<`z.ZodEnum`\<\[`"driving"`, `"walking"`, `"cycling"`\]\>\>; `origin`: `z.ZodObject`\<\{ `latitude`: `z.ZodNumber`; `longitude`: `z.ZodNumber`; \}\>; \}\>

Defined in: [packages/tools/osm/src/routing.ts:44](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/osm/src/routing.ts#L44)
