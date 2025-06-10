# Variable: ConversationSchema

> `const` **ConversationSchema**: `ZodObject`\<\{ `prompt`: `ZodString`; `response`: `ZodObject`\<\{ `parts`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{\}, `"strip"`, `ZodTypeAny`, \{\}, \{\}\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `parts`: `object`[]; \}, \{ `parts`: `object`[]; \}\>; \}, `"strip"`, `ZodTypeAny`, \{ `prompt`: `string`; `response`: \{ `parts`: `object`[]; \}; \}, \{ `prompt`: `string`; `response`: \{ `parts`: `object`[]; \}; \}\>

Defined in: [packages/core/src/utils/messages.ts:10](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/core/src/utils/messages.ts#L10)
