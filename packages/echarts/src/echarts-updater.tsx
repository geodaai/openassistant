import { EChartsType } from 'echarts';
import debounce from 'lodash/debounce';
import { OnBrushedCallback } from '@openassistant/common';

const debouncedOnSelected = debounce(
  (
    params: { datasetName: string; filteredIndex: number[] },
    callback?: OnBrushedCallback
  ) => {
    callback?.(params.filteredIndex, params.datasetName);
  },
  500
);

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
