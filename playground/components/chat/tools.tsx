import {
  dataClassify,
  DataClassifyTool,
  globalMoran,
  GlobalMoranTool,
  lisa,
  LisaTool,
  MoranScatterPlotToolComponent,
  spatialJoin,
  SpatialJoinTool,
  spatialRegression,
  SpatialRegressionTool,
  spatialWeights,
  SpatialWeightsTool,
  SpatialWeightsToolComponent,
  buffer,
  centroid,
  dissolve,
  length,
  area,
  perimeter,
} from 'packages/tools/geoda/dist';
import {
  getUsStateGeojson,
  getUsCountyGeojson,
  getUsZipcodeGeojson,
  queryUSZipcodes,
  geocoding,
  routing,
  isochrone,
  getCachedData,
} from 'packages/tools/osm/dist';
import { PointLayerData } from '@geoda/core';
import { SAMPLE_DATASETS } from './dataset';
import {
  bubbleChart,
  histogram,
  HistogramTool,
  pcp,
  PCPTool,
  scatterplot,
  ScatterplotTool,
  BoxplotTool,
  BubbleChartTool,
  boxplot,
} from 'packages/tools/plots/dist';
import { localQuery } from 'packages/tools/duckdb/dist';
import { KeplerglTool } from 'packages/components/keplergl/dist';
import { keplergl } from 'packages/components/keplergl/dist';

const theme = 'light';
const isDraggable = true;

const getValues = async (datasetName: string, variableName: string) => {
  return (SAMPLE_DATASETS[datasetName] as any[]).map(
    (item) => item[variableName]
  );
};

const getGeometries = async (datasetName: string) => {
  try {
    // get points in [longitude, latitude] array format from dataset
    const points: PointLayerData[] = SAMPLE_DATASETS[datasetName].map(
      (item, index) => ({
        position: [item.longitude, item.latitude],
        index,
        neighbors: [],
      })
    );
    return points;
  } catch (error) {
    // try to get the geometries from cached data
    let geojson = getCachedData(datasetName);
    if (geojson && 'features' in geojson && geojson.features.length > 0) {
      return geojson.features;
    } else {
      throw new Error('No geometries found');
    }
  }
};

// Create the boxplot tool with the getValues implementation
const boxplotTool: BoxplotTool = {
  ...boxplot,
  context: {
    ...boxplot.context,
    getValues: getValues,
    config: {
      ...boxplot.context?.config,
      theme,
      isDraggable,
    },
  },
};

// Create the bubble chart tool with the getValues implementation
const bubbleChartTool: BubbleChartTool = {
  ...bubbleChart,
  context: {
    ...bubbleChart.context,
    getValues: getValues,
    config: {
      ...bubbleChart.context?.config,
      theme,
      isDraggable,
    },
  },
};

const histogramTool: HistogramTool = {
  ...histogram,
  context: {
    ...histogram.context,
    getValues: getValues,
    config: {
      ...histogram.context?.config,
      theme,
      isDraggable,
    },
  },
};

const pcpTool: PCPTool = {
  ...pcp,
  context: {
    ...pcp.context,
    getValues: getValues,
    config: {
      ...pcp.context?.config,
      theme,
      isDraggable,
    },
  },
};

const scatterplotTool: ScatterplotTool = {
  ...scatterplot,
  context: {
    ...scatterplot.context,
    getValues: getValues,
    config: {
      ...scatterplot.context?.config,
      theme,
      isDraggable,
    },
  },
};

// Configure the dataClassify tool
const classifyTool: DataClassifyTool = {
  ...dataClassify,
  context: {
    ...dataClassify.context,
    getValues,
  },
};

const weightsTool: SpatialWeightsTool = {
  ...spatialWeights,
  context: {
    ...spatialWeights.context,
    getGeometries,
  },
  component: SpatialWeightsToolComponent,
};

const globalMoranTool: GlobalMoranTool = {
  ...globalMoran,
  context: {
    ...globalMoran.context,
    getValues,
    config: {
      ...globalMoran.context?.config,
      theme,
      isDraggable,
    },
  },
  component: MoranScatterPlotToolComponent,
};

const regressionTool: SpatialRegressionTool = {
  ...spatialRegression,
  context: {
    ...spatialRegression.context,
    getValues,
  },
};

const lisaTool: LisaTool = {
  ...lisa,
  context: {
    ...lisa.context,
    getValues,
  },
};

const spatialJoinTool: SpatialJoinTool = {
  ...spatialJoin,
  context: {
    ...spatialJoin.context,
    getValues,
    getGeometries,
  },
};

const localQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues,
  },
};

const keplerglTool: KeplerglTool = {
  ...keplergl,
  context: {
    ...keplergl.context,
    getDataset: async (datasetName) => SAMPLE_DATASETS[datasetName],
    config: {
      ...keplergl.context?.config,
      isDraggable,
    },
  },
};

export const tools = {
  boxplot: boxplotTool,
  bubbleChart: bubbleChartTool,
  histogram: histogramTool,
  pcp: pcpTool,
  scatterplot: scatterplotTool,
  dataClassify: classifyTool,
  spatialWeights: weightsTool,
  globalMoran: globalMoranTool,
  spatialRegression: regressionTool,
  lisa: lisaTool,
  spatialJoin: spatialJoinTool,
  getUsStateGeojson,
  getUsZipcodeGeojson,
  getUsCountyGeojson,
  localQuery: localQueryTool,
  keplergl: keplerglTool,
  queryUSZipcodes,
  geocoding,
  routing,
  isochrone,
  buffer,
  centroid,
  dissolve,
  length,
  area,
  perimeter,
};
