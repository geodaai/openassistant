# Class: ChatHandler

Defined in: [packages/core/src/lib/chat-handler.ts:19](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/lib/chat-handler.ts#L19)

Chat handler class to manage chat requests and responses

## Constructors

### new ChatHandler()

> **new ChatHandler**(`config`): [`ChatHandler`](ChatHandler.md)

Defined in: [packages/core/src/lib/chat-handler.ts:37](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/lib/chat-handler.ts#L37)

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

Defined in: [packages/core/src/lib/chat-handler.ts:136](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/lib/chat-handler.ts#L136)

#### Parameters

##### message

`Message` | `CoreMessage`

#### Returns

`Promise`\<`void`\>

***

### clearHistory()

> **clearHistory**(): `void`

Defined in: [packages/core/src/lib/chat-handler.ts:189](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/lib/chat-handler.ts#L189)

#### Returns

`void`

***

### handleToolCall()

> **handleToolCall**(`__namedParameters`): `Promise`\<`null` \| `ToolInvocation`\>

Defined in: [packages/core/src/lib/chat-handler.ts:141](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/lib/chat-handler.ts#L141)

#### Parameters

##### \_\_namedParameters

###### previousOutput?

[`CustomFunctionOutputProps`](../type-aliases/CustomFunctionOutputProps.md)\<`unknown`, `unknown`\>[]

###### toolCall

`ToolCall`\<`string`, `unknown`\>

#### Returns

`Promise`\<`null` \| `ToolInvocation`\>

***

### processRequest()

> **processRequest**(`req`): `Promise`\<`Response`\>

Defined in: [packages/core/src/lib/chat-handler.ts:59](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/lib/chat-handler.ts#L59)

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

Defined in: [packages/core/src/lib/chat-handler.ts:171](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/lib/chat-handler.ts#L171)

#### Returns

`Promise`\<`void`\>
