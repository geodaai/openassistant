# Variable: StreamMessageSchema

> `const` **StreamMessageSchema**: `ZodObject`\<\{ `parts`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{\}, `"strip"`, `ZodTypeAny`, \{\}, \{\}\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `parts`: `object`[]; \}, \{ `parts`: `object`[]; \}\>

Defined in: [packages/core/src/types.ts:139](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/types.ts#L139)

Type of StreamMessageSchema

## Param

The parts of the message. This is the text that happens after the tool calls.
