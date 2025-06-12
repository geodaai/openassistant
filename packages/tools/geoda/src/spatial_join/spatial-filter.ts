import { spatialJoin } from './tool';

export const spatialFilter = {
  ...spatialJoin,
  description: `Filter the geometries (points, lines, or polygons) from the left dataset that are spatially joined with the geometries from the right dataset.
Please Note:
1. The left dataset should be the dataset that contains the geometries to be filtered (e.g. points).
2. The right dataset should be the dataset that contains the geometries to be used for filtering (e.g. polygons).
3. joinVariables should be empty arrays.
`,
};
