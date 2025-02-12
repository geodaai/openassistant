import { numericFormatter } from '@openassistant/common';
import { EChartsOption } from 'echarts';
import { YAXisOption, XAXisOption, TooltipOption } from 'echarts/types/dist/shared';
import * as echarts from 'echarts';

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
      values?.map((value: number) =>
        isExpanded ? [dataIndex, value] : [value, dataIndex]
      ) || []
  );

  // build mean point data for series
  const meanPointData = meanPoint.map((mp, dataIndex) =>
    isExpanded ? [dataIndex, mp[1]] : [mp[1], dataIndex]
  );

  // build scatter
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

  const yAxis = {
    type: isExpanded ? ('value' as const) : ('category' as const),
    boundaryGap: true,
    splitArea: { show: false },
    splitLine: {
      show: isExpanded,
      interval: 'auto',
      lineStyle: { color: theme === 'dark' ? '#333' : '#f3f3f3' },
    },
    axisLine: {
      show: isExpanded,
      onZero: false,
    },
    axisTick: { show: isExpanded },
    axisLabel: isExpanded
      ? {
          formatter: numericFormatter as unknown as
            | string
            | ((value: string) => string),
        }
      : {
          formatter: function (d: string, i: number) {
            return boxData[i]?.name ?? '';
          },
        },
  } as YAXisOption;

  const xAxis = {
    type: isExpanded ? ('category' as const) : ('value' as const),
    axisLabel: isExpanded
      ? {
          formatter: function (d: string, i: number) {
            return boxData[i]?.name ?? '';
          },
        }
      : {
          formatter: numericFormatter,
        },
    splitLine: {
      show: !isExpanded,
      interval: 'auto',
      lineStyle: { color: theme === 'dark' ? '#333' : '#f3f3f3' },
    },
    splitArea: { show: false },
    axisTick: { show: !isExpanded },
    axisLine: { show: !isExpanded },
  } as XAXisOption;

  const tooltip =
    {
      trigger: 'item',
      formatter: (params: echarts.DefaultLabelFormatterCallbackParams) => {
        if (params && params.componentSubType === 'scatter' && params.value) {
          return `${numericFormatter(params.value[0])}`;
        }
      },
    };
  
  // build option for echarts
  const option: EChartsOption = {
    yAxis,
    xAxis,
    series,
    brush: {
      toolbox: ['rect', 'keep', 'clear'],
      xAxisIndex: 0,
      throttleType: 'debounce',
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
    tooltip: tooltip as echarts.TooltipComponentOption,
    // avoid flickering when brushing
    progressive: 0,
  };
  return option;
}
