import { EChartsOption } from 'echarts';
import { numericFormatter } from '@openassistant/common';
import * as echarts from 'echarts';

export type PcpChartOptionProps = {
  variableNames: string[];
  rawDataArray: number[][]
};

/**
 * Creates a parallel coordinate option for the PCP chart.
 * 
 * @param {Object} params - The parameters for creating the parallel coordinate option
 * @param {string[]} params.variableNames - The names of the variables
 * @param {number[][]} params.rawDataArray - The raw data array
 * @returns {EChartsOption} The parallel coordinate option
 */
export function createParallelCoordinateOption({
  variableNames,
  rawDataArray,
}: PcpChartOptionProps): EChartsOption {
  // get the longest label length of variableNames
  const maxLabelLength = Math.max(
    ...variableNames.map(
      (name) =>
        // Use echarts.format.getTextRect to get accurate text dimensions
        echarts.format.getTextRect(name).width
    )
  );
  // Add some padding (e.g., 20px) to ensure text doesn't get cut off
  const maxLabelPixel = maxLabelLength + 20;

  const axis = variableNames.map((variable, index) => ({
    dim: index,
    name: variable,
  }));
  let dataCols: number[][] = [];
  if (rawDataArray) {
    const transposedData = rawDataArray[0].map((_, colIndex) =>
      rawDataArray.map((row) => row[colIndex])
    );
    dataCols = transposedData;
  }

  // build option for echarts
  const option: EChartsOption = {
    parallel: {
      left: '5%',
      right: `${maxLabelPixel}px`,
      top: '23%',
      bottom: '15%',
      layout: 'vertical',
      parallelAxisDefault: {
        axisLabel: {
          formatter: numericFormatter,
        },
      },
    },
    brush: {
      toolbox: ['rect', 'keep', 'clear'],
      brushLink: 'all',
      inBrush: {
        color: '#0096C7',
        opacity: 0.8,
      },
      outOfBrush: {
        opacity: 0.5,
      },
    },
    parallelAxis: axis,
    series: {
      type: 'parallel',
      lineStyle: {
        width: 0.5,
        opacity: 0.8,
        color: 'lightblue',
      },
      data: dataCols,
      // highlight
      emphasis: {
        focus: 'series',
        lineStyle: {
          color: 'red',
          opacity: 0.5,
        },
      },
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
    // avoid flickering when brushing
    progressive: 0,
  };
  return option;
}
