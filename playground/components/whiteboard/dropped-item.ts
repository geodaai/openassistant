import {
  ScatterplotOutputData,
  HistogramOutputData,
  BoxplotOutputData,
} from 'packages/tools/plots/dist';
import { CreateMapOutputData } from 'packages/components/keplergl/dist';
import { QueryDuckDBOutputData } from 'packages/tools/duckdb/dist';

type DroppedMessage = {
  id: string;
  type: 'text';
  data: string;
};

type DroppedTable = {
  id: string;
  type: 'query';
  data: QueryDuckDBOutputData;
};

type DroppedScatterPlot = {
  id: string;
  type: 'scatterplot';
  data: ScatterplotOutputData;
};

type DroppedHistogram = {
  id: string;
  type: 'histogram';
  data: HistogramOutputData;
};

type DroppedMap = {
  id: string;
  type: 'map';
  data: CreateMapOutputData;
};

type DroppedBoxplot = {
  id: string;
  type: 'boxplot';
  data: BoxplotOutputData;
};

export type DroppedItem =
  | DroppedMessage
  | DroppedTable
  | DroppedScatterPlot
  | DroppedMap
  | DroppedHistogram
  | DroppedBoxplot;

export function isDroppedMessage(item: DroppedItem): item is DroppedMessage {
  return item.type === 'text';
}
