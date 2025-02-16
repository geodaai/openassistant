import { useBrushLink } from '@openassistant/common';
import { useMemo, useRef, useState } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import { ScatterChart } from 'echarts/charts';
import {
  TooltipComponent,
  GridComponent,
  BrushComponent,
  ToolboxComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';

import { ECHARTS_DARK_THEME } from '../../echarts-theme';
import { handleBrushSelection } from '../../echarts-updater';
import AutoSizer from 'react-virtualized-auto-sizer';
import { createBubbleChartOption } from './bubble-chart-option';

// Register the required components
echarts.use([
  TooltipComponent,
  GridComponent,
  ScatterChart,
  CanvasRenderer,
  BrushComponent,
  ToolboxComponent,
]);
echarts.registerTheme('dark', ECHARTS_DARK_THEME);

export type BubbleChartOutputData = {
  id?: string;
  datasetName: string;
  data: {
    variableX: {
      name: string;
      values: number[];
    };
    variableY: {
      name: string;
      values: number[];
    };
    variableSize: {
      name: string;
      values: number[];
    };
    variableColor?: {
      name: string;
      values: (number | string)[];
    };
  };
  theme?: string;
  isExpanded?: boolean;
  isDraggable?: boolean;
};

export function BubbleChart(props: BubbleChartOutputData): JSX.Element | null {
  const { id, datasetName, data, theme } = props;

  const option = useMemo(() => {
    return createBubbleChartOption(props);
  }, [props]);

  const eChartsRef = useRef<ReactEChartsCore>(null);
  // track if the chart has been rendered, so we can update the chart later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        if (highlightedRows.length < data.variableX.values.length) {
          chartInstance?.dispatchAction({
            type: 'highlight',
            dataIndex: highlightedRows,
          });
        }
      }
    },
  });

  // brush to trigger other components to update
  const bindEvents = useMemo(
    () => ({
      brushSelected: function (params) {
        if (eChartsRef.current) {
          const eChart = eChartsRef.current?.getEchartsInstance();
          const brushed: number[] = [];
          const brushComponent = params.batch[0];
          for (let sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
            const rawIndices = brushComponent.selected[sIdx].dataIndex;
            // merge rawIndices to brushed
            brushed.push(...rawIndices);
          }
          console.log('brushed', brushed);
          // check if brushed.length is 0 after 100ms, since brushSelected may return empty array for some reason?!
          setTimeout(() => {
            if (eChart && brushed.length === 0) {
              // clear any highlighted if no data is brushed
              eChart.dispatchAction({ type: 'downplay' });
            }
          }, 100);

          handleBrushSelection(eChart, brushed, datasetName, brush);
        }
      },
      rendered: function () {
        setRendered(true);
      },
    }),
    [datasetName, brush]
  );

  return useMemo(
    () => (
      <AutoSizer>
        {({ height, width }) => (
          <div style={{ height, width }}>
            <div
              style={{ height: '100%' }}
              className="h-full w-full flex flex-col rounded-lg bg-default-100 p-6 text-gray-900 shadow-secondary-1 dark:bg-gray-950 dark:text-gray-100"
            >
              <div className="flex-col items-start p-2">
                <p className="text-tiny font-bold uppercase">
                  {`x: ${data.variableX.name}, y: ${data.variableY.name}, size: ${data.variableSize.name}`}
                  {data.variableColor && `, color: ${data.variableColor.name}`}
                </p>
                <small className="text-default-500">{datasetName}</small>
              </div>
              <div style={{ height: '100%' }} className="py-2 flex-grow">
                <ReactEChartsCore
                  echarts={echarts}
                  option={option}
                  notMerge={true}
                  lazyUpdate={true}
                  theme={theme || 'dark'}
                  onEvents={bindEvents}
                  style={{ height: '100%', width: '100%' }}
                  ref={eChartsRef}
                />
              </div>
            </div>
          </div>
        )}
      </AutoSizer>
    ),
    [
      data.variableX.name,
      data.variableY.name,
      data.variableSize.name,
      data.variableColor,
      datasetName,
      option,
      theme,
      bindEvents,
    ]
  );
}
