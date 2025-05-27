# Type Alias: ScatterplotAdditionalData

> **ScatterplotAdditionalData**: `object`

Defined in: [packages/tools/plots/src/echarts/scatterplot/tool.ts:98](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/plots/src/echarts/scatterplot/tool.ts#L98)

## Type declaration

### datasetName

> **datasetName**: `string`

### id

> **id**: `string`

### isDraggable?

> `optional` **isDraggable**: `boolean`

### isExpanded?

> `optional` **isExpanded**: `boolean`

### onSelected?

> `optional` **onSelected**: [`OnSelected`](OnSelected.md)

### regressionResults?

> `optional` **regressionResults**: `object`

#### regressionResults.regression

> **regression**: `object`

#### regressionResults.regression.intercept

> **intercept**: `object`

#### regressionResults.regression.intercept.estimate

> **estimate**: `number`

#### regressionResults.regression.intercept.pValue

> **pValue**: `number`

#### regressionResults.regression.intercept.standardError

> **standardError**: `number`

#### regressionResults.regression.intercept.tStatistic

> **tStatistic**: `number`

#### regressionResults.regression.rSquared

> **rSquared**: `number`

#### regressionResults.regression.slope

> **slope**: `object`

#### regressionResults.regression.slope.estimate

> **estimate**: `number`

#### regressionResults.regression.slope.pValue

> **pValue**: `number`

#### regressionResults.regression.slope.standardError

> **standardError**: `number`

#### regressionResults.regression.slope.tStatistic

> **tStatistic**: `number`

### showLoess?

> `optional` **showLoess**: `boolean`

### showRegressionLine?

> `optional` **showRegressionLine**: `boolean`

### theme?

> `optional` **theme**: `string`

### xData

> **xData**: `number`[]

### xVariableName

> **xVariableName**: `string`

### yData

> **yData**: `number`[]

### yVariableName

> **yVariableName**: `string`
