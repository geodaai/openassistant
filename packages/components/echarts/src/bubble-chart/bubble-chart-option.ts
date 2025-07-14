// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { EChartsOption } from 'echarts';
import {
  CallbackDataParams,
  TopLevelFormatterParams,
} from 'echarts/types/dist/shared';

import { BubbleChartOutputData } from './bubble-chart';

/**
 * Creates an ECharts option configuration for rendering a bubble chart.
 *
 * @param props - The input data for the bubble chart
 * @param props.data - The data object containing the following variables:
 *   - variableX: The X-axis variable containing name and values
 *   - variableY: The Y-axis variable containing name and values
 *   - variableSize: The variable controlling bubble sizes, containing name and values
 *   - variableColor: Optional variable controlling bubble colors, containing name and values
 *
 * @returns An ECharts option configuration object that defines:
 * - Scatter plot with variable-sized bubbles
 * - Customizable bubble colors
 * - Interactive tooltips showing data points' details
 * - Brush selection tools
 * - Responsive grid layout
 * - Optimized animation settings for performance
 *
 * @example
 * const data = {
 *   variableX: { name: 'GDP', values: [1000, 2000, 3000] },
 *   variableY: { name: 'Life Expectancy', values: [70, 75, 80] },
 *   variableSize: { name: 'Population', values: [1000000, 2000000, 3000000] },
 *   variableColor: { name: 'Region', values: ['A', 'B', 'C'] }
 * };
 * const option = createBubbleChartOption({ data });
 */
export function createBubbleChartOption(data: BubbleChartOutputData['data']) {
  const xData = data.variableX.values;
  const yData = data.variableY.values;
  const sizeData = data.variableSize.values;
  const colorData = data.variableColor?.values;

  const variableX = data.variableX.name;
  const variableY = data.variableY.name;

  // standardize sizeData in the range [0, 1]
  const sizeDataMin = Math.min(...sizeData);
  const sizeDataMax = Math.max(...sizeData);
  const sizeDataRange = sizeDataMax - sizeDataMin;
  const sizeDataStandardized = sizeData.map(
    (d) => (50 * (d - sizeDataMin)) / sizeDataRange
  );

  const seriesData = xData.map((x, i) => [
    x,
    yData[i],
    sizeDataStandardized[i],
    colorData?.[i] || 0,
  ]);

  const option: EChartsOption = {
    xAxis: {
      type: 'value',
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: { show: false },
    },
    series: [
      {
        data: seriesData,
        type: 'scatter',
        symbolSize: function (params: CallbackDataParams) {
          return params[2]; // the third element in the data array for size adjustments
        },
        itemStyle: {
          color: function (params: CallbackDataParams) {
            return params[3] || 'lightblue'; // fourth element for color
          },
          borderColor: '#555',
          opacity: 0.5,
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderColor: 'red',
          },
        },
        animationDelay: 0,
      },
    ],
    tooltip: {
      trigger: 'item' as const,
      formatter: (params: TopLevelFormatterParams) => {
        const { dataIndex, value } = params as CallbackDataParams;
        const sizeValue = sizeDataStandardized[dataIndex].toFixed(2);
        return value
          ? `${variableX}: ${value[0]}<br/>${variableY}: ${value[1]}<br/>Size: ${sizeValue}` +
              (value[3] ? `<br/>Color: ${value[3]}` : '')
          : '';
      },
      axisPointer: {
        type: 'cross',
      },
    },
    brush: {
      toolbox: ['rect', 'polygon', 'clear'],
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
    grid: {
      left: '3%',
      right: '5%',
      bottom: '3%',
      containLabel: true,
    },
    animation: false,
    progressive: 0,
  };

  return option;
}
