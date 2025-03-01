# Type Alias: inferParameters\<PARAMETERS\>

> **inferParameters**\<`PARAMETERS`\>: `PARAMETERS` *extends* `Schema`\<`unknown`\> ? `PARAMETERS`\[`"_type"`\] : `PARAMETERS` *extends* `z.ZodTypeAny` ? `z.infer`\<`PARAMETERS`\> : `never`

Defined in: [utils/create-assistant.ts:19](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/utils/create-assistant.ts#L19)

## Type Parameters

• **PARAMETERS** *extends* `Parameters`
