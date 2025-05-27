# Variable: StreamMessageSchema

> `const` **StreamMessageSchema**: `ZodObject`\<\{ `parts`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{\}, `"strip"`, `ZodTypeAny`, \{\}, \{\}\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `parts`: `object`[]; \}, \{ `parts`: `object`[]; \}\>

Defined in: [packages/core/src/types.ts:138](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/types.ts#L138)

Type of StreamMessageSchema

## Param

The parts of the message. This is the text that happens after the tool calls.
