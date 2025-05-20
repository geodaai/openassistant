import { WeightsMeta } from '@geoda/core';
import { useMemo, useRef, useState } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import {
  TooltipComponent,
  GridComponent,
  BrushComponent,
  ToolboxComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { ScatterChart, LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { SimpleLinearRegressionResult } from '@openassistant/plots';
import { handleBrushSelection } from '../echarts-updater';
import { getMoranScatterChartOption } from './moran-scatter-option';
import { useBrushLink } from '../../hooks/use-brush-link';

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

export type MoranScatterOutputData = {
  id?: string;
  datasetName: string;
  variableName: string;
  weights: number[][];
  weightsMeta: WeightsMeta;
  values: number[];
  lagValues: number[];
  regression: SimpleLinearRegressionResult;
  theme?: string;
  isDraggable?: boolean;
  isExpanded?: boolean;
};

export function isMoranScatterOutputData(
  data: unknown
): data is MoranScatterOutputData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'datasetName' in data &&
    'variableName' in data &&
    'weights' in data &&
    'weightsMeta' in data
  );
}

export function MoranScatterComponent(props: MoranScatterOutputData) {
  // get chart option for eCharts
  const option = useMemo(() => {
    return getMoranScatterChartOption({
      xVariableName: props.variableName,
      xData: props.values,
      yVariableName: 'Spatial Lag',
      yData: props.lagValues,
      regression: props.regression,
    });
  }, [props.variableName, props.values, props.lagValues, props.regression]);

  const eChartsRef = useRef<ReactEChartsCore>(null);
  // track if the chart has been rendered, so we can update the chart later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rendered, setRendered] = useState(false);

  // link when other components update
  const { brush, componentId } = useBrushLink({
    defaultDataId: props.datasetName,
    componentId: props.id,
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
        if (highlightedRows.length < props.values.length) {
          chartInstance?.dispatchAction({
            type: 'highlight',
            dataIndex: highlightedRows,
          });
        }
      }
    },
  });

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

        handleBrushSelection(eChart, brushed, props.datasetName, brush);
      },
      rendered: function () {
        setRendered(true);
      },
    }),
    [brush, props.datasetName]
  );

  return (
    <div className="h-full w-full flex flex-col rounded-lg  text-gray-900 shadow-secondary-1 dark:bg-gray-950 dark:text-gray-100">
      <div className="flex-col items-start p-2">
        <p className="text-tiny font-bold uppercase">{props.variableName}</p>
        <small className="truncate text-default-500">
          {props.variableName}
        </small>
      </div>
      <div style={{ height: '100%' }} className="py-2 flex-grow">
        <ReactEChartsCore
          option={option}
          notMerge={true}
          lazyUpdate={true}
          style={{ height: '100%', width: '100%' }}
          ref={eChartsRef}
          theme={props.theme || 'dark'}
          onEvents={bindEvents}
          onChartReady={() => {
            setRendered(true);
          }}
        />
      </div>
    </div>
  );
}
