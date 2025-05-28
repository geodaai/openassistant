import {
  dataClassify,
  DataClassifyTool,
  globalMoran,
  GlobalMoranTool,
  lisa,
  LisaTool,
  spatialJoin,
  SpatialJoinTool,
  spatialRegression,
  SpatialRegressionTool,
  spatialWeights,
  SpatialWeightsTool,
  buffer,
  centroid,
  dissolve,
  length,
  area,
  perimeter,
} from '@openassistant/geoda';
import {
  getUsStateGeojson,
  getUsCountyGeojson,
  getUsZipcodeGeojson,
  queryUSZipcodes,
  geocoding,
  routing,
  isochrone,
} from '@openassistant/osm';
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
} from '@openassistant/plots';
import { localQuery } from '@openassistant/duckdb';
import { keplergl, KeplerglTool } from '@openassistant/map';
import { SpatialWeightsComponent } from '@openassistant/tables';
import { MoranScatterComponent } from '@openassistant/echarts';
import { KeplerGlComponent } from '@openassistant/keplergl';

const theme = 'light';
const isDraggable = true;

const datasetCache = new Map<string, unknown>();

// use onToolCompleted to cache datasets from some tools
const onToolCompleted = (toolCallId: string, additionalData: unknown) => {
  // find the dataset from the tool results and cache it
  if (
    additionalData &&
    typeof additionalData === 'object' &&
    'datasetName' in additionalData
  ) {
    const datasetName = additionalData.datasetName as string;
    if (datasetName && datasetName in additionalData) {
      const dataset = additionalData[datasetName];
      datasetCache.set(datasetName, dataset);
    }
  }
};

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
    let geojson = datasetCache.get(datasetName);
    if (geojson && typeof geojson === 'object' && 'features' in geojson) {
      return geojson.features as GeoJSON.Feature[];
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
  component: SpatialWeightsComponent,
};

const globalMoranTool: GlobalMoranTool = {
  ...globalMoran,
  context: {
    ...globalMoran.context,
    getValues,
  },
  component: MoranScatterComponent,
};

const regressionTool: SpatialRegressionTool = {
  ...spatialRegression,
  context: {
    ...spatialRegression.context,
    getValues,
  },
  onToolCompleted,
};

const lisaTool: LisaTool = {
  ...lisa,
  context: {
    ...lisa.context,
    getValues,
  },
  onToolCompleted,
};

const spatialJoinTool: SpatialJoinTool = {
  ...spatialJoin,
  context: {
    ...spatialJoin.context,
    getValues,
    getGeometries,
  },
  onToolCompleted,
};

const localQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues,
  },
  onToolCompleted,
};

const keplerglTool: KeplerglTool = {
  ...keplergl,
  context: {
    ...keplergl.context,
    getDataset: async (datasetName) => SAMPLE_DATASETS[datasetName],
  },
  component: KeplerGlComponent,
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
