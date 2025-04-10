import { useMemo, useRef, useState } from 'react';
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

/**
 * The data for the box plot
 *
 * @property id - The id of the box plot
 * @property datasetName - The name of the dataset
 * @property variables - The variables of the box plot
 * @property boxplotData - The data for the box plot
 * @property data - The raw data for rendering points in box plot, and used in brushing and linking. See {@link CreateBoxplotProps} for more details.
 * @property boundIQR - The multiplier for the IQR to determine the whisker lengths. See {@link CreateBoxplotProps} for more details.
 * @property theme (optional) - The theme of the box plot
 * @property isExpanded (optional) - Whether the box plot is expanded
 * @property isDraggable (optional) - Whether the box plot is draggable
 * @property setIsExpanded (optional) - The callback to toggle expanded state
 */
export type BoxplotOutputData = {
  id: string;
  datasetId?: string;
  datasetName: string;
  variables: string[];
  boxplotData: BoxplotDataProps;
  theme?: string;
  showMore?: boolean;
  isExpanded?: boolean;
  isDraggable?: boolean;
  setIsExpanded?: (isExpanded: boolean) => void;
  height?: number;
  width?: number;
} & CreateBoxplotProps;

/**
 * The react component of a box plot using eCharts
 */
export const Boxplot = (props: BoxplotOutputData) => {
  const {
    id,
    datasetId,
    datasetName,
    variables,
    data: rawData,
    theme,
    boxplotData,
  } = props;
  const seriesIndex = variables.map((_, i) => i);

  // get chart option by calling getChartOption only once
  const option = useMemo(() => {
    return getBoxPlotChartOption({
      rawData,
      boxplots: boxplotData.boxplots,
      meanPoint: boxplotData.meanPoint,
      theme: theme || 'dark',
      isExpanded: props.isExpanded || false,
    });
  }, [boxplotData, props.isExpanded, rawData, theme]);

  const eChartsRef = useRef<ReactEChartsCore>(null);
  // track if the chart has been rendered, so we can update the chart later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rendered, setRendered] = useState(false);

  const { brush, componentId } = useBrushLink({
    defaultDataId: datasetId || datasetName,
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
        chartInstance?.dispatchAction({ type: 'downplay' });
        if (highlightedRows.length < Object.values(rawData)[0].length) {
          // chartInstance.dispatchAction({type: 'brush', command: 'clear', areas: []});
          chartInstance?.dispatchAction({
            type: 'highlight',
            dataIndex: highlightedRows,
            ...(seriesIndex ? { seriesIndex } : {}),
          });
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
          datasetId || datasetName,
          eChartsRef.current?.getEchartsInstance(),
          brush
        );
      },
      rendered: function () {
        setRendered(true);
      },
    }),
    [id, datasetId, datasetName, brush]
  );

  return useMemo(
    () => (
      <div className="h-full w-full flex flex-col rounded-lg pt-6 text-gray-900 dark:text-gray-100">
        <div className="flex-col items-start p-2">
          <p className="text-tiny font-bold uppercase">{variables.join(',')}</p>
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
    ),
    [variables, datasetName, option, theme, bindEvents]
  );
};
