# Class: ChatHandler

Defined in: [lib/chat-handler.ts:19](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/lib/chat-handler.ts#L19)

Chat handler class to manage chat requests and responses

## Constructors

### new ChatHandler()

> **new ChatHandler**(`config`): [`ChatHandler`](ChatHandler.md)

Defined in: [lib/chat-handler.ts:37](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/lib/chat-handler.ts#L37)

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

Defined in: [lib/chat-handler.ts:123](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/lib/chat-handler.ts#L123)

#### Parameters

##### message

`Message` | `CoreMessage`

#### Returns

`Promise`\<`void`\>

***

### clearHistory()

> **clearHistory**(): `void`

Defined in: [lib/chat-handler.ts:173](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/lib/chat-handler.ts#L173)

#### Returns

`void`

***

### handleToolCall()

> **handleToolCall**(`__namedParameters`): `Promise`\<`null` \| `ToolInvocation`\>

Defined in: [lib/chat-handler.ts:128](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/lib/chat-handler.ts#L128)

#### Parameters

##### \_\_namedParameters

###### toolCall

`ToolCall`\<`string`, `unknown`\>

#### Returns

`Promise`\<`null` \| `ToolInvocation`\>

***

### processRequest()

> **processRequest**(`req`): `Promise`\<`Response`\>

Defined in: [lib/chat-handler.ts:59](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/lib/chat-handler.ts#L59)

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

Defined in: [lib/chat-handler.ts:155](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/lib/chat-handler.ts#L155)

#### Returns

`Promise`\<`void`\>
