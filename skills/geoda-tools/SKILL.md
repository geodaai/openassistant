---
name: geoda-tools
description: Use @openassistant/geoda (GeoDa) spatial analysis tools in TypeScript/JavaScript apps (classification, spatial join, weights, Moran/LISA, regression, and common spatial operations).
---

# GeoDa tools (@openassistant/geoda)

Use this skill when you need spatial statistics or vector-geometry operations and you’re building on the OpenAssistant tool format (`OpenAssistantTool`).

## Quick start

1) Import the tool(s) you need from `@openassistant/geoda`.
2) Provide the required `context` functions (many tools intentionally throw until you wire these up).
3) Wrap with `convertToVercelAiTool(...)` (or your adapter) and pass into your LLM call.

```ts
import { dataClassify, spatialWeights, globalMoran } from '@openassistant/geoda';
import { convertToVercelAiTool } from '@openassistant/utils';

const tools = {
  dataClassify: convertToVercelAiTool({
    ...dataClassify,
    context: { getValues: async (datasetName, variableName) => /* number[] */ [] },
  }),
  spatialWeights: convertToVercelAiTool({
    ...spatialWeights,
    context: { getGeometries: async (datasetName) => /* GeoJSON.Feature[] */ [] },
  }),
  globalMoran: convertToVercelAiTool({
    ...globalMoran,
    context: { getValues: async () => [], getGeometries: async () => [] },
  }),
};
```

## Tool map (what to use when)

- `dataClassify`: Compute class breaks for a numeric variable (needs `context.getValues(datasetName, variableName)`).
- `spatialJoin`: Aggregate/join attributes between two geometry datasets (needs `context.getGeometries(...)`; optionally `getValues(...)`; optionally `saveAsDataset(...)`).
- `spatialWeights`: Build weights matrices (queen/rook/knn/threshold) for later spatial stats (needs `context.getGeometries(datasetName)`).
- `globalMoran`: Global Moran’s I spatial autocorrelation (typically use with `spatialWeights`; needs `context.getValues(...)` and (depending on inputs) geometries).
- `lisa`: Local indicators (local Moran/Geary/Getis-Ord/quantile LISA) for clusters/outliers (needs `context.getValues(...)`; weights usually come from `spatialWeights`).
- `spatialRegression`: Spatial regression (OLS + spatial lag/error) (needs `context.getValues(...)`; spatial models also need a `weightsId` from `spatialWeights`).
- `standardizeVariable`: Standardize/normalize a variable (needs `context.getValues(...)`; can optionally save outputs as a dataset depending on `saveData`).
- `rate`: Compute rates/standardizations (needs dataset values; see tool context).
- Spatial ops: `area`, `buffer`, `centroid`, `dissolve`, `grid`, `length`, `perimeter`, `thiessenPolygons`, `mst`, `cartogram` (these operate on geometries; most require `context.getGeometries(datasetName)` and some require `saveAsDataset(...)`).

## Common pitfalls

- Many tools ship with a default `context` that throws; always override the needed functions before calling.
- Be consistent about geometry format: most tools expect GeoJSON features/geometries (and some use GeoDa binary geometry under the hood).
- For LISA / Moran / regression, create weights first (or pass a previously-created `weightsID`) so results are reproducible.
