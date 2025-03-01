# Function: createAssistant()

> **createAssistant**(`props`): `Promise`\<[`VercelAi`](../classes/VercelAi.md)\>

Defined in: [utils/create-assistant.ts:179](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/utils/create-assistant.ts#L179)

Creates an AI assistant instance with the specified configuration

## Parameters

### props

[`UseAssistantProps`](../type-aliases/UseAssistantProps.md)

Configuration properties for the assistant

## Returns

`Promise`\<[`VercelAi`](../classes/VercelAi.md)\>

Promise that resolves to the configured assistant instance

## Example

```ts
const assistant = await createAssistant({
  modelProvider: 'openai',
  model: 'gpt-4',
  apiKey: 'your-api-key',
  instructions: 'You are a helpful assistant'
});
```
