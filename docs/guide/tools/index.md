# Tools Overview

OpenAssistant provides a comprehensive suite of AI tools for spatial data analysis and GIS applications. Each tool is designed to be used with AI language models to help users analyze, visualize, and manipulate spatial data.

## Available Tools

### Database Tools

#### DuckDB (@openassistant/duckdb)

Execute SQL queries directly in the browser using DuckDB WASM. Perfect for analyzing large datasets without server infrastructure.

**Key Features:**
- In-browser SQL execution
- Support for complex queries
- Integration with spatial data
- Merge tables functionality

[Learn more →](/guide/tools/duckdb) | [API Reference →](/api/@openassistant/duckdb/README)

### Spatial Analysis Tools

#### GeoDA (@openassistant/geoda)

Comprehensive spatial statistics and analysis tools powered by GeoDa algorithms.

**Key Features:**
- Spatial autocorrelation (Moran's I, Geary's C)
- Local Indicators of Spatial Association (LISA)
- Spatial regression
- Data classification
- Spatial weights creation
- Spatial operations (buffer, dissolve, centroid, etc.)

[Learn more →](/guide/tools/geoda) | [API Reference →](/api/@openassistant/geoda/README)

### Map Tools

#### Map (@openassistant/map)

Tools for creating and manipulating map visualizations with support for Kepler.gl and Leaflet.

**Key Features:**
- Kepler.gl map configuration
- Leaflet map generation
- Data layer management
- Map state serialization

[Learn more →](/guide/tools/map) | [API Reference →](/api/@openassistant/map/README)

### Location Services

#### OpenStreetMap (@openassistant/osm)

Access OpenStreetMap data and services including geocoding, routing, and more.

**Key Features:**
- Geocoding and reverse geocoding
- Route calculation
- Isochrone analysis
- US location data (cities, counties, ZIP codes)

[Learn more →](/guide/tools/osm) | [API Reference →](/api/@openassistant/osm/README)

#### Places (@openassistant/places)

Location intelligence with place search and geotagging capabilities.

**Key Features:**
- Place search
- Geotagging
- Web search with location context

[Learn more →](/guide/tools/places) | [API Reference →](/api/@openassistant/places/README)

### Visualization Tools

#### Plots (@openassistant/plots)

Create statistical visualizations using ECharts and Vega-Lite.

**Key Features:**
- Histograms
- Scatter plots
- Box plots
- Bubble charts
- Parallel coordinate plots
- Statistical computations

[Learn more →](/guide/tools/plots) | [API Reference →](/api/@openassistant/plots/README)

### Spatial Indexing

#### H3 (@openassistant/h3)

Hexagonal spatial indexing using Uber's H3 library.

**Key Features:**
- Convert coordinates to H3 indexes
- Hexagonal grid generation
- Spatial aggregation
- Multi-resolution analysis

[Learn more →](/guide/tools/h3) | [API Reference →](/api/@openassistant/h3/README)

## Common Usage Patterns

### Basic Tool Setup

All tools follow a similar pattern:

```typescript
import { ToolName } from '@openassistant/package';

const tool = new ToolName({
  context: {
    // Application-specific context
  },
});

// Convert to your AI framework
const aiTool = tool.toVercelAiTool(tool);
```

### Tool Chaining

Tools can be used together to create complex workflows:

```typescript
import { LocalQueryTool } from '@openassistant/duckdb';
import { ScatterplotTool } from '@openassistant/plots';

// Query data
const queryResult = await queryTool.execute({
  query: 'SELECT x, y FROM data'
});

// Visualize results
const chart = await scatterplotTool.execute({
  data: queryResult,
  xField: 'x',
  yField: 'y'
});
```

### Error Handling

All tools return structured results with error information:

```typescript
try {
  const result = await tool.execute(params);
  
  if (result.error) {
    console.error('Tool error:', result.error);
  } else {
    console.log('Success:', result.data);
  }
} catch (error) {
  console.error('Execution error:', error);
}
```

## Tool Categories

### Analysis Tools
Tools that perform computations and analysis:
- DuckDB (SQL queries)
- GeoDA (spatial statistics)
- H3 (spatial indexing)

### Data Tools
Tools that fetch or manipulate data:
- OSM (location data)
- Places (place search)
- Map (data layer management)

### Visualization Tools
Tools that create visual outputs:
- Plots (charts and graphs)
- Map (map configurations)

## Performance Tips

1. **Use Tool Caching**: Cache frequently used results
2. **Lazy Loading**: Import tools only when needed
3. **Web Workers**: Run intensive operations in background
4. **Batch Operations**: Combine multiple queries when possible

```typescript
import { ToolCache } from '@openassistant/utils';

const cache = new ToolCache();
const cachedResult = await cache.getOrCompute(
  'query-key',
  () => tool.execute(params)
);
```

## Next Steps

Explore individual tool documentation to learn about specific capabilities and usage examples.

