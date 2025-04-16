# @openassistant/common

Common utilities for the OpenAssistant library.

## Hooks

### useBrushLink

A React hook that synchronizes brush selection data between different components using localStorage. This enables cross-component and cross-tab communication for selection/highlighting states.

```tsx
const { brush, clearBrush, getBrushData } = useBrushLink({
  defaultDataId: 'myChart',
  onLink: (highlightedRows, sourceDataId) => {
    // Update your component's highlighting here
  },
});
```

### useDraggable

A React hook that enables drag-and-drop functionality for components. It handles the drag start event and sets up the necessary data transfer.

```tsx
const onDragStart = useDraggable({
  id: 'unique-id',
  type: 'item-type',
  data: {
    /* your data */
  },
});
```

### useShiftDrag

A React hook that enables drag functionality only when the Shift key is pressed. Useful for implementing shift-drag interactions.

```tsx
const { isDragging, onDragStart } = useShiftDrag();
```

## Components

### Expandable Container

A container component that can be expanded and collapsed, with optional drag-and-drop support.

```tsx
<ExpandableContainer
  defaultWidth={800}
  defaultHeight={600}
  draggable={true}
  onExpanded={(isExpanded) => {
    // Handle expansion state change
  }}
>
  {/* Your content */}
</ExpandableContainer>
```

### Resizable Container

A container component that can be resized by dragging its bottom-right corner.

```tsx
<ResizablePlotContainer
  defaultWidth={800}
  defaultHeight={600}
  handlePosition="bottomRight"
>
  {/* Your content */}
</ResizablePlotContainer>
```

### ECharts Skeleton

A skeleton component for ECharts visualizations, providing a loading state for charts.

```tsx
<EChartsSkeleton />
```

## Installation

```bash
npm install @openassistant/common
```
