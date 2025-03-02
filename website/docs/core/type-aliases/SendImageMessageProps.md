# Type Alias: SendImageMessageProps

> **SendImageMessageProps**: `object`

Defined in: [hooks/use-assistant.ts:75](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/hooks/use-assistant.ts#L75)

Parameters for sending an image with optional text to the assistant.

## Type declaration

### imageBase64String

> **imageBase64String**: `string`

### message

> **message**: `string`

### streamMessageCallback

> **streamMessageCallback**: [`StreamMessageCallback`](StreamMessageCallback.md)

## Param

Base64-encoded image data.

## Param

Optional text message to accompany the image.

## Param

Callback function to handle streaming response chunks.
