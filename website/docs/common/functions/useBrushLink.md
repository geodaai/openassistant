# Function: useBrushLink()

> **useBrushLink**(`options`): `object`

Defined in: [hooks/use-brush-link.tsx:87](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/common/src/hooks/use-brush-link.tsx#L87)

A hook that enables brush data synchronization between different components using localStorage.
This allows multiple charts or components to share selection/highlighting states.

## Parameters

### options

`BrushLinkOptions` = `{}`

Configuration options for the brush link

## Returns

`object`

An object containing:
- brush: Function to update brush selection (params: highlightRowIndices: number[], dataId: string)
- clearBrush: Function to clear brush selection for a specific dataId
- getBrushData: Function to get current brush data for all datasets
- componentId: The unique identifier for this component instance

### brush()

> **brush**: (`highlightRowIndices`, `dataId`) => `void`

#### Parameters

##### highlightRowIndices

`number`[]

##### dataId

`string`

#### Returns

`void`

### clearBrush()

> **clearBrush**: (`dataId`) => `void`

#### Parameters

##### dataId

`string` = `...`

#### Returns

`void`

### componentId

> **componentId**: `string` = `uniqueComponentId.current`

### getBrushData()

> **getBrushData**: () => `any`

#### Returns

`any`

## Remarks

The hook manages brush data in localStorage, enabling cross-component and cross-tab communication.
Each component can either monitor a specific dataset (using defaultDataId) or all datasets.

## Example

```tsx
// --- Basic Usage ---
const MyChart = () => {
  const { brush, clearBrush } = useBrushLink({
    defaultDataId: 'myChart',
    onLink: (highlightedRows, sourceDataId) => {
      // Update your chart's highlighting here
      setHighlightedData(highlightedRows);
    }
  });

  // Trigger brush events
  const onBrushSelection = (selectedIndices) => {
    brush(selectedIndices, 'myChart');
  };
};

// --- Multiple Linked Charts ---
const ChartA = () => {
  const { brush, clearBrush } = useBrushLink({
    defaultDataId: 'chartA',
    onLink: (highlightedRows, sourceDataId) => {
      // React to brush events from any chart
      updateChartAHighlights(highlightedRows);
    }
  });
};

const ChartB = () => {
  const { brush, clearBrush } = useBrushLink({
    defaultDataId: 'chartB',
    onLink: (highlightedRows, sourceDataId) => {
      // sourceDataId tells you which chart triggered the update
      if (sourceDataId === 'chartA') {
        // Handle updates from Chart A
      }
      updateChartBHighlights(highlightedRows);
    }
  });
};
```
