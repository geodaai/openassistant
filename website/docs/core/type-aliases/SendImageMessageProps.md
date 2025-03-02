# Type Alias: SendImageMessageProps

> **SendImageMessageProps**: `object`

Defined in: [hooks/use-assistant.ts:76](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/core/src/hooks/use-assistant.ts#L76)

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
