# Type Alias: inferParameters\<PARAMETERS\>

> **inferParameters**\<`PARAMETERS`\>: `PARAMETERS` *extends* `Schema`\<`unknown`\> ? `PARAMETERS`\[`"_type"`\] : `PARAMETERS` *extends* `z.ZodTypeAny` ? `z.infer`\<`PARAMETERS`\> : `never`

Defined in: [packages/core/src/utils/create-assistant.ts:17](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/core/src/utils/create-assistant.ts#L17)

## Type Parameters

• **PARAMETERS** *extends* `Parameters`
