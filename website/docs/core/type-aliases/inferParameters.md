# Type Alias: inferParameters\<PARAMETERS\>

> **inferParameters**\<`PARAMETERS`\>: `PARAMETERS` *extends* `Schema`\<`unknown`\> ? `PARAMETERS`\[`"_type"`\] : `PARAMETERS` *extends* `z.ZodTypeAny` ? `z.infer`\<`PARAMETERS`\> : `never`

Defined in: [packages/core/src/utils/create-assistant.ts:17](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/utils/create-assistant.ts#L17)

## Type Parameters

• **PARAMETERS** *extends* `Parameters`
