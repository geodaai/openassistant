import { numericFormatter } from '@openassistant/common';

export type SimpleScatPlotDataProps = {
  variableX: string;
  variableY: string;
};

export function getSimpleScatterChartOption(
  xVariableName: string,
  xData: number[],
  yVariableName: string,
  yData: number[]
) {
  const seriesData = xData.map((x, i) => [x, yData[i]]);

  const option = {
    title: {
      text: ``,
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 10,
      },
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: numericFormatter,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: { show: false },
      axisLabel: {
        formatter: numericFormatter,
      },
    },
    backgroundColor: 'transparent',
    series: [
      {
        data: seriesData,
        type: 'scatter',
        symbolSize: 6,
        symbol: seriesData.length > 1000 ? 'rect' : 'circle',
        itemStyle: {
          color: 'none',
          borderColor: '#aaa',
          opacity: 1.0,
          borderWidth: 1,
        },
        // blendMode: 'source-over',
        // highlight
        emphasis: {
          // focus: 'series',
          symbolSize: 8,
          itemStyle: {
            color: 'red',
            borderWidth: 2,
          },
        },
        animationDelay: 0,
      },
    ],
    tooltip: {
      trigger: 'item',
      zlevel: 1000000,
      formatter: (params: { value: number[] }) => {
        return `${xVariableName}: ${numericFormatter(params.value[0])}<br/>${yVariableName}: ${numericFormatter(params.value[1])}`;
      },
      axisPointer: {
        type: 'cross',
      },
    },
    brush: {
      toolbox: ['rect', 'polygon', 'clear'],
      xAxisIndex: 0,
      yAxisIndex: 0,
      inBrush: {
        opacity: 1.0,
        color: 'red',
      },
      outOfBrush: {
        opacity: 0.4,
      },
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
