# Interface: LocalQueryAdditionalData

Defined in: [packages/duckdb/src/types.ts:85](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/duckdb/src/types.ts#L85)

Additional data returned with the query result

## Properties

### columnData

> **columnData**: `Record`\<`string`, `unknown`[]\>

Defined in: [packages/duckdb/src/types.ts:88](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/duckdb/src/types.ts#L88)

***

### datasetName

> **datasetName**: `string`

Defined in: [packages/duckdb/src/types.ts:90](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/duckdb/src/types.ts#L90)

***

### dbTableName

> **dbTableName**: `string`

Defined in: [packages/duckdb/src/types.ts:91](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/duckdb/src/types.ts#L91)

***

### onSelected()?

> `optional` **onSelected**: (`datasetName`, `columnName`, `selectedValues`) => `void`

Defined in: [packages/duckdb/src/types.ts:92](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/duckdb/src/types.ts#L92)

#### Parameters

##### datasetName

`string`

##### columnName

`string`

##### selectedValues

`unknown`[]

#### Returns

`void`

***

### sql

> **sql**: `string`

Defined in: [packages/duckdb/src/types.ts:87](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/duckdb/src/types.ts#L87)

***

### title

> **title**: `string`

Defined in: [packages/duckdb/src/types.ts:86](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/duckdb/src/types.ts#L86)

***

### variableNames

> **variableNames**: `string`[]

Defined in: [packages/duckdb/src/types.ts:89](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/duckdb/src/types.ts#L89)
