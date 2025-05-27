# Type Alias: GetWeights()

> **GetWeights**: (`datasetName`, `type`, `options`) => `Promise`\<\{ `weights`: `number`[][]; `weightsMeta`: `WeightsMeta`; \}\>

Defined in: [packages/tools/geoda/src/weights/tool.ts:131](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/geoda/src/weights/tool.ts#L131)

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
