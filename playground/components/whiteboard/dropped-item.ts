import { ScatterplotOutputData } from "@openassistant/echarts/dist/scatterplot/callback-function";

type DroppedMessage = {
  id: string;
  type: 'text';
  message: string;
};

type DroppedTable = {
  id: string;
  type: 'table';
  table: string;
};

type DroppedScatterPlot = {
  id: string;
  type: 'scatterplot';
  message: ScatterplotOutputData;
};

type DroppedMap = {
  id: string;
  type: 'map';
  data: string;
};

export type DroppedItem =
  | DroppedMessage
  | DroppedTable
  | DroppedScatterPlot
  | DroppedMap;


export function isDroppedMessage(item: DroppedItem): item is DroppedMessage {
  return item.type === 'text';
}
