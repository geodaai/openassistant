import { useMemo, useRef, useState } from 'react';
import ReactEChartsCore from 'echarts-for-react';

import {
  use as echartsUse,
  registerTheme as echartsRegisterTheme,
} from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  BrushComponent,
  ToolboxComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { ECHARTS_DARK_THEME } from '../../echarts-theme';

import { getHistogramChartOption } from './histogram-option';
import { HistogramDataProps } from './histogram-option';
import '../../index.css';

echartsUse([
  BarChart,
  GridComponent,
  TooltipComponent,
  BrushComponent,
  ToolboxComponent,
  CanvasRenderer,
]);

echartsRegisterTheme('dark', ECHARTS_DARK_THEME);

export type HistogramOutputData = {
  id?: string;
  datasetName: string;
  variableName: string;
  histogramData: HistogramDataProps[];
  barDataIndexes: number[][];
  onSelected?: (datasetName: string, selectedIndices: number[]) => void;
  theme?: string;
  isExpanded?: boolean;
  isDraggable?: boolean;
};

export function HistogramComponent({
  datasetName,
  histogramData,
  barDataIndexes,
  variableName,
  onSelected,
  theme,
}: HistogramOutputData): JSX.Element | null {
  // get chart option by calling getChartOption only once
  const option = useMemo(() => {
    try {
      return getHistogramChartOption(null, histogramData, barDataIndexes);
    } catch {
      return {};
    }
  }, [histogramData, barDataIndexes]);

  const eChartsRef = useRef<ReactEChartsCore>(null);
  // track if the chart has been rendered, so we can update the chart later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rendered, setRendered] = useState(false);

  // bind events for brush selection in eCharts Histogram
  const bindEvents = useMemo(() => {
    return {
      brushSelected: function (params: {
        batch: Array<{
          selected: Array<{
            dataIndex: number[];
          }>;
        }>;
      }) {
        const brushed: number[] = [];
        const brushComponent = params.batch[0];

        for (let sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
          const rawIndices = brushComponent.selected[sIdx]
            .dataIndex as number[];
          brushed.push(...rawIndices);
        }

        // get selected ids from brushed bars
        const filteredIndex =
          brushed.length > 0
            ? brushed.map((idx: number) => barDataIndexes[idx]).flat()
            : [];

        // check if this plot is in state.plots
        if (brushed.length === 0) {
          // reset options
          const chart = eChartsRef.current;
          if (chart) {
            const chartInstance = chart.getEchartsInstance();
            const updatedOption = getHistogramChartOption(
              null,
              histogramData ?? [],
              barDataIndexes ?? []
            );
            chartInstance.setOption(updatedOption);
          }
        }
        // Dispatch action to highlight selected in other components
        onSelected?.(datasetName ?? '', filteredIndex);
      },
    };
  }, [datasetName, onSelected, histogramData, barDataIndexes]);

  if (!variableName || !histogramData || !barDataIndexes) {
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col rounded-lg pt-6 text-gray-900 shadow-secondary-1  dark:text-gray-100">
      <div className="flex-col items-start p-2">
        <p className="text-tiny font-bold uppercase">{variableName}</p>
        <small className="truncate text-default-500">{variableName}</small>
      </div>
      <div style={{ height: '100%' }} className="py-2 flex-grow">
        <ReactEChartsCore
          option={option}
          notMerge={true}
          lazyUpdate={true}
          style={{ height: '100%', width: '100%' }}
          ref={eChartsRef}
          theme={theme || 'dark'}
          onEvents={bindEvents}
          onChartReady={() => {
            setRendered(true);
          }}
        />
      </div>
    </div>
  );
}
