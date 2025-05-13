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
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  calculateLoessRegression,
  computeRegression,
  ComputeRegressionResult,
} from '@openassistant/echarts';
import { getScatterplotChartOption } from './scatter-option';

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

type ScatterRegressionPlotProps = {
  filteredIndex?: number[];
  regressionResults?: ComputeRegressionResult;
  xData: number[];
  yData: number[];
  showLoess: boolean;
  showRegressionLine: boolean;
  theme?: string;
  filteredIndexes: number[];
};

/**
 * @internal
 */
export function ScatterRegressionPlot({
  filteredIndex,
  regressionResults,
  xData,
  yData,
  showLoess = false,
  showRegressionLine = true,
  theme,
  filteredIndexes,
}: ScatterRegressionPlotProps) {
  // ref for the echarts instance
  const eChartsRef = useRef<ReactEChartsCore>(null);

  // track if the chart has been rendered, so we can update the chart later
  const [rendered, setRendered] = useState(false);

  const loessResult = useMemo(() => {
    if (!showLoess) return null;
    return calculateLoessRegression(xData, yData);
  }, [xData, yData, showLoess]);

  // get chart option by calling getChartOption only once
  const option = useMemo(() => {
    try {
      // if regressionResults is not provided, compute it
      const updatedRegressionResults =
        regressionResults ?? computeRegression({ xData, yData, filteredIndex });
      return getScatterplotChartOption({
        xData,
        yData,
        showRegressionLine: showRegressionLine ?? false,
        showLoess: showLoess ?? false,
        allRegressionResults: updatedRegressionResults.regression,
        selectedRegressionResults: updatedRegressionResults.regressionSelected,
        unselectedRegressionResults:
          updatedRegressionResults.regressionUnselected,
        ...(loessResult ? { loessResult } : {}),
      });
    } catch {
      return {};
    }
  }, [
    regressionResults,
    xData,
    yData,
    filteredIndex,
    showRegressionLine,
    showLoess,
    loessResult,
  ]);

  // when filteredIndexTrigger changes, update the chart option using setOption
  useEffect(() => {
    const chart = eChartsRef.current;
    if (rendered && filteredIndexes && chart) {
      const updatedRegressionResults = computeRegression({
        xData,
        yData,
        filteredIndex: filteredIndexes,
      });
      const updatedOption = getScatterplotChartOption({
        xData,
        yData,
        showRegressionLine: showRegressionLine ?? false,
        showLoess: showLoess ?? false,
        allRegressionResults: updatedRegressionResults.regression,
        selectedRegressionResults: updatedRegressionResults.regressionSelected,
        unselectedRegressionResults:
          updatedRegressionResults.regressionUnselected,
      });
      if (chart && updatedOption) {
        const chartInstance = chart.getEchartsInstance();
        chartInstance.setOption(updatedOption, true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredIndexes, rendered]);

  return (
    <div className="h-full w-full">
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        notMerge={true}
        lazyUpdate={false}
        theme={theme || 'dark'}
        style={{ height: '100%', width: '100%', opacity: '0.5' }}
        ref={eChartsRef}
        onChartReady={() => {
          setRendered(true);
        }}
      />
    </div>
  );
}
