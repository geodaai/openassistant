import { useMemo, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BoxplotChart, ScatterChart } from 'echarts/charts';
import {
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  BrushComponent,
  TitleComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { ECHARTS_DARK_THEME } from '../../echarts-theme';
import { BoxplotDataProps, CreateBoxplotProps } from './utils';
import { getBoxPlotChartOption } from './boxplot-option';
import { onBrushSelected } from '../../echarts-updater';
import { useBrushLink } from '@openassistant/common';

// Register the required components
echarts.use([
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  BrushComponent,
  GridComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  BoxplotChart,
  ScatterChart,
  CanvasRenderer,
]);
echarts.registerTheme('dark', ECHARTS_DARK_THEME);

export type BoxplotOutputData = {
  id: string;
  datasetName: string;
  variables: string[];
  boxplot: BoxplotDataProps;
  theme?: string;
  isExpanded?: boolean;
  isDraggable?: boolean;
  setIsExpanded?: (isExpanded: boolean) => void;
} & CreateBoxplotProps;

/**
 * The react component of a box plot using eCharts
 */
export const Boxplot = (props: BoxplotOutputData) => {
  const { id, datasetName, variables, data: rawData, theme, boxplot } = props;
  const seriesIndex = variables.map((_, i) => i);

  // get chart option by calling getChartOption only once
  const option = useMemo(() => {
    return getBoxPlotChartOption({
      rawData,
      boxData: boxplot.boxData,
      meanPoint: boxplot.meanPoint,
      theme: theme || 'dark',
      isExpanded: props.isExpanded || false,
    });
  }, [boxplot.boxData, boxplot.meanPoint, props.isExpanded, rawData, theme]);

  const eChartsRef = useRef<ReactEChartsCore>(null);
  // track if the chart has been rendered, so we can update the chart later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rendered, setRendered] = useState(false);

  const { brush, componentId } = useBrushLink({
    defaultDataId: datasetName,
    componentId: id,
    onLink: (highlightedRows, sourceDataId) => {
      console.log(
        `Chart One (${componentId}) received update for ${sourceDataId}:`,
        highlightedRows
      );
      if (
        eChartsRef.current &&
        highlightedRows &&
        componentId !== sourceDataId
      ) {
        const chartInstance = eChartsRef.current?.getEchartsInstance();
        chartInstance?.dispatchAction({ type: 'downplay' });
        if (highlightedRows.length < Object.values(rawData)[0].length) {
          // chartInstance.dispatchAction({type: 'brush', command: 'clear', areas: []});
          chartInstance?.dispatchAction({
            type: 'highlight',
            dataIndex: highlightedRows,
            ...(seriesIndex ? { seriesIndex } : {}),
          });
          // const updatedOption = getChartOption(filteredIndexes, props);
          // chartInstance.setOption(updatedOption, true);
        }
      }
    },
  });

  const bindEvents = useMemo(
    () => ({
      brushSelected: function (params) {
        onBrushSelected(
          params,
          id,
          datasetName,
          eChartsRef.current?.getEchartsInstance(),
          brush
        );
      },
      rendered: function () {
        setRendered(true);
      },
    }),
    [id, datasetName, brush]
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
                  {variables.join(',')}
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
    [variables, datasetName, option, theme, bindEvents]
  );
};
