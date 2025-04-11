# Type Alias: inferParameters\<PARAMETERS\>

> **inferParameters**\<`PARAMETERS`\>: `PARAMETERS` *extends* `Schema`\<`unknown`\> ? `PARAMETERS`\[`"_type"`\] : `PARAMETERS` *extends* `z.ZodTypeAny` ? `z.infer`\<`PARAMETERS`\> : `never`

Defined in: [packages/core/src/utils/create-assistant.ts:17](https://github.com/GeoDaCenter/openassistant/blob/95db62ddd98ea06cccc7750f9f0e37556d8bf20e/packages/core/src/utils/create-assistant.ts#L17)

## Type Parameters

• **PARAMETERS** *extends* `Parameters`
