# Type Alias: GetWeights()

> **GetWeights**: (`datasetName`, `type`, `options`) => `Promise`\<\{ `weights`: `number`[][]; `weightsMeta`: `WeightsMeta`; \}\>

Defined in: [packages/geoda/src/weights/tool.ts:80](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/geoda/src/weights/tool.ts#L80)

## Parameters

### datasetName

`string`

### type

`"knn"` | `"queen"` | `"rook"` | `"distance"` | `"kernel"`

### options

#### distanceThreshold?

`number`

#### includeLowerOrder?

`boolean`

#### isMile?

`boolean`

#### k?

`number`

#### orderOfContiguity?

`number`

#### precisionThreshold?

`number`

## Returns

`Promise`\<\{ `weights`: `number`[][]; `weightsMeta`: `WeightsMeta`; \}\>
