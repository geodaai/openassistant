# Function: useBrushLink()

> **useBrushLink**(`__namedParameters`): `object`

Defined in: [hooks/use-brush-link.tsx:62](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/common/src/hooks/use-brush-link.tsx#L62)

This hook is used to link the brush data between different components.

It will save the brush data to the localStorage and listen for the storage changes.
When the storage changes, it will call the onLink callback with the highlighted rows and the dataId.

## Parameters

### \_\_namedParameters

`BrushLinkOptions` = `{}`

## Returns

`object`

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

## Example

```tsx
// Component A
const ChartOne = () => {
  const { brush, clearBrush, componentId } = useBrushLink({
    defaultDataId: 'chart1',
    componentId: 'chart-one', // Optional: provide your own ID
    onLink: (highlightedRows, sourceDataId) => {
      console.log(`Chart One (${componentId}) received update for ${sourceDataId}:`, highlightedRows);
    },
  });

  return (
    <div>
      <button onClick={() => brush([1, 2, 3], 'chart1')}>Select in Chart 1</button>
      <button onClick={() => clearBrush('chart1')}>Clear Chart 1</button>
    </div>
  );
};

// Component B
const ChartTwo = () => {
  const { brush, clearBrush, componentId } = useBrushLink({
    defaultDataId: 'chart2',
    onLink: (highlightedRows, sourceDataId) => {
      console.log(`Chart Two (${componentId}) received update for ${sourceDataId}:`, highlightedRows);
    },
  });

  return (
    <div>
      <button onClick={() => brush([4, 5, 6], 'chart2')}>Select in Chart 2</button>
      <button onClick={() => clearBrush('chart2')}>Clear Chart 2</button>
    </div>
  );
};
```
