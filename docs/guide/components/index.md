# Components Overview

OpenAssistant provides React components for building interactive data visualization and chat interfaces.

## Available Components

### Chat Components (@openassistant/assistant)

Full-featured chat interface components for building AI-powered chat applications.

**Features:**
- Message display with markdown support
- Code syntax highlighting
- Image and file attachments
- Voice input support
- Settings panel
- Conversation management

[API Reference →](/api/@openassistant/assistant/README)

### Visualization Components

#### ECharts (@openassistant/echarts)

React components for ECharts visualizations.

**Components:**
- HistogramChart
- ScatterPlot
- BoxPlot
- BubbleChart
- ParallelCoordinatePlot
- MoranScatterPlot

[API Reference →](/api/@openassistant/echarts/README)

#### Kepler.gl (@openassistant/keplergl)

React wrapper for Kepler.gl map visualizations.

[API Reference →](/api/@openassistant/keplergl/README)

#### Leaflet (@openassistant/leaflet)

Leaflet map components for React.

[API Reference →](/api/@openassistant/leaflet/README)

#### Vega-Lite (@openassistant/vegalite)

Vega-Lite chart components.

[API Reference →](/api/@openassistant/vegalite/README)

#### Tables (@openassistant/tables)

Data table components with sorting and filtering.

[API Reference →](/api/@openassistant/tables/README)

### Utility Components

#### Common (@openassistant/common)

Shared UI utilities and components.

**Components:**
- ExpandableContainer
- ResizablePlotContainer
- EChartsSkeleton

[API Reference →](/api/@openassistant/common/README)

#### Hooks (@openassistant/hooks)

Reusable React hooks.

**Hooks:**
- useBrushLink
- useDraggable
- useResizeObserver
- useShiftDrag

[API Reference →](/api/@openassistant/hooks/README)

## Installation

```bash
# Chat components
npm install @openassistant/chat

# Visualization components
npm install @openassistant/echarts
npm install @openassistant/keplergl
npm install @openassistant/leaflet
npm install @openassistant/vegalite
npm install @openassistant/tables

# Utilities
npm install @openassistant/common
npm install @openassistant/hooks
```

## Basic Usage

### Chat Component

```tsx
import { ChatContainer, PromptInput } from '@openassistant/chat';

export default function MyChat() {
  return (
    <div>
      <ChatContainer messages={messages} />
      <PromptInput onSubmit={handleSubmit} />
    </div>
  );
}
```

### ECharts Component

```tsx
import { ScatterPlot } from '@openassistant/echarts';

export default function MyChart() {
  return (
    <ScatterPlot
      data={data}
      xField="income"
      yField="housing_price"
      colorField="region"
    />
  );
}
```

## Next Steps

- [Chat Component Guide](/guide/components/chat)
- [Visualization Components](/guide/components/visualization)

