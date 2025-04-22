# Type Alias: GetWeights()

> **GetWeights**: (`datasetName`, `type`, `options`) => `Promise`\<\{ `weights`: `number`[][]; `weightsMeta`: `WeightsMeta`; \}\>

Defined in: [packages/geoda/src/weights/tool.ts:71](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/geoda/src/weights/tool.ts#L71)

## Parameters

### datasetName

`string`

### type

`"knn"` | `"queen"` | `"rook"` | `"threshold"`

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

#### useCentroids?

`boolean`

## Returns

`Promise`\<\{ `weights`: `number`[][]; `weightsMeta`: `WeightsMeta`; \}\>
