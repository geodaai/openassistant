# Type Alias: SendImageMessageProps

> **SendImageMessageProps**: `object`

Defined in: [packages/core/src/hooks/use-assistant.ts:80](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/hooks/use-assistant.ts#L80)

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
