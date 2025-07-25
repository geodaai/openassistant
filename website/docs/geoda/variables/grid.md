# Variable: grid

> `const` **grid**: `ExtendedTool`\<[`GridFunctionArgs`](../type-aliases/GridFunctionArgs.md), [`GridLlmResult`](../type-aliases/GridLlmResult.md), [`GridAdditionalData`](../type-aliases/GridAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

Defined in: [packages/tools/geoda/src/spatial\_ops/grid.ts:179](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/geoda/src/spatial_ops/grid.ts#L179)

## grid Tool

This tool creates a grid of polygons that divides a given area into N rows and M columns.

### Grid Creation

This tool creates a grid of polygons that divides a given area into
N rows and M columns. The grid can be created either from the boundary
of a dataset by providing a datasetName, or from the mapBounds of the
current map view. It's useful for spatial analysis, creating regular
grids for sampling, or dividing areas into equal sections.

The tool supports:
- Creating grids from the boundary of geometries in a dataset
- Creating grids from the current map view bounds (mapBounds)
- Customizable number of rows and columns
- Returns grid as polygons that can be used for mapping

Example user prompts:
- "Create a 5x5 grid over this area"
- "Divide this region into a 10 by 8 grid"
- "Generate a grid with 6 rows and 4 columns for this boundary"
- "Create a 3x3 grid for the current map view"
- "Make a grid over the counties dataset with 4 rows and 5 columns"

Example code:
```typescript
import { grid, GridTool } from '@openassistant/geoda';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const gridTool: GridTool = {
  ...grid,
  context: {
  getGeometries: (datasetName) => {
    return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
  },
  },
},
  onToolCompleted: (toolCallId, additionalData) => {
    console.log(toolCallId, additionalData);
    // do something like save the grid result in additionalData
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Create a 5x5 grid over this area',
  tools: {grid: convertToVercelAiTool(gridTool)},
});
```
