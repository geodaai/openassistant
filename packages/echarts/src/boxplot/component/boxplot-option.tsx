import { numericFormatter } from '@openassistant/common';
import { EChartsOption } from 'echarts';

export type BoxPlotChartOptionProps = {
  rawData: { [key: string]: number[] };
  boxData: Array<{
    name: string;
    value: [number, number, number, number, number];
  }>;
  meanPoint: [string, number][];
  theme: string;
  isExpanded: boolean;
};

export function getBoxPlotChartOption({
  rawData,
  boxData,
  meanPoint,
  theme,
  isExpanded,
}: BoxPlotChartOptionProps): EChartsOption {
  // build box plot data using rawData in the form of [value, index]
  const pointsData = Object.values(rawData)?.map(
    (values, dataIndex) =>
      values?.map((value: number) => [value, dataIndex]) || []
  );

  // build mean point data for series
  const meanPointData = meanPoint.map((mp, dataIndex) => [mp[1], dataIndex]);

  const scatterSeries =
    pointsData?.map((data) => ({
      type: 'scatter' as const,
      data,
      symbolSize: 6,
      symbol: data.length > 1000 ? 'rect' : 'circle',
      itemStyle: {
        color: 'lightblue',
        borderColor: '#aaa',
      },
      // highlight
      emphasis: {
        focus: 'series' as const,
        symbolSize: 6,
        itemStyle: {
          color: 'red',
          borderWidth: 1,
        },
      },
    })) || [];

  const series = [
    ...scatterSeries,
    {
      type: 'boxplot' as const,
      data: boxData,
      itemStyle: {
        borderColor: theme === 'dark' ? 'white' : 'black',
        color: '#DB631C',
        opacity: 1,
      },
      emphasis: {
        focus: 'none' as const,
        disabled: true,
      },
    },
    {
      type: 'scatter' as const,
      data: meanPointData,
      symbolSize: 8,
      itemStyle: {
        color: '#14C814',
        borderColor: 'black',
        opacity: 1,
      },
    },
  ];

  // build option for echarts
  const option: EChartsOption = {
    yAxis: {
      type: 'category',
      boundaryGap: true,
      splitArea: { show: false },
      splitLine: { show: false },
      axisLine: {
        show: false,
        onZero: false,
      },
      axisTick: { show: false },
      axisLabel: {
        formatter: function (d: string, i: number) {
          return `${boxData[i].name}`;
        },
      },
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: numericFormatter,
      },
      splitLine: {
        show: true,
        interval: 'auto',
        lineStyle: { color: theme === 'dark' ? '#333' : '#f3f3f3' },
      },
      splitArea: { show: false },
      axisTick: { show: true },
      axisLine: { show: true },
    },
    series,
    // dataZoom: [
    //   {
    //     type: 'inside'
    //   },
    //   {
    //     type: 'slider',
    //     height: 15,
    //     bottom: 25,
    //     fillerColor: 'rgba(255,255,255,0.1)'
    //   }
    // ],
    // tooltip: {
    //   trigger: 'item',
    //   axisPointer: {
    //     type: 'shadow',
    //   },
    //   confine: true,
    //   // extraCssText: 'z-index: 9999;'
    //   // formatter: function (params: any) {
    //   //   // ids that associated with the bar
    //   //   const range = params[1].data.label;
    //   //   const count = params[1].value;
    //   //   return `Range: ${range}<br/> # Observations: ${count}`;
    //   // }
    // },
    brush: {
      toolbox: ['rect', 'keep', 'clear'],
      xAxisIndex: 0,
      brushLink: scatterSeries.map((_, index) => index),
      seriesIndex: scatterSeries.map((_, index) => index),
    },
    grid: [
      {
        left: '3%',
        right: '5%',
        top: isExpanded ? '5%' : '20%',
        bottom: '0%',
        containLabel: true,
        height: isExpanded ? '90%' : 'auto',
      },
    ],
    // avoid flickering when brushing
    progressive: 0,
  };
  return option;
}
