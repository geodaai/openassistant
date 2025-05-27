# Function: createAssistant()

> **createAssistant**(`props`): `Promise`\<[`VercelAi`](../classes/VercelAi.md) \| [`OpenAIAssistant`](../classes/OpenAIAssistant.md) \| [`DeepSeekAssistant`](../classes/DeepSeekAssistant.md) \| [`GoogleAIAssistant`](../classes/GoogleAIAssistant.md) \| [`XaiAssistant`](../classes/XaiAssistant.md) \| [`OllamaAssistant`](../classes/OllamaAssistant.md) \| `AnthropicAssistant`\>

Defined in: [packages/core/src/utils/create-assistant.ts:42](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/utils/create-assistant.ts#L42)

Creates an AI assistant instance with the specified configuration

## Parameters

### props

[`UseAssistantProps`](../type-aliases/UseAssistantProps.md)

Configuration properties for the assistant. See [UseAssistantProps](../type-aliases/UseAssistantProps.md) for more details.

## Returns

`Promise`\<[`VercelAi`](../classes/VercelAi.md) \| [`OpenAIAssistant`](../classes/OpenAIAssistant.md) \| [`DeepSeekAssistant`](../classes/DeepSeekAssistant.md) \| [`GoogleAIAssistant`](../classes/GoogleAIAssistant.md) \| [`XaiAssistant`](../classes/XaiAssistant.md) \| [`OllamaAssistant`](../classes/OllamaAssistant.md) \| `AnthropicAssistant`\>

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
