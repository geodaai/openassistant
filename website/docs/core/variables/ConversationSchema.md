# Variable: ConversationSchema

> `const` **ConversationSchema**: `ZodObject`\<\{ `prompt`: `ZodString`; `response`: `ZodObject`\<\{ `parts`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{\}, `"strip"`, `ZodTypeAny`, \{\}, \{\}\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `parts`: `object`[]; \}, \{ `parts`: `object`[]; \}\>; \}, `"strip"`, `ZodTypeAny`, \{ `prompt`: `string`; `response`: \{ `parts`: `object`[]; \}; \}, \{ `prompt`: `string`; `response`: \{ `parts`: `object`[]; \}; \}\>

Defined in: [packages/core/src/utils/messages.ts:10](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/utils/messages.ts#L10)
