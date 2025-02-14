import { EChartsType } from 'echarts';
import debounce from 'lodash/debounce';
import { OnBrushedCallback } from '@openassistant/common';

/**
 * Debounced version of the onSelected callback to prevent too frequent updates
 * when brushing data points.
 * 
 * @param params - Object containing dataset name and filtered indices
 * @param params.datasetName - Name of the dataset being brushed
 * @param params.filteredIndex - Array of indices that are currently brushed
 * @param callback - Optional callback function to handle brush selection
 */
const debouncedOnSelected = debounce(
  (
    params: { datasetName: string; filteredIndex: number[] },
    callback?: OnBrushedCallback
  ) => {
    callback?.(params.filteredIndex, params.datasetName);
  },
  500
);

/**
 * Handles brush selection events from ECharts components.
 * Manages highlighting and callback execution for brushed data points.
 * 
 * @param eChart - ECharts instance
 * @param brushed - Array of indices that are currently brushed
 * @param datasetName - Name of the dataset being brushed
 * @param onSelected - Optional callback function to handle brush selection
 */
export function handleBrushSelection(
  eChart: EChartsType | undefined,
  brushed: number[],
  datasetName: string,
  onSelected?: OnBrushedCallback
) {
  // check if brushed.length is 0 after 100ms, since brushSelected may return empty array for some reason?!
  setTimeout(() => {
    if (eChart && brushed.length === 0) {
      // clear any highlighted if no data is brushed
      eChart.dispatchAction({ type: 'downplay' });
    }
  }, 100);

  if (brushed.length > 0) {
    // Debounce the onSelected callback
    debouncedOnSelected({ datasetName, filteredIndex: brushed }, onSelected);
  }
}

/**
 * Handles the brush selection event from ECharts and processes the selected data indices.
 * 
 * @param params - The brush selection event parameters from ECharts
 * @param params.batch - Array of batch selection data
 * @param params.batch[].selected - Array of selected data information
 * @param params.batch[].selected[].dataIndex - Array of selected data indices
 * @param id - The identifier for the chart instance
 * @param datasetName - Name of the dataset being visualized
 * @param eChart - Optional ECharts instance reference
 * @param onSelected - Optional callback function to handle brush selection
 */
export function onBrushSelected(
  params: {
    batch: {
      selected: {
        dataIndex: number[];
      }[];
    }[];
  },
  id: string,
  datasetName: string,
  eChart?: EChartsType,
  onSelected?: OnBrushedCallback
) {
  if (!id || !params.batch || params.batch.length === 0) {
    return;
  }

  const brushed: number[] = [];
  const brushComponent = params.batch[0];
  for (let sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
    const rawIndices = brushComponent.selected[sIdx].dataIndex;
    // merge rawIndices to brushed
    brushed.push(...rawIndices);
  }

  handleBrushSelection(eChart, brushed, datasetName, onSelected);
}
