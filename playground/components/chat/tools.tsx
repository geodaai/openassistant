import {
  dataClassify,
  DataClassifyTool,
  GetGeometries,
  getUsStateGeojson,
  getUsZipcodeGeojson,
  getUsCountyGeojson,
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
} from '@openassistant/geoda';
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
} from '@openassistant/echarts';
import { BubbleChartTool } from '@openassistant/echarts';
import { boxplot } from '@openassistant/echarts';
import { BoxplotTool } from '@openassistant/echarts';
import { localQuery } from '@openassistant/duckdb';
import { KeplerglTool } from '@openassistant/keplergl';
import { keplergl } from '@openassistant/keplergl';

const theme = 'light';
const isDraggable = true;

const getValues = async (datasetName: string, variableName: string) => {
  return (SAMPLE_DATASETS[datasetName] as any[]).map(
    (item) => item[variableName]
  );
};

const getGeometries: GetGeometries = async (datasetName: string) => {
  // get points in [longitude, latitude] array format from dataset
  const points: PointLayerData[] = SAMPLE_DATASETS[datasetName].map(
    (item, index) => ({
      position: [item.longitude, item.latitude],
      index,
      neighbors: [],
    })
  );
  return points;
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
    getDataset: async ({ datasetName }) => SAMPLE_DATASETS[datasetName],
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
};
