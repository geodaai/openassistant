import { CanvasRenderer } from 'echarts/renderers';
import { ParallelChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { useMemo, useRef, useState } from 'react';
import { useBrushLink } from '@openassistant/common';

import { ECHARTS_DARK_THEME } from '../../echarts-theme';
import { ParallelCoordinateDataProps } from './utils';
import { createParallelCoordinateOption } from './pcp-option';
import { handleBrushSelection } from '../../echarts-updater';

// Register the required components
echarts.use([CanvasRenderer, ParallelChart]);
echarts.registerTheme('dark', ECHARTS_DARK_THEME);

/**
 * Props for the Parallel Coordinate Plot component
 * @interface ParallelCoordinateOutputData
 * @property {string} id - Unique identifier for the component
 * @property {string} datasetName - Name of the dataset being visualized
 * @property {string[]} variables - Array of variable names to display
 * @property {ParallelCoordinateDataProps} pcp - Configuration for parallel coordinate plot
 * @property {Record<string, number[]>} rawData - Raw data for the plot, mapping variable names to arrays of values
 * @property {string} [theme] - Optional theme name for the chart ('dark' by default)
 * @property {boolean} [isDraggable] - Optional flag to enable dragging
 * @property {boolean} [isExpanded] - Optional flag for expanded state
 * @property {(isExpanded: boolean) => void} [setIsExpanded] - Optional callback to handle expansion state changes
 */
export type ParallelCoordinateOutputData = {
  id: string;
  datasetName: string;
  variables: string[];
  pcp: ParallelCoordinateDataProps;
  rawData: Record<string, number[]>;
  theme?: string;
  isDraggable?: boolean;
  isExpanded?: boolean;
  setIsExpanded?: (isExpanded: boolean) => void;
};

/**
 * A React component that renders a Parallel Coordinate Plot using ECharts
 *
 * This component visualizes multivariate data using parallel coordinates, where each vertical
 * axis represents a variable and each line represents an observation. It supports interactive
 * brushing and linking with other components through the useBrushLink hook.
 *
 * @component
 * @param {ParallelCoordinateOutputData} props - Component props
 * @returns {JSX.Element} Rendered parallel coordinate plot
 *
 * @example
 * ```tsx
 * <ParallelCoordinatePlot
 *   id="pcp1"
 *   datasetName="dataset1"
 *   variables={['var1', 'var2', 'var3']}
 *   pcp={pcpData}
 *   rawData={data}
 *   theme="dark"
 * />
 * ```
 */
export function ParallelCoordinatePlot(props: ParallelCoordinateOutputData) {
  const { id, datasetName, variables, pcp, rawData, theme, isExpanded } = props;

  const option = useMemo(() => {
    return createParallelCoordinateOption({
      pcp,
      rawData,
      theme: theme || 'dark',
      isExpanded: isExpanded || false,
    });
  }, [pcp, rawData, theme, isExpanded]);

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
        if (highlightedRows.length < Object.values(rawData)[0].length) {
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
          console.log('brushSelected: params = ', params);
          const chartInstance = eChartsRef.current.getEchartsInstance();
          // @ts-expect-error todo: will fix later getModel() is private
          const series = chartInstance.getModel().getSeries()[0];
          const brushed: number[] = series.getRawIndicesByActiveState('active');

          // clear any highlighted if no data is brushed
          if (chartInstance && brushed.length === 0) {
            chartInstance.dispatchAction({ type: 'downplay' });
            // clear the selection area on axis by just re-rendering the chart
            chartInstance.setOption(option);
          }
          handleBrushSelection(chartInstance, brushed, datasetName, brush);
        }
      },
      rendered: function () {
        setRendered(true);
      },
    }),
    [datasetName, brush, option]
  );

  return useMemo(
    () => (
      <div className="h-full w-full flex flex-col rounded-lg bg-default-100 p-6 text-gray-900 shadow-secondary-1 dark:bg-gray-950 dark:text-gray-100">
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
}
