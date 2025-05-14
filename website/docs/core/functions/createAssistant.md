# Function: createAssistant()

> **createAssistant**(`props`): `Promise`\<[`VercelAi`](../classes/VercelAi.md)\>

Defined in: [packages/core/src/utils/create-assistant.ts:37](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/utils/create-assistant.ts#L37)

Creates an AI assistant instance with the specified configuration

## Parameters

### props

[`UseAssistantProps`](../type-aliases/UseAssistantProps.md)

Configuration properties for the assistant. See [UseAssistantProps](../type-aliases/UseAssistantProps.md) for more details.

## Returns

`Promise`\<[`VercelAi`](../classes/VercelAi.md)\>

Promise that resolves to the configured assistant instance

## Example

```ts
const assistant = await createAssistant({
  modelProvider: 'openai',
  model: 'gpt-4',
  apiKey: 'your-api-key',
  instructions: 'You are a helpful assistant',
  tools: [
    tool({
      description: 'Get the weather in a location',
      parameters: z.object({ location: z.string() }),
      execute: async ({ location }, option) => {
        const getStation = options.context?.getStation;
        const station = getStation ? await getStation(location) : null;
        return { llmResult: `Weather in ${location} from station ${station}.` };
      },
      context: {
        getStation: async (location) => {
          return { station: '123' };
        },
      },
      component: WeatherComponent,
    })
  ]
});
