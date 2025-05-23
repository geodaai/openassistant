import { EChartsOption } from 'echarts';
import { SimpleLinearRegressionResult } from '@openassistant/plots';
import { numericFormatter } from '@openassistant/utils';

export type MoranScatterChartOptionProps = {
  xVariableName: string;
  xData: number[];
  yVariableName: string;
  yData: number[];
  regression: SimpleLinearRegressionResult;
  theme?: string;
};

export function getMoranScatterChartOption(
  props: MoranScatterChartOptionProps
): EChartsOption {
  const { xVariableName, xData, yVariableName, yData, regression, theme } =
    props;
  const slope = regression.slope;
  const intercept = regression.intercept;
  const seriesData = xData.map((x, i) => [x, yData[i]]);

  const padding = (Math.max(...xData) - Math.min(...xData)) * 0.2;
  const extendedMinX = Math.min(...xData) - padding;
  const extendedMaxX = Math.max(...xData) + padding;
  const regressionLineData = [
    [extendedMinX, slope * extendedMinX + intercept],
    [extendedMaxX, slope * extendedMaxX + intercept],
  ];

  const option: EChartsOption = {
    title: {
      text: `Moran's I ${slope.toFixed(3)}`,
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 10,
        color: theme === 'dark' ? '#fff' : '#555',
      },
    },
    xAxis: {
      type: 'value' as const,
      splitLine: { show: false },
      axisLabel: {
        formatter: numericFormatter,
      },
    },
    yAxis: {
      type: 'value' as const,
      splitLine: { show: false },
      axisLabel: {
        formatter: numericFormatter,
      },
    },
    series: [
      {
        data: seriesData,
        type: 'scatter',
        symbolSize: 6,
        itemStyle: {
          color: 'lightblue',
          borderColor: '#555',
          opacity: 0.8,
          borderWidth: 1,
        },
        // highlight
        emphasis: {
          focus: 'series',
          scale: 1.1,
          itemStyle: {
            color: 'red',
            borderWidth: 1,
          },
        },
        animationDelay: 0,
      },
      {
        type: 'line',
        data: regressionLineData,
        showSymbol: false,
        itemStyle: {
          color: '#ff6666',
        },
        lineStyle: {
          width: 2,
          type: 'dashed',
        },
      },
    ],
    tooltip: {
      trigger: 'item',
      zlevel: 1000000,
      formatter: (params) =>
        `${xVariableName}: ${numericFormatter(params.value[0])}<br/>${yVariableName}: ${numericFormatter(params.value[1])}`,
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
    // avoid flickering when brushing
    animation: false,
    progressive: 0,
  };

  return option;
}
