# Class: ChatHandler

Defined in: [packages/core/src/lib/chat-handler.ts:17](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/lib/chat-handler.ts#L17)

Chat handler class to manage chat requests and responses

## Constructors

### new ChatHandler()

> **new ChatHandler**(`config`): [`ChatHandler`](ChatHandler.md)

Defined in: [packages/core/src/lib/chat-handler.ts:34](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/lib/chat-handler.ts#L34)

#### Parameters

##### config

Configuration object

###### instructions?

`string`

Optional system instructions

###### maxTokens?

`number` = `...`

###### model

`LanguageModelV1`

Language model instance to use for chat

###### tools?

`ToolSet`

Optional tools configuration

#### Returns

[`ChatHandler`](ChatHandler.md)

## Methods

### addMessageToHistory()

> **addMessageToHistory**(`message`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib/chat-handler.ts:122](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/lib/chat-handler.ts#L122)

#### Parameters

##### message

`CoreMessage` | `Message`

#### Returns

`Promise`\<`void`\>

***

### clearHistory()

> **clearHistory**(): `void`

Defined in: [packages/core/src/lib/chat-handler.ts:167](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/lib/chat-handler.ts#L167)

#### Returns

`void`

***

### handleToolCall()

> **handleToolCall**(`toolCall`): `Promise`\<`null` \| `ToolInvocation`\>

Defined in: [packages/core/src/lib/chat-handler.ts:127](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/lib/chat-handler.ts#L127)

#### Parameters

##### toolCall

`ToolCall`\<`string`, `unknown`\>

#### Returns

`Promise`\<`null` \| `ToolInvocation`\>

***

### processRequest()

> **processRequest**(`req`): `Promise`\<`Response`\>

Defined in: [packages/core/src/lib/chat-handler.ts:56](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/lib/chat-handler.ts#L56)

Processes chat requests, managing message history and token limits

#### Parameters

##### req

`Request`

Incoming request object

#### Returns

`Promise`\<`Response`\>

Streaming response

***

### trimHistoryByTokenLimit()

> **trimHistoryByTokenLimit**(): `Promise`\<`void`\>

Defined in: [packages/core/src/lib/chat-handler.ts:149](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/lib/chat-handler.ts#L149)

#### Returns

`Promise`\<`void`\>
