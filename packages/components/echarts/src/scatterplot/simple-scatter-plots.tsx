// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  BrushComponent,
  ToolboxComponent,
} from 'echarts/components';
import { LineChart, ScatterChart } from 'echarts/charts';
import ReactEChartsCore from 'echarts-for-react';
import { CanvasRenderer } from 'echarts/renderers';
import { useMemo, useRef, useState } from 'react';
import { OnSelected } from '@openassistant/plots';
import { useBrushLink } from '@openassistant/hooks';

import { getSimpleScatterChartOption } from './simple-chart-option';
import { handleBrushSelection } from '../echarts-updater';

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
  id?: string;
  datasetName: string;
  variableX: string;
  xData: number[];
  variableY: string;
  yData: number[];
  theme?: string;
  onSelected?: OnSelected;
  setFilteredIndexes?: (filteredIndex: number[]) => void;
};

/**
 * @internal
 */
export function SimpleScatterPlot({
  id,
  datasetName,
  variableX,
  xData,
  variableY,
  yData,
  theme = 'dark',
  setFilteredIndexes,
  onSelected,
}: SimpleScatterPlotProps) {
  // ref for the echarts instance
  const eChartsRef = useRef<ReactEChartsCore>(null);
  const [rendered, setRendered] = useState(false);

  // link when other components update
  const { brush, componentId } = useBrushLink({
    defaultDataId: datasetName,
    componentId: id,
    onLink: (highlightedRows, sourceDataId) => {
      console.log(
        `Chart One (${componentId}) received update for ${sourceDataId}:`,
        highlightedRows
      );
      if (
        rendered &&
        eChartsRef.current &&
        highlightedRows &&
        componentId !== sourceDataId
      ) {
        const chartInstance = eChartsRef.current?.getEchartsInstance();
        // cancel current highlight
        chartInstance?.dispatchAction({ type: 'downplay' });
        // highlight the new rows
        if (highlightedRows.length < xData.length) {
          chartInstance?.dispatchAction({
            type: 'highlight',
            dataIndex: highlightedRows,
          });
        }
      }
    },
  });

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

        handleBrushSelection(eChart, brushed, datasetName, brush, onSelected);
        // update the filtered indexes
        if (setFilteredIndexes) {
          setFilteredIndexes(brushed);
        }
      },
      rendered: function () {
        setRendered(true);
      },
    }),
    [brush, datasetName, setFilteredIndexes, onSelected]
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
