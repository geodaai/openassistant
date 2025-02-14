# Type Alias: UseAssistantProps

> **UseAssistantProps**: `object`

Defined in: [hooks/use-assistant.ts:35](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/hooks/use-assistant.ts#L35)

Props for the Assistant UI and useAssistant hook.

## Type declaration

### apiKey

> **apiKey**: `string`

### baseUrl?

> `optional` **baseUrl**: `string`

### chatEndpoint?

> `optional` **chatEndpoint**: `string`

### description?

> `optional` **description**: `string`

### functions

> **functions**: `object`[]

### instructions

> **instructions**: `string`

### model

> **model**: `string`

### modelProvider

> **modelProvider**: `string`

### name

> **name**: `string`

### temperature?

> `optional` **temperature**: `number`

### topP?

> `optional` **topP**: `number`

### version

> **version**: `string`

### voiceEndpoint?

> `optional` **voiceEndpoint**: `string`

## Param

The name of the assistant.

## Param

The chat endpoint that handles the chat requests, e.g. '/api/chat'. This is required for server-side support. If not provided, the chat will be handled by the client.

## Param

The model provider.

## Param

The model.

## Param

The API key.

## Param

The version.

## Param

The description.

## Param

The temperature.

## Param

The topP.

## Param

The instructions.

## Param

The functions.

## Param

The name of the function.

## Param

The description of the function.

## Param

The properties of the function.

## Param

The required properties of the function.

## Param

The callback function of the function. See [CallbackFunction](CallbackFunction.md) for more details.

## Param

The context of the callback function. See [CustomFunctionContext](CustomFunctionContext.md) for more details.

## Param

The message of the callback function. See [CustomMessageCallback](CustomMessageCallback.md) for more details.
