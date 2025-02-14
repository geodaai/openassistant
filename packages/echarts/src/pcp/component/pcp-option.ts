import { EChartsOption } from 'echarts';
import { numericFormatter } from '@openassistant/common';
import * as echarts from 'echarts';
import { ParallelCoordinateDataProps } from './utils';

/**
 * Configuration properties for the Parallel Coordinates Plot (PCP) chart.
 *
 * @param pcp - Parallel coordinate data properties containing configuration for the visualization
 * @param rawData - Raw data object with variable names as keys and their corresponding numeric values as arrays
 * @param theme - Theme name to be applied to the chart
 * @param isExpanded - Boolean flag indicating if the chart is in expanded state
 *
 * @example
 * ```ts
 * const pcpProps: PcpChartOptionProps = {
 *   pcp: { ... },
 *   rawData: {
 *     'population': [100, 200, 300],
 *     'income': [50000, 60000, 70000]
 *   },
 *   theme: 'light',
 *   isExpanded: false
 * };
 * ```
 */
export type PcpChartOptionProps = {
  pcp: ParallelCoordinateDataProps;
  rawData: Record<string, number[]>;
  theme: string;
  isExpanded: boolean;
};

/**
 * Creates a parallel coordinate option configuration for the PCP (Parallel Coordinates Plot) chart.
 *
 * @param props - Configuration properties for the parallel coordinate chart
 * @param props.pcp - Parallel coordinate data properties
 * @param props.rawData - Raw data object containing variable names as keys and number arrays as values
 * @param props.theme - Theme name for the chart
 * @param props.isExpanded - Flag indicating if the chart is in expanded state
 * @returns An ECharts option configuration object for parallel coordinates visualization with:
 *          - Parallel axis configuration
 *          - Brushing interaction setup
 *          - Series styling and data mapping
 *          - Layout and grid settings
 *
 * @example
 * ```ts
 * const option = createParallelCoordinateOption({
 *   pcp: parallelCoordProps,
 *   rawData: {
 *     'population': [100, 200, 300],
 *     'income': [50000, 60000, 70000]
 *   },
 *   theme: 'light',
 *   isExpanded: false
 * });
 * ```
 */
export function createParallelCoordinateOption(
  props: PcpChartOptionProps
): EChartsOption {
  const variableNames = Object.keys(props.rawData);

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

  // transpose the raw data so eCharts can render it
  let dataRowWise: number[][] = [];
  if (props.rawData) {
    // Get arrays directly from rawData
    const columns = Object.values(props.rawData);
    const rowCount = columns[0].length;
    // Pre-allocate the result array for better performance
    dataRowWise = new Array(rowCount);
    for (let i = 0; i < rowCount; i++) {
      dataRowWise[i] = new Array(columns.length);
      for (let j = 0; j < columns.length; j++) {
        dataRowWise[i][j] = columns[j][i];
      }
    }
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
      data: dataRowWise,
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
