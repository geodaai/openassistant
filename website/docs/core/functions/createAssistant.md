# Function: createAssistant()

> **createAssistant**(`props`): `Promise`\<[`VercelAi`](../classes/VercelAi.md)\>

Defined in: [utils/create-assistant.ts:49](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/utils/create-assistant.ts#L49)

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
