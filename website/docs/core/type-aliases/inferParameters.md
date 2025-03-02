# Type Alias: inferParameters\<PARAMETERS\>

> **inferParameters**\<`PARAMETERS`\>: `PARAMETERS` *extends* `Schema`\<`unknown`\> ? `PARAMETERS`\[`"_type"`\] : `PARAMETERS` *extends* `z.ZodTypeAny` ? `z.infer`\<`PARAMETERS`\> : `never`

Defined in: [utils/create-assistant.ts:19](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/utils/create-assistant.ts#L19)

## Type Parameters

• **PARAMETERS** *extends* `Parameters`
