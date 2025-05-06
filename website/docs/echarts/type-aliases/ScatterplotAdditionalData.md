# Type Alias: ScatterplotAdditionalData

> **ScatterplotAdditionalData**: `object`

Defined in: [scatterplot/tool.ts:101](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/echarts/src/scatterplot/tool.ts#L101)

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
