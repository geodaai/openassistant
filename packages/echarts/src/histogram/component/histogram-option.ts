import { EChartsOption } from 'echarts';
import { numericFormatter } from '@openassistant/common';
import { TopLevelFormatterParams, CallbackDataParams } from 'echarts/types/dist/shared';

export type HistogramDataProps = {
  bin: number;
  binStart: number;
  binEnd: number;
};

const defaultBarColors = [
  '#FF6B6B',
  '#48BB78',
  '#4299E1',
  '#ED64A6',
  '#F6E05E',
];

export function getHistogramChartOption(
  filteredIndex: number[] | null,
  histogramData: HistogramDataProps[],
  barDataIndexes: number[][]
): EChartsOption {
  const hasHighlighted = filteredIndex && filteredIndex.length > 0;

  // create a dictionary to store the indexes of data items that have been filtered
  const filteredIndexDict: { [key: number]: boolean } = {};
  if (hasHighlighted) {
    filteredIndex.forEach((d: number) => {
      filteredIndexDict[d] = true;
    });
  }

  // build highlighted bars from filteredIndex and filteredIndexDict
  const highlightedBars = histogramData.map(
    (d: HistogramDataProps, i: number) => {
      // get highlighted ids for each bar
      const highlightedIds = barDataIndexes[i].filter(
        (d: number) => filteredIndexDict[d] === true
      );

      return {
        value: hasHighlighted ? highlightedIds?.length : 0,
        itemStyle: {
          color: defaultBarColors[i % defaultBarColors.length],
          opacity: 1,
        },
        name: `[${numericFormatter(d.binStart)} - ${numericFormatter(
          d.binEnd
        )}]`,
        // ids that associated with the bar and been filtered
        ids: hasHighlighted ? highlightedIds : [],
      };
    }
  );

  // use binStart values as the x axis tick values
  // const xTickValues = plotData.map((d: HistogramDataProps) => d.binStart.toFixed(1));

  // get min value from plotData
  const minValue = histogramData[0].binStart;
  const maxValue = histogramData[histogramData.length - 1].binEnd;
  const numBins = histogramData.length;
  const interval = (maxValue - minValue) / numBins;

  // get bar data from plotData
  const barData = histogramData.map((d: HistogramDataProps, i: number) => {
    return {
      value: hasHighlighted
        ? barDataIndexes[i].length - highlightedBars[i].value
        : barDataIndexes[i].length,
      itemStyle: {
        color: defaultBarColors[i % defaultBarColors.length],
        opacity: hasHighlighted ? 0.5 : 1,
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.3)',
      },
      name: `[${numericFormatter(d.binStart)} - ${numericFormatter(d.binEnd)}]`,
      // ids that associated with the bar and been filtered
      ids: barDataIndexes[i],
    };
  });

  const series = [
    {
      data: highlightedBars,
      type: 'bar' as const,
      barWidth: '90%',
      stack: 'total',
      xAxisIndex: 0,
    },
    {
      data: barData,
      type: 'bar' as const,
      barWidth: '90%',
      stack: 'total',
      xAxisIndex: 0,
      label: {
        show: false,
        position: [0, -15],
        formatter: function (params: CallbackDataParams): string {
          return params.value as number + '';
        },
      },
    },
  ];

  // build option for echarts
  const option: EChartsOption = {
    xAxis: [
      {
        type: 'category',
        // data: xTickValues,
        // axisLabel: {
        //   interval: 0,
        //   hideOverlap: true
        // },
        // axisTick: {
        //   alignWithLabel: false,
        //   interval: 0
        // },
        axisTick: { show: false },
        axisLabel: { show: false },
        axisLine: { show: false },
        position: 'bottom',
        splitLine: {
          show: false,
        },
      },
      {
        scale: true,
        type: 'value',
        min: minValue,
        max: maxValue,
        interval: interval,
        axisLabel: {
          hideOverlap: true,
          rotate: 35,
          overflow: 'truncate',
          formatter: numericFormatter,
        },
        splitLine: {
          show: false,
        },
        position: 'bottom',
      },
    ],
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: numericFormatter,
      },
      splitLine: {
        show: false,
      },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    series,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (
        params: TopLevelFormatterParams | TopLevelFormatterParams[]
      ) {
        const paramsArray = Array.isArray(params) ? params : [params];
        // ids that associated with the bar
        const range = (paramsArray[1] as { data: { name: string } }).data.name;
        const count = (paramsArray[1] as { value: number }).value;
        return `Range: ${range}<br/> # Items: ${count}`;
      },
    },
    brush: {
      toolbox: ['rect', 'keep', 'clear'],
      xAxisIndex: 0,
    },
    grid: [
      {
        left: '3%',
        right: '5%',
        top: '20%',
        bottom: '0%',
        containLabel: true,
        height: 'auto',
      },
    ],
  };

  return option;
}
