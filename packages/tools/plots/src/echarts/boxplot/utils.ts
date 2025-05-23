import {
  quantile as d3Quantile,
  median as d3Median,
  mean as d3Mean,
  deviation as d3StandardDeviation,
} from 'd3-array';

/**
 * Properties required to create a boxplot visualization
 * 
 * @property data - The data to create the boxplot from
 * @property boundIQR - The boundIQR to use for the boxplot
 */
export type CreateBoxplotProps = {
  /**
   * Input data object where each key represents a group/category and the value is an array of numbers
   */
  data: {
    [key: string]: number[];
  };
  /**
   * Multiplier for the IQR to determine the whisker lengths
   * Common values are 1.5 (default) or 3.0
   */
  boundIQR: number;
};

/**
 * Statistical properties calculated for each boxplot
 */
export type BoxplotProps = {
  /** Name/identifier of the data group */
  name: string;
  /** Lower whisker value (Q1 - boundIQR * IQR) */
  low: number;
  /** First quartile (25th percentile) */
  q1: number;
  /** Median (50th percentile) */
  q2: number;
  /** Third quartile (75th percentile) */
  q3: number;
  /** Upper whisker value (Q3 + boundIQR * IQR) */
  high: number;
  /** Arithmetic mean of the data */
  mean: number;
  /** Standard deviation of the data */
  std: number;
  /** Interquartile range (Q3 - Q1) */
  iqr: number;
};

/**
 * Output data structure compatible with eCharts boxplot series
 */
export type BoxplotDataProps = {
  /** Array of boxplot statistical properties for each data group */
  boxplots: Array<BoxplotProps>;
  /** Array of [groupName, meanValue] pairs for rendering mean points */
  meanPoint: [string, number][];
};

/**
 * Create a boxplot from a list of numbers and option boundIQR (1.5 or 3.0)
 * @param {CreateBoxplotProps} props - The properties object containing:
 * @param {Object.<string, number[]>} props.data - Input data object where each key represents a group/category and the value is an array of numbers
 * @param {number} props.boundIQR - Multiplier for the IQR to determine the whisker lengths (commonly 1.5 or 3.0)
 * @returns {BoxplotDataProps} The boxplot data containing statistical properties and mean points
 * 
 * ### Example: single boxplot
 * 
 * ```ts
 * const data = {
 *   'samples': [1, 2, 3, 4, 5],
 * };
 * const boundIQR = 1.5;
 * const boxplotData = createBoxplot({data, boundIQR});
 * ```
 * 
 * ### Example: multiple boxplots
 * 
 * ```ts
 * const data = {
 *   'samples': [1, 2, 3, 4, 5],
 *   'samples2': [6, 7, 8, 9, 10],
 * };
 * const boundIQR = 1.5;
 * const boxplotData = createBoxplot({data, boundIQR});
 * ```
 */
export function createBoxplot({
  data,
  boundIQR,
}: CreateBoxplotProps): BoxplotDataProps {
  const meanPoint: [string, number][] = [];

  // iterate through the data and calculate the boxplot data
  const boxplots: BoxplotProps[] = Object.keys(data).map((key: string) => {
    const values = data[key];
    const sortedData = values.sort((a, b) => a - b);
    const q1 = d3Quantile(sortedData, 0.25) || 0;
    const q3 = d3Quantile(sortedData, 0.75) || 0;
    const iqr = q3 - q1;
    const min = q1 - boundIQR * iqr;
    const max = q3 + boundIQR * iqr;
    const median = d3Median(sortedData) || 0;
    const mean = d3Mean(sortedData) || 0;
    const std = d3StandardDeviation(sortedData) || 0;
    meanPoint.push([key, mean]);

    return {
      name: key,
      low: min,
      q1,
      q2: median,
      q3,
      high: max,
      mean,
      std,
      iqr,
    };
  });

  return { boxplots, meanPoint };
}
