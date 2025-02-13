import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  BrushComponent,
  ToolboxComponent,
} from 'echarts/components';
import { LineChart, ScatterChart } from 'echarts/charts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useMemo, useRef } from 'react';
import { getSimpleScatterChartOption } from './simple-chart-option';

// Register the required ECharts components
echarts.use([
  TooltipComponent,
  GridComponent,
  ScatterChart,
  CanvasRenderer,
  BrushComponent,
  ToolboxComponent,
  LineChart,
]);

type SimpleScatterPlotProps = {
  datasetName: string;
  variableX: string;
  xData: number[];
  variableY: string;
  yData: number[];
  theme?: string;
  onSelected?: (datasetName: string, filteredIndex: number[]) => void;
  setFilteredIndexes?: (filteredIndex: number[]) => void;
};

export function SimpleScatterPlot({
  datasetName,
  variableX,
  xData,
  variableY,
  yData,
  theme = 'dark',
  onSelected,
  setFilteredIndexes,
}: SimpleScatterPlotProps) {
  // ref for the echarts instance
  const eChartsRef = useRef<ReactEChartsCore>(null);

  // get chart option by calling getChartOption only once
  const option = useMemo(() => {
    return getSimpleScatterChartOption(variableX, xData, variableY, yData);
  }, [variableX, variableY, xData, yData]);

  // bind events for echarts
  const bindEvents = useMemo(
    () => ({
      brushSelected: function (params: {
        batch: Array<{
          selected: Array<{
            dataIndex: number[];
          }>;
        }>;
      }) {
        // onBrushSelected(params, dispatch, datasetId, id, eChartsRef.current?.getEchartsInstance());
        const eChart = eChartsRef.current?.getEchartsInstance();
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

        // Debounce the onSelected callback
        onSelected?.(datasetName || '', brushed);
        if (setFilteredIndexes) {
          setFilteredIndexes(brushed);
        }
      },
    }),
    [onSelected, datasetName, setFilteredIndexes]
  );

  return (
    <div className="h-full w-full">
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        notMerge={true}
        lazyUpdate={false}
        theme={theme}
        onEvents={bindEvents}
        style={{ height: '100%', width: '100%', opacity: '0.8' }}
        ref={eChartsRef}
      />
    </div>
  );
}
