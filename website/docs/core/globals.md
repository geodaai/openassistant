# @openassistant/core

## Classes

- [ChatHandler](classes/ChatHandler.md)
- [DeepSeekAssistant](classes/DeepSeekAssistant.md)
- [GoogleAIAssistant](classes/GoogleAIAssistant.md)
- [OllamaAssistant](classes/OllamaAssistant.md)
- [OpenAIAssistant](classes/OpenAIAssistant.md)
- [VercelAi](classes/VercelAi.md)
- [VercelAiClient](classes/VercelAiClient.md)
- [VoiceHandler](classes/VoiceHandler.md)
- [WhisperVoiceHandler](classes/WhisperVoiceHandler.md)
- [XaiAssistant](classes/XaiAssistant.md)

## Interfaces

- [MessageImageContentProps](interfaces/MessageImageContentProps.md)
- [VercelAiClientConfigureProps](interfaces/VercelAiClientConfigureProps.md)

## Type Aliases

- [AIMessage](type-aliases/AIMessage.md)
- [AudioToTextProps](type-aliases/AudioToTextProps.md)
- [CallbackFunction](type-aliases/CallbackFunction.md)
- [CallbackFunctionProps](type-aliases/CallbackFunctionProps.md)
- [Conversation](type-aliases/Conversation.md)
- [CustomFunctionCall](type-aliases/CustomFunctionCall.md)
- [CustomFunctionContext](type-aliases/CustomFunctionContext.md)
- [CustomFunctionContextCallback](type-aliases/CustomFunctionContextCallback.md)
- [CustomFunctionOutputProps](type-aliases/CustomFunctionOutputProps.md)
- [CustomFunctions](type-aliases/CustomFunctions.md)
- [CustomMessageCallback](type-aliases/CustomMessageCallback.md)
- [ErrorCallbackResult](type-aliases/ErrorCallbackResult.md)
- [ExtendedTool](type-aliases/ExtendedTool.md)
- [inferParameters](type-aliases/inferParameters.md)
- [MessageDirection](type-aliases/MessageDirection.md)
- [MessageModel](type-aliases/MessageModel.md)
- [MessagePayload](type-aliases/MessagePayload.md)
- [MessageType](type-aliases/MessageType.md)
- [OpenAIConfigProps](type-aliases/OpenAIConfigProps.md)
- [ProcessImageMessageProps](type-aliases/ProcessImageMessageProps.md)
- [ProcessMessageProps](type-aliases/ProcessMessageProps.md)
- [RegisterFunctionCallingProps](type-aliases/RegisterFunctionCallingProps.md)
- [SendImageMessageProps](type-aliases/SendImageMessageProps.md)
- [SendTextMessageProps](type-aliases/SendTextMessageProps.md)
- [StreamMessage](type-aliases/StreamMessage.md)
- [StreamMessageCallback](type-aliases/StreamMessageCallback.md)
- [StreamMessagePart](type-aliases/StreamMessagePart.md)
- [TextPart](type-aliases/TextPart.md)
- [ToolCallComponent](type-aliases/ToolCallComponent.md)
- [ToolCallComponents](type-aliases/ToolCallComponents.md)
- [ToolCallElement](type-aliases/ToolCallElement.md)
- [ToolCallMessage](type-aliases/ToolCallMessage.md)
- [ToolPart](type-aliases/ToolPart.md)
- [TriggerRequestOutput](type-aliases/TriggerRequestOutput.md)
- [UseAssistantProps](type-aliases/UseAssistantProps.md)
- [UserActionProps](type-aliases/UserActionProps.md)
- [VercelFunctionTool](type-aliases/VercelFunctionTool.md)
- [VercelToolSet](type-aliases/VercelToolSet.md)

## Variables

- [ConversationSchema](variables/ConversationSchema.md)
- [StreamMessageSchema](variables/StreamMessageSchema.md)
- [TextPartSchema](variables/TextPartSchema.md)
- [ToolCallMessageSchema](variables/ToolCallMessageSchema.md)
- [ToolPartSchema](variables/ToolPartSchema.md)

## Functions

- [convertOpenAIToolsToVercelTools](functions/convertOpenAIToolsToVercelTools.md)
- [createAssistant](functions/createAssistant.md)
- [GetAssistantModelByProvider](functions/GetAssistantModelByProvider.md)
- [isAssistantMessageWithCompletedToolCalls](functions/isAssistantMessageWithCompletedToolCalls.md)
- [isOpenAIFunctionTool](functions/isOpenAIFunctionTool.md)
- [isVercelFunctionTool](functions/isVercelFunctionTool.md)
- [rebuildMessages](functions/rebuildMessages.md)
- [shouldTriggerNextRequest](functions/shouldTriggerNextRequest.md)
- [tool](functions/tool.md)
- [useAssistant](functions/useAssistant.md)
